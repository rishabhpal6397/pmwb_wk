// src/pages/training/TrainingPage.jsx
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import {TRAINING_STATUS_OPTIONS, TRAINING_TYPE_OPTIONS} from '../data/dropdownOptions';

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

  const handleAddTraining = () => {
    setEditingTraining(null);
    setFormData({
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
    });
    setIsModalOpen(true);
  };

  const handleEditTraining = (training) => {
    setEditingTraining(training);
    setFormData({
      ...training,
      numberOfPeople: training.numberOfPeople || 1,
      trainingEffort: training.trainingEffort || 0,
    });
    setIsModalOpen(true);
  };

  const handleDeleteTraining = (id) => {
    if (window.confirm('Are you sure you want to delete this training record?')) {
      removeTraining(id);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (parseFloat(value) || 0) : value,
    }));
  };

  const handleSubmit = () => {
    const trainingData = {
      ...formData,
      numberOfPeople: parseInt(formData.numberOfPeople) || 0,
      trainingEffort: parseFloat(formData.trainingEffort) || 0,
    };
    if (editingTraining) {
      updateTraining(editingTraining.id, trainingData);
    } else {
      addTraining(trainingData);
    }
    setIsModalOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Planned':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  // Calculate summary stats
  const totalTrainings = trainings.length;
  const completedTrainings = trainings.filter(t => t.status === 'Completed').length;
  const totalPeopleToBeTrained = trainings.reduce((sum, t) => sum + (t.numberOfPeople || 0), 0);
  const totalEffort = trainings.reduce((sum, t) => sum + (t.trainingEffort || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training"
        subtitle="Manage training requirements, track participants, completion status, and effort"
        actions={[
          <Button key="add" variant="primary" onClick={handleAddTraining}>
            + Add Training
          </Button>,
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Trainings</p>
          <p className="text-2xl font-bold">{totalTrainings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedTrainings}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">People to be Trained</p>
          <p className="text-2xl font-bold">{totalPeopleToBeTrained}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Effort (Hrs)</p>
          <p className="text-2xl font-bold">{totalEffort}</p>
        </div>
      </div>

      {/* Training Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">S. No.</th>
              <th className="px-4 py-3 text-left">Training Requirement</th>
              <th className="px-4 py-3 text-left">Type of training</th>
              <th className="px-4 py-3 text-center">No. of People</th>
              <th className="px-4 py-3 text-left">People to be Trained</th>
              <th className="px-4 py-3 text-left">People Trained</th>
              <th className="px-4 py-3 text-center">Completion Date</th>
              <th className="px-4 py-3 text-center">Effort (Hrs)</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Remarks</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trainings.map((training) => (
              <tr key={training.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{training.serialNo}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.trainingRequirement}>
                  {training.trainingRequirement || '-'}
                </td>
                <td className="px-4 py-2">{training.trainingType}</td>
                <td className="px-4 py-2 text-center">{training.numberOfPeople}</td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.peopleToBeTrained}>
                  {training.peopleToBeTrained || '-'}
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.peopleTrained}>
                  {training.peopleTrained || '-'}
                </td>
                <td className="px-4 py-2 text-center">{training.completionDate || '-'}</td>
                <td className="px-4 py-2 text-center">{training.trainingEffort}</td>
                <td className="px-4 py-2 text-center">
                  <span className={getStatusBadgeClass(training.status)}>
                    {training.status}
                  </span>
                </td>
                <td className="px-4 py-2 max-w-xs truncate" title={training.remarks}>
                  {training.remarks || '-'}
                </td>
                <td className="px-4 py-2 text-center whitespace-nowrap">
                  <button
                    onClick={() => handleEditTraining(training)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTraining(training.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {trainings.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">
                  No training records added. Click "Add Training" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal - Fixed with proper scrolling */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTraining ? 'Edit Training' : 'Add Training'}
        onConfirm={handleSubmit}
        size="xlarge"
      >
        <div className="space-y-4">
          {/* Row 1: Serial No and Training Type */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Serial No."
              name="serialNo"
              value={formData.serialNo}
              onChange={handleFormChange}
              required
            />
            <SelectField
              label="Training Type"
              name="trainingType"
              options={TRAINING_TYPE_OPTIONS}
              value={formData.trainingType}
              onChange={handleFormChange}
            />
          </div>

          {/* Row 2: Training Requirement */}
          <TextAreaField
            label="Training Requirement"
            name="trainingRequirement"
            value={formData.trainingRequirement}
            onChange={handleFormChange}
            rows={3}
            required
            placeholder="Describe the training requirement in detail..."
          />

          {/* Row 3: Number of People and Effort */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Number of People to be Trained"
              name="numberOfPeople"
              type="number"
              value={formData.numberOfPeople}
              onChange={handleFormChange}
              min="1"
            />
            <InputField
              label="Training Effort (Person Hours)"
              name="trainingEffort"
              type="number"
              value={formData.trainingEffort}
              onChange={handleFormChange}
              min="0"
              step="0.5"
            />
          </div>

          {/* Row 4: People to be Trained */}
          <TextAreaField
            label="People to be Trained (names)"
            name="peopleToBeTrained"
            value={formData.peopleToBeTrained}
            onChange={handleFormChange}
            placeholder="Enter names separated by commas (e.g., John Doe, Jane Smith)"
            rows={2}
          />

          {/* Row 5: People Trained */}
          <TextAreaField
            label="People Trained (names)"
            name="peopleTrained"
            value={formData.peopleTrained}
            onChange={handleFormChange}
            placeholder="Enter names separated by commas (e.g., John Doe, Jane Smith)"
            rows={2}
          />

          {/* Row 6: Completion Date and Status */}
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Training Completion Date"
              name="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={handleFormChange}
            />
            <SelectField
              label="Status"
              name="status"
              options={TRAINING_STATUS_OPTIONS}
              value={formData.status}
              onChange={handleFormChange}
            />
          </div>

          {/* Row 7: Remarks */}
          <TextAreaField
            label="Remarks"
            name="remarks"
            value={formData.remarks}
            onChange={handleFormChange}
            rows={2}
            placeholder="Any additional notes or comments..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default TrainingPage;