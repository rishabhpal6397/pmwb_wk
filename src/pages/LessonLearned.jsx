// src/pages/lessons/LessonLearnedPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';

// ========== Dropdown Options ==========
const WIN_ISSUE_OPTIONS = [
  { value: 'Win', label: 'Win' },
  { value: 'Issue', label: 'Issue' },
];

// ========== Helper Components ==========
const WinIssueBadge = ({ value }) => {
  if (value === 'Win') {
    return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Win</span>;
  }
  return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Issue</span>;
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-4 rounded-lg shadow`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// ========== Default Form Data ==========
const DEFAULT_LESSON = {
  winIssue: 'Win',
  description: '',
  impact: '',
  futureChange: '',
  actionItems: '',
};

// ========== Main Component ==========
const LessonLearnedPage = () => {
  const { lessons = [], addLesson, updateLesson, removeLesson } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [viewingLesson, setViewingLesson] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_LESSON);

  // Summary stats
  const stats = useMemo(() => {
    const total = lessons.length;
    const wins = lessons.filter(l => l.winIssue === 'Win').length;
    const issues = lessons.filter(l => l.winIssue === 'Issue').length;
    return { total, wins, issues };
  }, [lessons]);

  const openModal = (lesson = null) => {
    setEditingLesson(lesson);
    setFormData(lesson ? { ...lesson } : { ...DEFAULT_LESSON });
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editingLesson) {
      updateLesson(editingLesson.id, formData);
    } else {
      addLesson(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      removeLesson(id);
    }
  };

  // Column definitions
  const columns = [
    { field: 'winIssue', label: 'Win/Issue', width: 'w-28', sticky: true, left: 0, render: v => <WinIssueBadge value={v} /> },
    { field: 'description', label: 'Describe what happened', width: 'min-w-[300px] w-[300px]', sticky: true, left: 112, truncate: 150 },
    { field: 'impact', label: 'Impact', width: 'min-w-[250px] w-[250px]', truncate: 120 },
    { field: 'futureChange', label: 'How Does This Change Future Projects?', width: 'min-w-[300px] w-[300px]', truncate: 150 },
    { field: 'actionItems', label: 'Action Items', width: 'min-w-[250px] w-[250px]', truncate: 120 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lesson Learned"
        subtitle="Capture wins, issues, impacts, and action items for continuous improvement"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Lesson</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard label="Total Lessons" value={stats.total} color="blue" />
        <SummaryCard label="Wins" value={stats.wins} color="green" />
        <SummaryCard label="Issues" value={stats.issues} color="red" />
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.field}
                    className={`${col.width} px-3 py-3 text-left ${col.sticky ? 'sticky bg-gray-100 z-20 border-r border-gray-200' : ''}`}
                    style={col.sticky ? { left: col.left } : {}}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-24 px-3 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lessons.map(lesson => (
                <tr key={lesson.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setViewingLesson(lesson); setIsViewModalOpen(true); }}>
                  {columns.map(col => {
                    let value = lesson[col.field];
                    if (col.render) return <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''}`} style={col.sticky ? { left: col.left } : {}}>{col.render(value)}</td>;
                    if (col.truncate && value?.length > col.truncate) value = value.substring(0, col.truncate) + '...';
                    if (value === undefined || value === null) value = '-';
                    return (
                      <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''} whitespace-normal break-words`} style={col.sticky ? { left: col.left } : {}}>
                        {value}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal(lesson)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => handleDelete(lesson.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">No lessons recorded. Click "Add Lesson" to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLesson ? 'Edit Lesson' : 'Add Lesson'} onConfirm={handleSubmit} size="large">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <SelectField label="Win/Issue" name="winIssue" options={WIN_ISSUE_OPTIONS} value={formData.winIssue} onChange={handleFormChange} required />
          <TextAreaField label="Describe what happened" name="description" value={formData.description} onChange={handleFormChange} rows={3} required />
          <TextAreaField label="Impact" name="impact" value={formData.impact} onChange={handleFormChange} rows={2} required />
          <TextAreaField label="How Does This Change Future Projects?" name="futureChange" value={formData.futureChange} onChange={handleFormChange} rows={2} required />
          <TextAreaField label="Action Items" name="actionItems" value={formData.actionItems} onChange={handleFormChange} rows={2} required />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Lesson Details" onConfirm={() => setIsViewModalOpen(false)} confirmText="Close" size="large">
        {viewingLesson && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
            <div><label className="text-xs text-gray-500">Win/Issue</label><p><WinIssueBadge value={viewingLesson.winIssue} /></p></div>
            <div><label className="text-xs text-gray-500">Describe what happened</label><p className="text-sm bg-gray-50 p-2 rounded">{viewingLesson.description}</p></div>
            <div><label className="text-xs text-gray-500">Impact</label><p className="text-sm bg-gray-50 p-2 rounded">{viewingLesson.impact}</p></div>
            <div><label className="text-xs text-gray-500">How Does This Change Future Projects?</label><p className="text-sm bg-gray-50 p-2 rounded">{viewingLesson.futureChange}</p></div>
            <div><label className="text-xs text-gray-500">Action Items</label><p className="text-sm bg-gray-50 p-2 rounded">{viewingLesson.actionItems}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LessonLearnedPage;