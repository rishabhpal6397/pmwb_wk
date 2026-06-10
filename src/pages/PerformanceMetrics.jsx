// src/pages/performance/PerformanceMetricsPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import {PERFORMANCE_ROLE_OPTIONS} from '../data/dropdownOptions';

// ========== Helper Components ==========
const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-4 rounded-lg shadow`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const PerformanceBadge = ({ value, type }) => {
  if (type === 'completion') {
    if (value >= 90) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{value}%</span>;
    if (value >= 75) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{value}%</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">{value}%</span>;
  }
  if (type === 'variation') {
    if (value <= 10) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{value}%</span>;
    if (value <= 25) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{value}%</span>;
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">{value}%</span>;
  }
  return <span>{value}</span>;
};

// ========== Default Form Data ==========
const DEFAULT_METRIC = {
  resourceName: '',
  role: 'Developer',
  tasksAllotted: 0,
  tasksCompletedOnTime: 0,
  plannedHour: 0,
  timeSpent: 0,
  defectsMajor: 0,
  milestonesAchievedOnTime: 0,
  training: '',
  newTechnologyLearned: '',
  customerComplaints: '',
};

// ========== Main Component ==========
const PerformanceMetricsPage = () => {
  const { performanceMetrics = [], addPerformanceMetric, updatePerformanceMetric, removePerformanceMetric } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [viewingMetric, setViewingMetric] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_METRIC);


  // Performance Page Columns
    const performanceColumns = [
    { field: 'resourceName', label: 'Resource Name', width: 'w-40', sticky: true, left: 0 },
    { field: 'role', label: 'Role in project', width: 'w-32', sticky: true, left: 160 },
    { field: 'tasksAllotted', label: 'Nos of tasks Alloted', width: 'w-24', align: 'center' },
    { field: 'tasksCompletedOnTime', label: 'Nos of task Completed on time', width: 'w-32', align: 'center' },
    { field: 'onTimeCompletionPercent', label: 'On time completion %', width: 'w-28', align: 'center', render: v => <PerformanceBadge value={v} type="completion" /> },
    { field: 'plannedHour', label: 'Planned Hour', width: 'w-24', align: 'right' },
    { field: 'timeSpent', label: 'Time(Hour) Spent', width: 'w-24', align: 'right' },
    { field: 'effortVariation', label: 'Effort Variation', width: 'w-28', align: 'center', render: v => <PerformanceBadge value={v} type="variation" /> },
    { field: 'defectsMajor', label: 'No of defects/Major', width: 'w-28', align: 'center' },
    { field: 'milestonesAchievedOnTime', label: 'Milestones Achieved On Time', width: 'w-40', align: 'center' },
    { field: 'training', label: 'Training (Technology / Module / Domain)', width: 'min-w-[200px] w-[200px]', truncate: 80 },
    { field: 'newTechnologyLearned', label: 'Any New Technology/Domain Learned', width: 'min-w-[200px] w-[200px]', truncate: 80 },
    { field: 'customerComplaints', label: 'Any Customer Complaints', width: 'min-w-[150px] w-[150px]', truncate: 60, render: v => v ? <span className="text-red-600 font-medium">{v}</span> : '-' },
    ];
  // Summary stats
  const stats = useMemo(() => {
    const total = performanceMetrics.length;
    const avgCompletion = performanceMetrics.reduce((sum, m) => sum + (m.onTimeCompletionPercent || 0), 0) / (total || 1);
    const totalDefects = performanceMetrics.reduce((sum, m) => sum + (m.defectsMajor || 0), 0);
    const totalMilestones = performanceMetrics.reduce((sum, m) => sum + (m.milestonesAchievedOnTime || 0), 0);
    return {
      total,
      avgCompletion: avgCompletion.toFixed(1),
      totalDefects,
      totalMilestones,
    };
  }, [performanceMetrics]);

  const openModal = (metric = null) => {
    setEditingMetric(metric);
    setFormData(metric ? { ...metric } : { ...DEFAULT_METRIC });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    const numericFields = ['tasksAllotted', 'tasksCompletedOnTime', 'plannedHour', 'timeSpent', 'defectsMajor', 'milestonesAchievedOnTime'];
    if (numericFields.includes(name)) {
      parsedValue = value === '' ? 0 : parseInt(value) || 0;
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = () => {
    if (editingMetric) {
      updatePerformanceMetric(editingMetric.id, formData);
    } else {
      addPerformanceMetric(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this performance record?')) {
      removePerformanceMetric(id);
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance Metrics"
        subtitle="Track individual resource performance, tasks, effort variation, and quality metrics"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Record</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Records" value={stats.total} color="blue" />
        <SummaryCard label="Avg. On‑time Completion" value={`${stats.avgCompletion}%`} color="green" />
        <SummaryCard label="Total Major Defects" value={stats.totalDefects} color="red" />
        <SummaryCard label="Milestones Achieved" value={stats.totalMilestones} color="purple" />
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {performanceColumns.map(col => (
                  <th
                    key={col.field}
                    className={`${col.width} px-3 py-3 text-${col.align || 'left'} ${col.sticky ? 'sticky bg-gray-100 z-20 border-r border-gray-200' : ''}`}
                    style={col.sticky ? { left: col.left } : {}}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-24 px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {performanceMetrics.map(metric => {
                // Calculate derived fields for display (already stored, but ensure)
                const completion = metric.onTimeCompletionPercent?.toFixed(1) || 0;
                const variation = metric.effortVariation?.toFixed(1) || 0;
                return (
                  <tr key={metric.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setViewingMetric(metric); setIsViewModalOpen(true); }}>
                    {performanceColumns.map(col => {
                      let value = metric[col.field];
                      if (col.field === 'onTimeCompletionPercent') value = completion;
                      if (col.field === 'effortVariation') value = variation;
                      if (col.render) return <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`} style={col.sticky ? { left: col.left } : {}}>{col.render(value)}</td>;
                      if (col.truncate && value?.length > col.truncate) value = value.substring(0, col.truncate) + '...';
                      if (value === undefined || value === null) value = '-';
                      return (
                        <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'} whitespace-normal break-words`} style={col.sticky ? { left: col.left } : {}}>
                          {value}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                      <button onClick={() => openModal(metric)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                      <button onClick={() => handleDelete(metric.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                );
              })}
              {performanceMetrics.length === 0 && (
                <tr><td colSpan={performanceColumns.length + 1} className="text-center py-8 text-gray-500">No performance records. Click "Add Record" to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMetric ? 'Edit Performance Record' : 'Add Performance Record'} onConfirm={handleSubmit} size="xlarge">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Resource Name" name="resourceName" value={formData.resourceName} onChange={handleFormChange} required />
            <SelectField label="Role in project" name="role" options={PERFORMANCE_ROLE_OPTIONS} value={formData.role} onChange={handleFormChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nos of tasks Allotted" name="tasksAllotted" type="number" value={formData.tasksAllotted} onChange={handleFormChange} min="0" />
            <InputField label="Nos of task Completed on time" name="tasksCompletedOnTime" type="number" value={formData.tasksCompletedOnTime} onChange={handleFormChange} min="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Planned Hour" name="plannedHour" type="number" value={formData.plannedHour} onChange={handleFormChange} step="0.5" min="0" />
            <InputField label="Time(Hour) Spent" name="timeSpent" type="number" value={formData.timeSpent} onChange={handleFormChange} step="0.5" min="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="No of defects/Major" name="defectsMajor" type="number" value={formData.defectsMajor} onChange={handleFormChange} min="0" />
            <InputField label="Number of Project Milestones Achieved On Time" name="milestonesAchievedOnTime" type="number" value={formData.milestonesAchievedOnTime} onChange={handleFormChange} min="0" />
          </div>
          <TextAreaField label="Training (Technology / Module / Domain) Initiation / Participation" name="training" value={formData.training} onChange={handleFormChange} rows={2} />
          <TextAreaField label="Any New Technology/Domain Learned" name="newTechnologyLearned" value={formData.newTechnologyLearned} onChange={handleFormChange} rows={2} />
          <TextAreaField label="Any Customer Complaints" name="customerComplaints" value={formData.customerComplaints} onChange={handleFormChange} rows={2} />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Performance Record Details" onConfirm={() => setIsViewModalOpen(false)} confirmText="Close" size="large">
        {viewingMetric && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Resource Name</label><p className="font-medium">{viewingMetric.resourceName}</p></div>
              <div><label className="text-xs text-gray-500">Role</label><p>{viewingMetric.role}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Tasks Allotted</label><p>{viewingMetric.tasksAllotted}</p></div>
              <div><label className="text-xs text-gray-500">Tasks Completed On Time</label><p>{viewingMetric.tasksCompletedOnTime}</p></div>
            </div>
            <div><label className="text-xs text-gray-500">On‑time Completion %</label><p>{viewingMetric.onTimeCompletionPercent?.toFixed(1)}%</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Planned Hour</label><p>{viewingMetric.plannedHour}</p></div>
              <div><label className="text-xs text-gray-500">Time Spent</label><p>{viewingMetric.timeSpent}</p></div>
            </div>
            <div><label className="text-xs text-gray-500">Effort Variation</label><p>{viewingMetric.effortVariation?.toFixed(1)}%</p></div>
            <div><label className="text-xs text-gray-500">Major Defects</label><p>{viewingMetric.defectsMajor}</p></div>
            <div><label className="text-xs text-gray-500">Milestones Achieved On Time</label><p>{viewingMetric.milestonesAchievedOnTime}</p></div>
            <div><label className="text-xs text-gray-500">Training</label><p>{viewingMetric.training || '-'}</p></div>
            <div><label className="text-xs text-gray-500">New Technology Learned</label><p>{viewingMetric.newTechnologyLearned || '-'}</p></div>
            <div><label className="text-xs text-gray-500">Customer Complaints</label><p className="text-red-600">{viewingMetric.customerComplaints || '-'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PerformanceMetricsPage;