// src/pages/training/TrainingPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import { TRAINING_STATUS_OPTIONS, TRAINING_TYPE_OPTIONS } from '../data/dropdownOptions';

// --- Helpers ---
const STATUS_BADGE_CLASSES = {
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Planned: 'bg-blue-100 text-blue-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const getStatusBadgeClass = (status) =>
  STATUS_BADGE_CLASSES[status] || 'bg-gray-100 text-gray-800';

// Table column headers (used for rendering)
const COLUMNS = [
  { key: 'serialNo', label: 'S. No.', align: 'left' },
  { key: 'trainingRequirement', label: 'Training Requirement', align: 'left' },
  { key: 'trainingType', label: 'Type of training', align: 'left' },
  { key: 'numberOfPeople', label: 'No. of People', align: 'center' },
  { key: 'peopleToBeTrained', label: 'People to be Trained', align: 'left' },
  { key: 'peopleTrained', label: 'People Trained', align: 'left' },
  { key: 'completionDate', label: 'Completion Date', align: 'center' },
  { key: 'trainingEffort', label: 'Effort (Hrs)', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'remarks', label: 'Remarks', align: 'left' },
  { key: 'actions', label: 'Actions', align: 'center' },
];

// --- Main Component ---
const TrainingPage = () => {
  const { trainings = [], addTraining, updateTraining, removeTraining } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [formData, setFormData] = useState({
    serialNo: '',
    trainingRequirement: '',
    trainingType: 'Technical',
    numberOfPeople: 1,
    peopleToBeTrained: '',
    peopleTrained: '',
    completionDate: '',
    trainingEffort: 0,
    status: 'Planned',
    remarks: '',
  });

  // --- Stats (memoized) ---
  const stats = useMemo(() => {
    const total = trainings.length;
    const completed = trainings.filter(t => t.status === 'Completed').length;
    const totalPeople = trainings.reduce((sum, t) => sum + (t.numberOfPeople || 0), 0);
    const totalEffort = trainings.reduce((sum, t) => sum + (t.trainingEffort || 0), 0);
    return { total, completed, totalPeople, totalEffort };
  }, [trainings]);

  // --- Handlers ---
  const resetForm = (training = null) => {
    setEditingTraining(training);
    setFormData(training
      ? { ...training, numberOfPeople: training.numberOfPeople || 1, trainingEffort: training.trainingEffort || 0 }
      : {
          serialNo: (trainings.length + 1).toString(),
          trainingRequirement: '',
          trainingType: 'Technical',
          numberOfPeople: 1,
          peopleToBeTrained: '',
          peopleTrained: '',
          completionDate: '',
          trainingEffort: 0,
          status: 'Planned',
          remarks: '',
        }
    );
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      numberOfPeople: parseInt(formData.numberOfPeople) || 0,
      trainingEffort: parseFloat(formData.trainingEffort) || 0,
    };
    if (editingTraining) {
      updateTraining(editingTraining.id, data);
    } else {
      addTraining(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this training record?')) {
      removeTraining(id);
    }
  };

  // --- Render ---
  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        subtitle="Manage training requirements, track participants, completion status, and effort"
        actions={[<Button key="add" variant="primary" onClick={() => resetForm()}>+ Add Training</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Trainings', value: stats.total },
          { label: 'Completed', value: stats.completed, className: 'text-green-600' },
          { label: 'People to be Trained', value: stats.totalPeople },
          { label: 'Total Effort (Hrs)', value: stats.totalEffort },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className={`text-2xl font-bold ${item.className || ''}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Training Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {COLUMNS.map(col => (
                <th key={col.key} className={`px-4 py-3 text-${col.align}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trainings.map(training => (
              <tr key={training.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{training.serialNo}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.trainingRequirement || ''}>
                  {training.trainingRequirement || '-'}
                </td>
                <td className="px-4 py-2">{training.trainingType}</td>
                <td className="px-4 py-2 text-center">{training.numberOfPeople}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.peopleToBeTrained || ''}>
                  {training.peopleToBeTrained || '-'}
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.peopleTrained || ''}>
                  {training.peopleTrained || '-'}
                </td>
                <td className="px-4 py-2 text-center">{training.completionDate || '-'}</td>
                <td className="px-4 py-2 text-center">{training.trainingEffort}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(training.status)}`}>
                    {training.status}
                  </span>
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.remarks || ''}>
                  {training.remarks || '-'}
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap">
                  <button onClick={() => resetForm(training)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                  <button onClick={() => handleDelete(training.id)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
            {trainings.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-8 text-gray-500">
                  No training records added. Click "Add Training" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTraining ? 'Edit Training' : 'Add Training'}
        onConfirm={handleSubmit}
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Serial No." name="serialNo" value={formData.serialNo} onChange={handleFormChange} required />
            <SelectField label="Training Type" name="trainingType" options={TRAINING_TYPE_OPTIONS} value={formData.trainingType} onChange={handleFormChange} />
          </div>
          <TextAreaField label="Training Requirement" name="trainingRequirement" value={formData.trainingRequirement} onChange={handleFormChange} rows={3} required placeholder="Describe the training requirement in detail..." />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Number of People to be Trained" name="numberOfPeople" type="number" value={formData.numberOfPeople} onChange={handleFormChange} min="1" />
            <InputField label="Training Effort (Person Hours)" name="trainingEffort" type="number" value={formData.trainingEffort} onChange={handleFormChange} min="0" step="0.5" />
          </div>
          <TextAreaField label="People to be Trained (names)" name="peopleToBeTrained" value={formData.peopleToBeTrained} onChange={handleFormChange} placeholder="Enter names separated by commas" rows={2} />
          <TextAreaField label="People Trained (names)" name="peopleTrained" value={formData.peopleTrained} onChange={handleFormChange} placeholder="Enter names separated by commas" rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Training Completion Date" name="completionDate" type="date" value={formData.completionDate} onChange={handleFormChange} />
            <SelectField label="Status" name="status" options={TRAINING_STATUS_OPTIONS} value={formData.status} onChange={handleFormChange} />
          </div>
          <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={handleFormChange} rows={2} placeholder="Any additional notes or comments..." />
        </div>
      </Modal>
    </div>
  );
};

export default TrainingPage;