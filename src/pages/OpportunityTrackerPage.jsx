// src/pages/opportunities/OpportunityPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import { STATUS_OPTIONS, EXTERNAL_INTERNAL_OPTIONS, PROCESS_OPTIONS, OWNER_OPTIONS } from '../data/dropdownOptions';

// ── Helpers ──────────────────────────────────────────────────────────────
const statusColors = {
  'Open': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Completed': 'bg-green-100 text-green-800',
  'Closed': 'bg-green-100 text-green-800',
  'Deferred': 'bg-gray-100 text-gray-600',
  'Cancelled': 'bg-red-100 text-red-800',
};
const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
);

// ── Opportunity Form (shared across Add/Edit/View) ────────────────────
const OpportunityForm = ({ formData, onChange, readOnly = false }) => (
  <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Serial No." name="serialNo" value={formData.serialNo} onChange={onChange} required readOnly={readOnly} />
      <InputField label="Date Identified" name="dateIdentified" type="date" value={formData.dateIdentified} onChange={onChange} required readOnly={readOnly} />
    </div>
    <InputField label="Opportunity Title" name="opportunityTitle" value={formData.opportunityTitle} onChange={onChange} required readOnly={readOnly} />
    <TextAreaField label="Opportunity Description" name="opportunityDescription" value={formData.opportunityDescription} onChange={onChange} rows={3} required readOnly={readOnly} />
    <div className="grid grid-cols-3 gap-4">
      <SelectField label="External / Internal" name="externalInternal" options={EXTERNAL_INTERNAL_OPTIONS} value={formData.externalInternal} onChange={onChange} disabled={readOnly} />
      <SelectField label="Owner Driving" name="ownerDriving" options={OWNER_OPTIONS} value={formData.ownerDriving} onChange={onChange} disabled={readOnly} />
      <SelectField label="Process Where Identified" name="processWhereIdentified" options={PROCESS_OPTIONS} value={formData.processWhereIdentified} onChange={onChange} disabled={readOnly} />
    </div>
    <div className="border-t pt-3">
      <h3 className="font-semibold text-md mb-3">Benefits</h3>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Cost Benefit (USD)" name="costBenefit" type="number" value={formData.costBenefit} onChange={onChange} step="100" readOnly={readOnly} />
        <InputField label="Revenue Benefit (USD)" name="revenueBenefit" type="number" value={formData.revenueBenefit} onChange={onChange} step="100" readOnly={readOnly} />
      </div>
      <TextAreaField label="Knowledge Benefit" name="knowledgeBenefit" value={formData.knowledgeBenefit} onChange={onChange} rows={2} readOnly={readOnly} />
      <TextAreaField label="Process Efficiency Benefit" name="processEfficiencyBenefit" value={formData.processEfficiencyBenefit} onChange={onChange} rows={2} readOnly={readOnly} />
      <TextAreaField label="Sales Opportunity" name="salesOpportunity" value={formData.salesOpportunity} onChange={onChange} rows={2} readOnly={readOnly} />
    </div>
    <div className="border-t pt-3">
      <h3 className="font-semibold text-md mb-3">Action Plan</h3>
      <TextAreaField label="Next Action Item" name="nextActionItem" value={formData.nextActionItem} onChange={onChange} rows={2} readOnly={readOnly} />
    </div>
    <div className="border-t pt-3">
      <div className="grid grid-cols-2 gap-4">
        <SelectField label="Status" name="status" options={STATUS_OPTIONS} value={formData.status} onChange={onChange} disabled={readOnly} />
        <InputField label="Last Updated On" name="lastUpdatedOn" type="date" value={formData.lastUpdatedOn} onChange={onChange} readOnly={readOnly} />
      </div>
      <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={onChange} rows={2} readOnly={readOnly} />
    </div>
  </div>
);

// ── Column Definitions ──────────────────────────────────────────────────
const COLUMNS = [
  { key: 'serialNo', label: 'No.', width: 'w-20', sticky: true, left: 0 },
  { key: 'dateIdentified', label: 'Date Identified', width: 'w-28', sticky: true, left: 80 },
  { key: 'opportunityTitle', label: 'Opportunity Title', width: 'min-w-[250px] w-[250px]', sticky: true, left: 192 },
  { key: 'opportunityDescription', label: 'Description', width: 'min-w-[300px] w-[300px]' },
  { key: 'externalInternal', label: 'Ext/Int', width: 'w-32' },
  { key: 'ownerDriving', label: 'Owner', width: 'w-36' },
  { key: 'processWhereIdentified', label: 'Process', width: 'w-40' },
  { key: 'costBenefit', label: 'Cost Benefit', width: 'w-32', align: 'right' },
  { key: 'revenueBenefit', label: 'Revenue Benefit', width: 'w-32', align: 'right' },
  { key: 'knowledgeBenefit', label: 'Knowledge Benefit', width: 'min-w-[200px] w-[200px]' },
  { key: 'processEfficiencyBenefit', label: 'Process Efficiency', width: 'min-w-[200px] w-[200px]' },
  { key: 'salesOpportunity', label: 'Sales Opportunity', width: 'min-w-[200px] w-[200px]' },
  { key: 'nextActionItem', label: 'Next Action', width: 'min-w-[200px] w-[200px]' },
  { key: 'status', label: 'Status', width: 'w-28', align: 'center' },
  { key: 'lastUpdatedOn', label: 'Last Updated', width: 'w-28' },
  { key: 'remarks', label: 'Remarks', width: 'min-w-[150px] w-[150px]' },
  { key: 'actions', label: 'Actions', width: 'w-24', align: 'center' },
];

// ── Main Component ──────────────────────────────────────────────────────
const OpportunityTrackerPage = () => {
  const { opportunities = [], addOpportunity, updateOpportunity, removeOpportunity } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [viewingOpportunity, setViewingOpportunity] = useState(null);
  const [formData, setFormData] = useState({});

  const getInitialFormData = (opp = null) => {
    const today = new Date().toISOString().split('T')[0];
    if (opp) return { ...opp, lastUpdatedOn: today };
    return {
      serialNo: (opportunities.length + 1).toString(),
      dateIdentified: today,
      opportunityTitle: '',
      opportunityDescription: '',
      externalInternal: 'Internal',
      ownerDriving: 'Project Manager',
      processWhereIdentified: 'Kick off/ Bootcamp',
      costBenefit: '',
      revenueBenefit: '',
      knowledgeBenefit: '',
      processEfficiencyBenefit: '',
      salesOpportunity: '',
      nextActionItem: '',
      status: 'Open',
      lastUpdatedOn: today,
      remarks: '',
    };
  };

  const openModal = (opp = null) => {
    setEditingOpportunity(opp);
    setFormData(getInitialFormData(opp));
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const dataToSave = { ...formData, lastUpdatedOn: new Date().toISOString().split('T')[0] };
    if (editingOpportunity) updateOpportunity(editingOpportunity.id, dataToSave);
    else addOpportunity(dataToSave);
    setIsModalOpen(false);
  };

  const handleView = (opp) => {
    setViewingOpportunity(opp);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) removeOpportunity(id);
  };

  const stats = useMemo(() => {
    const total = opportunities.length;
    const open = opportunities.filter(o => o.status === 'Open' || o.status === 'In Progress').length;
    const completed = opportunities.filter(o => o.status === 'Completed' || o.status === 'Closed').length;
    const totalCost = opportunities.reduce((sum, o) => sum + (parseFloat(o.costBenefit) || 0), 0);
    const totalRevenue = opportunities.reduce((sum, o) => sum + (parseFloat(o.revenueBenefit) || 0), 0);
    return { total, open, completed, totalCost, totalRevenue };
  }, [opportunities]);

  // ── Card config ──
  const cards = [
    { label: 'Total Opportunities', value: stats.total, color: 'blue' },
    { label: 'Open / In Progress', value: stats.open, color: 'orange' },
    { label: 'Completed / Closed', value: stats.completed, color: 'green' },
    { label: 'Cost Benefit', value: `$${stats.totalCost.toLocaleString()}`, color: 'red' },
    { label: 'Revenue Benefit', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'orange' },
  ];

  // ── Render helpers ──
  const renderCell = (opp, col) => {
    if (col.key === 'actions') {
      return (
        <td key="actions" className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openModal(opp)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
          <button onClick={() => handleDelete(opp.id)} className="text-red-600 hover:text-red-800">Delete</button>
        </td>
      );
    }
    const value = opp[col.key];
    if (col.key === 'status') {
      return (
        <td key="status" className="px-3 py-2 text-center">
          <StatusBadge status={value} />
        </td>
      );
    }
    if (col.key === 'externalInternal') {
      return <td key="externalInternal" className="px-3 py-2">{value === 'External (Impacts Customer)' ? 'External' : 'Internal'}</td>;
    }
    if (['costBenefit', 'revenueBenefit'].includes(col.key)) {
      return <td key={col.key} className="px-3 py-2 text-right">{value ? `$${parseFloat(value).toLocaleString()}` : '-'}</td>;
    }
    const display = value ?? '-';
    return (
      <td key={col.key} className={`px-3 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'} whitespace-normal break-words`}>
        {typeof display === 'string' && display.length > 100 ? display.substring(0, 100) + '...' : display}
      </td>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunity Tracker"
        subtitle="Identify and track project opportunities for cost savings, revenue growth, and process improvements"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Opportunity</Button>]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {cards.map((card, idx) => (
          <div key={idx} className={`bg-gradient-to-r from-${card.color}-500 to-${card.color}-600 text-white p-4 rounded-lg shadow`}>
            <p className="text-sm opacity-90">{card.label}</p>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Opportunities Table */}
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
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(opp)}>
                  {COLUMNS.map(col => {
                    const content = col.key === 'actions'
                      ? <>
                          <button onClick={() => openModal(opp)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                          <button onClick={() => handleDelete(opp.id)} className="text-red-600 hover:text-red-800">Delete</button>
                        </>
                      : col.key === 'status'
                      ? <StatusBadge status={opp.status} />
                      : col.key === 'externalInternal'
                      ? (opp.externalInternal === 'External (Impacts Customer)' ? 'External' : 'Internal')
                      : ['costBenefit', 'revenueBenefit'].includes(col.key)
                      ? (opp[col.key] ? `$${parseFloat(opp[col.key]).toLocaleString()}` : '-')
                      : (opp[col.key] ?? '-');
                    const display = typeof content === 'string' && content.length > 100 ? content.substring(0, 100) + '...' : content;
                    return (
                      <td
                        key={col.key}
                        className={`${col.width} px-3 py-2 ${col.align === 'right' ? 'text-right' : 'text-left'} ${
                          col.align === 'center' ? 'text-center' : ''
                        } whitespace-normal break-words ${
                          col.sticky ? `sticky left-${col.left} bg-white z-10 border-r border-gray-200` : ''
                        }`}
                        style={col.sticky ? { left: col.left } : {}}
                      >
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr><td colSpan={COLUMNS.length} className="text-center py-8 text-gray-500">No opportunities added. Click "Add Opportunity" to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingOpportunity ? 'Edit Opportunity' : 'Add Opportunity'}
        onConfirm={handleSubmit}
        size="xlarge"
      >
        <OpportunityForm formData={formData} onChange={handleFormChange} />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Opportunity Details: ${viewingOpportunity?.opportunityTitle || ''}`}
        onConfirm={() => setIsViewModalOpen(false)}
        confirmText="Close"
        size="xlarge"
      >
        {viewingOpportunity && <OpportunityForm formData={viewingOpportunity} onChange={() => {}} readOnly />}
      </Modal>
    </div>
  );
};

export default OpportunityTrackerPage;