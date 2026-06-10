// src/pages/verification/VerificationDataPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import { PHASE_OPTIONS, VERIFICATION_ACTIVITY_OPTIONS, TYPE_OPTIONS } from '../data/dropdownOptions';


// ========== Helper Functions ==========
const getToday = () => new Date().toISOString().split('T')[0];
const totalDefects = (major = 0, minor = 0, trivial = 0) => major + minor + trivial;
const weightedDefects = (major = 0, minor = 0, trivial = 0) => major + minor * 0.33 + trivial * 0.2;

// ========== Default Form Data ==========
const DEFAULT_FORM_DATA = {
  date: getToday(),
  projectName: '',
  totalPlannedEffort: 0,
  phase: 'Analysis and Design',
  moduleSubmodule: '',
  verificationActivity: 'Review-Peer review inspection',
  type: 'Internal',
  estimatedEffort: 0,
  actualEffort: 0,
  majorDefects: 0,
  minorDefects: 0,
  trivialDefects: 0,
  closedDefects: 0,
  estimatedRework: 0,
  actualRework: 0,
  remarks: '',
};

// ========== Main Component ==========
const VerificationDataPage = () => {
  const store = useAppStore();
  const verificationEntries = store.verificationEntries || [];
  const addVerificationEntry = store.addVerificationEntry;
  const updateVerificationEntry = store.updateVerificationEntry;
  const removeVerificationEntry = store.removeVerificationEntry;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

  // Summary stats (optimized with useMemo)
  const stats = useMemo(() => {
    const entries = verificationEntries;
    const totalWeighted = entries.reduce((sum, e) => sum + weightedDefects(e.majorDefects, e.minorDefects, e.trivialDefects), 0);
    const majorSum = entries.reduce((sum, e) => sum + (e.majorDefects || 0), 0);
    const minorSum = entries.reduce((sum, e) => sum + (e.minorDefects || 0), 0);
    const trivialSum = entries.reduce((sum, e) => sum + (e.trivialDefects || 0), 0);
    return {
      totalEntries: entries.length,
      totalWeightedDefects: totalWeighted,
      major: majorSum,
      minor: minorSum,
      trivial: trivialSum,
    };
  }, [verificationEntries]);

  // Handlers
  const openModal = (entry = null) => {
    setEditingEntry(entry);
    setFormData(entry ? { ...entry } : { ...DEFAULT_FORM_DATA, date: getToday() });
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
    if (editingEntry) {
      updateVerificationEntry(editingEntry.id, formData);
    } else {
      addVerificationEntry(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this verification entry?')) {
      removeVerificationEntry(id);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Data"
        subtitle="Track defects found during reviews and testing activities"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Verification Entry</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Total Entries</p>
          <p className="text-2xl font-bold">{stats.totalEntries}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Total Weighted Defects</p>
          <p className="text-2xl font-bold">{stats.totalWeightedDefects.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Defect Categories</p>
          <p className="text-2xl font-bold">{stats.major} / {stats.minor} / {stats.trivial}</p>
          <p className="text-xs opacity-80">Major / Minor / Trivial</p>
        </div>
      </div>

      {/* Verification Entries Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="w-28 px-3 py-3 text-center sticky left-0 bg-gray-100 z-20 border-r">Date</th>
                <th className="w-52 px-3 py-3 text-left sticky left-28 bg-gray-100 z-20 border-r">Project Name <span className="text-xs text-gray-500 font-normal">(MAZDA-ADS only)</span></th>
                <th className="w-48 px-3 py-3 text-left">Total Planned Effort <span className="text-xs text-gray-500">(MAZDA-ADS only)</span></th>
                <th className="w-48 px-3 py-3 text-left">Phase</th>
                <th className="min-w-[150px] w-[150px] px-3 py-3 text-left">Module/Submodule</th>
                <th className="w-48 px-3 py-3 text-left">Verification Activity</th>
                <th className="w-24 px-3 py-3 text-center">Type</th>
                <th className="w-24 px-3 py-3 text-right">Est. Effort</th>
                <th className="w-24 px-3 py-3 text-right">Actual Effort</th>
                <th className="w-20 px-3 py-3 text-center">Major</th>
                <th className="w-20 px-3 py-3 text-center">Minor</th>
                <th className="w-20 px-3 py-3 text-center">Trivial</th>
                <th className="w-20 px-3 py-3 text-center">Total</th>
                <th className="w-20 px-3 py-3 text-center">Closed</th>
                <th className="w-24 px-3 py-3 text-right">Weighted</th>
                <th className="w-24 px-3 py-3 text-right">Est. Rework</th>
                <th className="w-24 px-3 py-3 text-right">Actual Rework</th>
                <th className="min-w-[150px] w-[150px] px-3 py-3 text-left">Remarks</th>
                <th className="w-24 px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {verificationEntries.map(entry => {
                const total = totalDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects);
                const weighted = weightedDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setViewingEntry(entry) || setIsViewModalOpen(true)}>
                    <td className="w-28 px-3 py-2 text-center sticky left-0 bg-white border-r">{entry.date}</td>
                    <td className="w-52 px-3 py-2 sticky left-28 bg-white border-r whitespace-normal break-words">{entry.projectName || '-'}</td>
                    <td className="w-48 px-3 py-2 text-center">{entry.totalPlannedEffort || 0}</td>
                    <td className="w-48 px-3 py-2">{entry.phase}</td>
                    <td className="min-w-[150px] w-[150px] px-3 py-2">{entry.moduleSubmodule || '-'}</td>
                    <td className="w-48 px-3 py-2">{entry.verificationActivity}</td>
                    <td className="w-24 px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'Internal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {entry.type}
                      </span>
                    </td>
                    <td className="w-24 px-3 py-2 text-right">{entry.estimatedEffort || 0}</td>
                    <td className="w-24 px-3 py-2 text-right font-medium">{entry.actualEffort || 0}</td>
                    <td className="w-20 px-3 py-2 text-center font-medium text-red-600">{entry.majorDefects || 0}</td>
                    <td className="w-20 px-3 py-2 text-center text-yellow-600">{entry.minorDefects || 0}</td>
                    <td className="w-20 px-3 py-2 text-center text-gray-500">{entry.trivialDefects || 0}</td>
                    <td className="w-20 px-3 py-2 text-center font-semibold">{total}</td>
                    <td className="w-20 px-3 py-2 text-center">{entry.closedDefects || 0}</td>
                    <td className="w-24 px-3 py-2 text-right font-medium">{weighted.toFixed(2)}</td>
                    <td className="w-24 px-3 py-2 text-right">{entry.estimatedRework || 0}</td>
                    <td className="w-24 px-3 py-2 text-right">{entry.actualRework || 0}</td>
                    <td className="min-w-[150px] w-[150px] px-3 py-2 text-xs">{entry.remarks || '-'}</td>
                    <td className="w-24 px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openModal(entry)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {verificationEntries.length === 0 && (
                <tr><td colSpan={19} className="text-center py-8 text-gray-500">No verification entries added. Click "Add Verification Entry" to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingEntry ? 'Edit Verification Entry' : 'Add Verification Entry'} onConfirm={handleSubmit} size="xlarge">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleFormChange} required />
            <InputField label="Project Name (MAZDA-ADS only)" name="projectName" value={formData.projectName} onChange={handleFormChange} placeholder="Enter project name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Total Planned Effort (MAZDA-ADS only)" name="totalPlannedEffort" type="number" value={formData.totalPlannedEffort} onChange={handleFormChange} step="0.5" placeholder="Hours" />
            <SelectField label="Phase" name="phase" options={PHASE_OPTIONS} value={formData.phase} onChange={handleFormChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Module/Submodule" name="moduleSubmodule" value={formData.moduleSubmodule} onChange={handleFormChange} placeholder="e.g., Login Module" />
            <SelectField label="Verification Activity" name="verificationActivity" options={VERIFICATION_ACTIVITY_OPTIONS} value={formData.verificationActivity} onChange={handleFormChange} required />
          </div>
          <SelectField label="Type" name="type" options={TYPE_OPTIONS} value={formData.type} onChange={handleFormChange} />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Estimated Effort (Person Hours)" name="estimatedEffort" type="number" value={formData.estimatedEffort} onChange={handleFormChange} step="0.5" />
            <InputField label="Actual Effort (Person Hours)" name="actualEffort" type="number" value={formData.actualEffort} onChange={handleFormChange} step="0.5" />
          </div>
          <div className="border-t pt-3">
            <h3 className="font-semibold text-md mb-3">Defects</h3>
            <div className="grid grid-cols-3 gap-4">
              <InputField label="Major Defects" name="majorDefects" type="number" value={formData.majorDefects} onChange={handleFormChange} />
              <InputField label="Minor Defects" name="minorDefects" type="number" value={formData.minorDefects} onChange={handleFormChange} />
              <InputField label="Trivial Defects" name="trivialDefects" type="number" value={formData.trivialDefects} onChange={handleFormChange} />
            </div>
          </div>
          <InputField label="Closed Defects" name="closedDefects" type="number" value={formData.closedDefects} onChange={handleFormChange} />
          <div className="border-t pt-3">
            <h3 className="font-semibold text-md mb-3">Rework Effort</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Estimated Rework (Person Hours)" name="estimatedRework" type="number" value={formData.estimatedRework} onChange={handleFormChange} step="0.5" />
              <InputField label="Actual Rework (Person Hours)" name="actualRework" type="number" value={formData.actualRework} onChange={handleFormChange} step="0.5" />
            </div>
          </div>
          <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={handleFormChange} rows={2} placeholder="Additional remarks..." />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Verification Entry Details" onConfirm={() => setIsViewModalOpen(false)} confirmText="Close" size="large">
        {viewingEntry && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Date</label><p className="font-medium">{viewingEntry.date}</p></div>
              <div><label className="text-xs text-gray-500">Project Name (MAZDA-ADS only)</label><p className="font-medium">{viewingEntry.projectName || '-'}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Total Planned Effort</label><p className="font-medium">{viewingEntry.totalPlannedEffort || 0} hrs</p></div>
              <div><label className="text-xs text-gray-500">Phase</label><p className="font-medium">{viewingEntry.phase}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Module/Submodule</label><p className="font-medium">{viewingEntry.moduleSubmodule || '-'}</p></div>
              <div><label className="text-xs text-gray-500">Verification Activity</label><p className="font-medium">{viewingEntry.verificationActivity}</p></div>
            </div>
            <div><label className="text-xs text-gray-500">Type</label><p className="font-medium">{viewingEntry.type}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Estimated Effort</label><p className="font-medium">{viewingEntry.estimatedEffort} hrs</p></div>
              <div><label className="text-xs text-gray-500">Actual Effort</label><p className="font-medium">{viewingEntry.actualEffort} hrs</p></div>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold text-sm mb-2">Defects</h4>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-xs text-gray-500">Major</label><p className="font-medium text-red-600">{viewingEntry.majorDefects || 0}</p></div>
                <div><label className="text-xs text-gray-500">Minor</label><p className="font-medium text-yellow-600">{viewingEntry.minorDefects || 0}</p></div>
                <div><label className="text-xs text-gray-500">Trivial</label><p className="font-medium">{viewingEntry.trivialDefects || 0}</p></div>
              </div>
              <div className="mt-2"><label className="text-xs text-gray-500">Closed Defects</label><p className="font-medium">{viewingEntry.closedDefects || 0}</p></div>
            </div>
            <div className="border-t pt-3">
              <h4 className="font-semibold text-sm mb-2">Rework</h4>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-gray-500">Estimated Rework</label><p className="font-medium">{viewingEntry.estimatedRework} hrs</p></div>
                <div><label className="text-xs text-gray-500">Actual Rework</label><p className="font-medium">{viewingEntry.actualRework} hrs</p></div>
              </div>
            </div>
            <div><label className="text-xs text-gray-500">Remarks</label><p className="text-sm">{viewingEntry.remarks || '-'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VerificationDataPage;