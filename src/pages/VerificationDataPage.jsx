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

// ── Helpers ──────────────────────────────────────────────────────────────
const getToday = () => new Date().toISOString().split('T')[0];
const totalDefects = (major = 0, minor = 0, trivial = 0) => major + minor + trivial;
const weightedDefects = (major = 0, minor = 0, trivial = 0) => major + minor * 0.33 + trivial * 0.2;

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

// ── Column Definitions ──────────────────────────────────────────────────
const COLUMNS = [
  { key: 'date', label: 'Date', width: 'w-28', sticky: true, left: 0, align: 'center' },
  { key: 'projectName', label: 'Project Name', width: 'w-52', sticky: true, left: 112, align: 'left' },
  { key: 'totalPlannedEffort', label: 'Total Planned Effort', width: 'w-48', align: 'center' },
  { key: 'phase', label: 'Phase', width: 'w-48', align: 'left' },
  { key: 'moduleSubmodule', label: 'Module/Submodule', width: 'min-w-[150px] w-[150px]', align: 'left' },
  { key: 'verificationActivity', label: 'Verification Activity', width: 'w-48', align: 'left' },
  { key: 'type', label: 'Type', width: 'w-24', align: 'center' },
  { key: 'estimatedEffort', label: 'Est. Effort', width: 'w-24', align: 'right' },
  { key: 'actualEffort', label: 'Actual Effort', width: 'w-24', align: 'right' },
  { key: 'majorDefects', label: 'Major', width: 'w-20', align: 'center' },
  { key: 'minorDefects', label: 'Minor', width: 'w-20', align: 'center' },
  { key: 'trivialDefects', label: 'Trivial', width: 'w-20', align: 'center' },
  { key: 'total', label: 'Total', width: 'w-20', align: 'center' },
  { key: 'closedDefects', label: 'Closed', width: 'w-20', align: 'center' },
  { key: 'weighted', label: 'Weighted', width: 'w-24', align: 'right' },
  { key: 'estimatedRework', label: 'Est. Rework', width: 'w-24', align: 'right' },
  { key: 'actualRework', label: 'Actual Rework', width: 'w-24', align: 'right' },
  { key: 'remarks', label: 'Remarks', width: 'min-w-[150px] w-[150px]', align: 'left' },
  { key: 'actions', label: 'Actions', width: 'w-24', align: 'center' },
];

// ── Main Component ──────────────────────────────────────────────────────
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

  // ── Statistics ──
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

  // ── Handlers ──
  const openModal = (entry = null) => {
    setEditingEntry(entry);
    setFormData(entry ? { ...entry } : { ...DEFAULT_FORM_DATA, date: getToday() });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? (parseFloat(value) || 0) : value }));
  };

  const handleSubmit = () => {
    if (editingEntry) updateVerificationEntry(editingEntry.id, formData);
    else addVerificationEntry(formData);
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this verification entry?')) removeVerificationEntry(id);
  };

  // ── Render helpers ──
  const renderCell = (entry, col) => {
    if (col.key === 'actions') {
      return (
        <td key="actions" className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openModal(entry)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
          <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">Delete</button>
        </td>
      );
    }
    if (col.key === 'type') {
      return (
        <td key="type" className="px-3 py-2 text-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'Internal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {entry.type}
          </span>
        </td>
      );
    }
    if (col.key === 'total') {
      const total = totalDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects);
      return <td key="total" className="px-3 py-2 text-center font-semibold">{total}</td>;
    }
    if (col.key === 'weighted') {
      const weighted = weightedDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects);
      return <td key="weighted" className="px-3 py-2 text-right font-medium">{weighted.toFixed(2)}</td>;
    }
    const value = entry[col.key];
    const display = (value === undefined || value === null) ? '-' : value;
    return <td key={col.key} className={`px-3 py-2 ${col.align === 'center' ? 'text-center' : ''} ${col.align === 'right' ? 'text-right' : ''} whitespace-normal break-words ${['remarks', 'moduleSubmodule', 'projectName'].includes(col.key) ? 'text-xs' : ''}`}>{display}</td>;
  };

  const cards = [
    { label: 'Total Entries', value: stats.totalEntries, color: 'blue' },
    { label: 'Total Weighted Defects', value: stats.totalWeightedDefects.toFixed(2), color: 'purple' },
    { label: 'Defect Categories', value: `${stats.major} / ${stats.minor} / ${stats.trivial}`, color: 'green', sub: 'Major / Minor / Trivial' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Data"
        subtitle="Track defects found during reviews and testing activities"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Verification Entry</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 text-white p-4 rounded-lg shadow`}>
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
            {card.sub && <p className="text-xs opacity-80">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Verification Entries Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={`${col.width} px-3 py-3 text-${col.align || 'left'} ${
                      col.sticky ? `sticky left-${col.left} bg-gray-100 z-20 border-r border-gray-200` : ''
                    }`}
                    style={col.sticky ? { left: col.left } : {}}
                  >
                    {col.label}
                    {col.key === 'projectName' && <span className="text-xs text-gray-500 font-normal"> (MAZDA-ADS only)</span>}
                    {col.key === 'totalPlannedEffort' && <span className="text-xs text-gray-500 font-normal"> (MAZDA-ADS only)</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {verificationEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setViewingEntry(entry); setIsViewModalOpen(true); }}>
                  {COLUMNS.map(col => {
                    const cellContent = (() => {
                      if (col.key === 'actions') {
                        return (
                          <td key="actions" className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => openModal(entry)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                            <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-800">Delete</button>
                          </td>
                        );
                      }
                      if (col.key === 'type') {
                        return (
                          <td key="type" className="px-3 py-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${entry.type === 'Internal' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {entry.type}
                            </span>
                          </td>
                        );
                      }
                      if (col.key === 'total') {
                        return <td key="total" className="px-3 py-2 text-center font-semibold">{totalDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects)}</td>;
                      }
                      if (col.key === 'weighted') {
                        return <td key="weighted" className="px-3 py-2 text-right font-medium">{weightedDefects(entry.majorDefects, entry.minorDefects, entry.trivialDefects).toFixed(2)}</td>;
                      }
                      const value = entry[col.key];
                      const display = (value === undefined || value === null) ? '-' : value;
                      return <td key={col.key} className={`${col.width} px-3 py-2 ${col.align === 'center' ? 'text-center' : ''} ${col.align === 'right' ? 'text-right' : ''} whitespace-normal break-words ${['remarks', 'moduleSubmodule', 'projectName'].includes(col.key) ? 'text-xs' : ''} ${col.sticky ? `sticky left-${col.left} bg-white z-10 border-r border-gray-200` : ''}`} style={col.sticky ? { left: col.left } : {}}>{display}</td>;
                    })();
                    return cellContent;
                  })}
                </tr>
              ))}
              {verificationEntries.length === 0 && <tr><td colSpan={COLUMNS.length} className="text-center py-8 text-gray-500">No verification entries added. Click "Add Verification Entry" to begin.</td></tr>}
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