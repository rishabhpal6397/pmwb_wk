
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import {ISSUE_STATUS_OPTIONS, ASSIGNEE_OPTIONS, RAISED_BY_OPTIONS } from '../data/dropdownOptions';

// Helper: status badge color
const getStatusBadge = (status) => {
  const colors = {
    'Open': 'bg-red-100 text-red-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Closed': 'bg-green-100 text-green-800',
    'Deferred': 'bg-gray-100 text-gray-600',
    'Cancelled': 'bg-gray-100 text-gray-500',
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};

// Helper: overdue indicator
const OverdueIndicator = ({ targetDate, status }) => {
  if (status === 'Closed' || !targetDate) return null;
  const today = new Date().toISOString().split('T')[0];
  return targetDate < today ? <span className="ml-2 text-xs text-red-600 font-medium">(Overdue)</span> : null;
};

// Reusable Issue Form Component
const IssueForm = ({ formData, onChange, readOnly = false }) => (
  <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Serial No." name="serialNo" value={formData.serialNo} onChange={onChange} required readOnly={readOnly} />
      <SelectField label="Raised By" name="raisedBy" options={RAISED_BY_OPTIONS} value={formData.raisedBy} onChange={onChange} disabled={readOnly} />
    </div>
    <TextAreaField label="Description of Issue" name="description" value={formData.description} onChange={onChange} rows={3} required readOnly={readOnly} />
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Date Issue Raised" name="dateRaised" type="date" value={formData.dateRaised} onChange={onChange} required readOnly={readOnly} />
      <SelectField label="Assigned To / Responsibility" name="assignedTo" options={ASSIGNEE_OPTIONS} value={formData.assignedTo} onChange={onChange} disabled={readOnly} />
    </div>
    <TextAreaField label="Resolution Steps" name="resolutionSteps" value={formData.resolutionSteps} onChange={onChange} rows={3} readOnly={readOnly} />
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Target Date of Closure" name="targetClosureDate" type="date" value={formData.targetClosureDate} onChange={onChange} readOnly={readOnly} />
      <InputField label="Actual Closure Date" name="actualClosureDate" type="date" value={formData.actualClosureDate} onChange={onChange} readOnly={readOnly} />
    </div>
    <SelectField label="Status" name="status" options={ISSUE_STATUS_OPTIONS} value={formData.status} onChange={onChange} disabled={readOnly} />
    <TextAreaField label="Comments" name="comments" value={formData.comments} onChange={onChange} rows={2} readOnly={readOnly} />
  </div>
);

const IssueManagementPage = () => {
  const { issues = [], addIssue, updateIssue, removeIssue } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [viewingIssue, setViewingIssue] = useState(null);

  // Initial form data template
  const getInitialFormData = (issue = null) => ({
    serialNo: issue?.serialNo || ((issues.length + 1).toString()),
    description: issue?.description || '',
    raisedBy: issue?.raisedBy || 'Internal Team',
    dateRaised: issue?.dateRaised || new Date().toISOString().split('T')[0],
    assignedTo: issue?.assignedTo || 'Project Manager',
    resolutionSteps: issue?.resolutionSteps || '',
    targetClosureDate: issue?.targetClosureDate || '',
    actualClosureDate: issue?.actualClosureDate || '',
    comments: issue?.comments || '',
    status: issue?.status || 'Open',
  });

  const [formData, setFormData] = useState(getInitialFormData());

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openModal = (issue = null) => {
    setEditingIssue(issue);
    setFormData(getInitialFormData(issue));
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (editingIssue) {
      updateIssue(editingIssue.id, formData);
    } else {
      addIssue(formData);
    }
    setIsModalOpen(false);
  };

  const handleView = (issue) => {
    setViewingIssue(issue);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) removeIssue(id);
  };

  // Statistics
  const stats = useMemo(() => {
    const total = issues.length;
    const open = issues.filter(i => i.status === 'Open' || i.status === 'In Progress').length;
    const closed = issues.filter(i => i.status === 'Closed').length;
    const today = new Date().toISOString().split('T')[0];
    const overdue = issues.filter(i => i.status !== 'Closed' && i.targetClosureDate && i.targetClosureDate < today).length;
    return { total, open, closed, overdue };
  }, [issues]);

  // Column width classes
  const colClasses = {
    serialNo: 'w-20 left-0 border-r',
    description: ' min-w-[180px] w-[180px]  left-20  border-r',
    normal: 'px-3 py-2',
    action: 'w-24 text-center',
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Issue Management" subtitle="Track and manage project issues" actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Issue</Button>]} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[{ label: 'Total Issues',   value: stats.total,   className: 'from-blue-500   to-blue-600'   },
  { label: 'Open Issues',    value: stats.open,    className: 'from-red-500    to-red-600'    },
  { label: 'Closed Issues',  value: stats.closed,  className: 'from-green-500  to-green-600'  },
  { label: 'Overdue Issues', value: stats.overdue, className: 'from-orange-500 to-orange-600' },
          
        ].map(({ label, value, className }) => (
          <div key={label} className={`bg-gradient-to-r ${className} text-white p-4 rounded-lg shadow`}>
            <p className="text-sm opacity-90">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="scrollbar-hidden overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className={`${colClasses.serialNo} px-3 py-3 text-left`}>S. No.</th>
                <th className={`${colClasses.description} px-3 py-3 text-left`}>Description</th>
                <th className="px-3 py-3 text-left">Raised By</th>
                <th className="px-3 py-3 text-center">Date Raised</th>
                <th className="px-3 py-3 text-left">Assigned To</th>
                <th className="px-3 py-3 text-left">Resolution Steps</th>
                <th className="px-3 py-3 text-center">Target Closure</th>
                <th className="px-3 py-3 text-center">Actual Closure</th>
                <th className="px-3 py-3 text-left">Comments</th>
                <th className="px-3 py-3 text-center">Status</th>
                <th className="px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(issue)}>
                  <td className={`${colClasses.serialNo} px-3 py-2 font-medium`}>{issue.serialNo}</td>
                  <td className={`${colClasses.description} px-3 py-2 whitespace-normal break-words`}>{issue.description}</td>
                  <td className={`${colClasses.normal}`}>{issue.raisedBy}</td>
                  <td className={`${colClasses.normal} text-center`}>{issue.dateRaised}</td>
                  <td className={`${colClasses.normal}`}>{issue.assignedTo}</td>
                  <td className={`${colClasses.normal} whitespace-normal break-words text-xs`}>{issue.resolutionSteps || '-'}</td>
                  <td className={`${colClasses.normal} text-center`}>
                    {issue.targetClosureDate || '-'}
                    <OverdueIndicator targetDate={issue.targetClosureDate} status={issue.status} />
                  </td>
                  <td className={`${colClasses.normal} text-center`}>{issue.actualClosureDate || '-'}</td>
                  <td className={`${colClasses.normal} whitespace-normal break-words text-xs`}>{issue.comments || '-'}</td>
                  <td className={`${colClasses.normal} text-center`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(issue.status)}`}>{issue.status}</span>
                  </td>
                  <td className={`${colClasses.action} px-3 py-2`} onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => openModal(issue)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => handleDelete(issue.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && <tr><td colSpan={11} className="text-center py-8 text-gray-500">No issues added. Click "Add Issue" to begin.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIssue ? 'Edit Issue' : 'Add Issue'} onConfirm={handleSubmit} size="large">
        <IssueForm formData={formData} onChange={handleFormChange} />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title={`Issue Details: ${viewingIssue?.serialNo || ''}`} onConfirm={() => setIsViewModalOpen(false)} confirmText="Close" size="large">
        {viewingIssue && <IssueForm formData={viewingIssue} onChange={() => {}} readOnly />}
      </Modal>
    </div>
  );
};

export default IssueManagementPage;