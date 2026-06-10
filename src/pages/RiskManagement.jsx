// src/pages/risks/RiskManagementPage.jsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';
import {
  riskCategoryOptions,
  riskSourceOptions,
  processIdentifiedOptions,
  relevanceOptions,
  riskOwnerOptions,
  probabilityOptions,
  impactOptions,
  riskTreatmentOptions,
  riskStatusOptions,
  externalInternalOptions,
} from '../data/dropdownOptions';

// ========== Helper Functions ==========
const calcNormalizedImpact = (cost, schedule, scope, quality, regulatory) => {
  const impacts = [cost, schedule, scope, quality, regulatory];
  const valid = impacts.filter(v => v !== undefined && v !== null);
  if (valid.length === 0) return 0;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
};

const RiskIndexBadge = ({ value }) => {
  const val = Number(value) || 0;
  if (val >= 2) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">{val.toFixed(2)}</span>;
  if (val >= 1.5) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{val.toFixed(2)}</span>;
  if (val >= 0.5) return <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{val.toFixed(2)}</span>;
  return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{val.toFixed(2)}</span>;
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-4 rounded-lg shadow`}>
    <p className="text-sm opacity-90">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SectionHeader = ({ title }) => (
  <div className="border-t pt-3">
    <h3 className="font-semibold text-md mb-2 bg-gray-100 p-2 rounded">{title}</h3>
  </div>
);

const ImpactFields = ({ prefix, formData, handleFormChange }) => {
  const fields = ['Cost', 'Schedule', 'Scope', 'Quality', 'Regulatory'];
  return (
    <div className="grid grid-cols-3 gap-4 mt-2">
      {fields.map(field => (
        <SelectField
          key={field}
          label={`Impact on ${field}`}
          name={`${prefix}Impact${field}`}
          options={impactOptions}
          value={formData[`${prefix}Impact${field}`]}
          onChange={handleFormChange}
        />
      ))}
    </div>
  );
};

const StatsDisplay = ({ normalizedImpact, riskIndex, label }) => (
  <div className="grid grid-cols-2 gap-4 mt-2">
    <div className="bg-gray-50 p-2 rounded">
      <label className="text-xs text-gray-500">Normalized Impact</label>
      <p className="font-medium">{normalizedImpact.toFixed(2)}</p>
    </div>
    <div className="bg-gray-50 p-2 rounded">
      <label className="text-xs text-gray-500">Risk Index - {label}</label>
      <p className="font-medium">{riskIndex.toFixed(2)}</p>
    </div>
  </div>
);

// ========== Table Columns Definition ==========
const columns = [
  { field: 'dateIdentified', label: 'Date identified', width: 'w-28', sticky: true, left: 0 },
  { field: 'riskCategory', label: 'Risk Category', width: 'w-36', sticky: true, left: 112 },
  { field: 'riskSource', label: 'Risk Source', width: 'w-48' },
  { field: 'processIdentified', label: 'Process', width: 'w-40' },
  { field: 'riskTitle', label: 'Risk Title', width: 'min-w-[200px] w-[200px]' },
  { field: 'riskDescription', label: 'Risk description', width: 'min-w-[250px] w-[250px]', truncate: 100 },
  { field: 'relevantISMSControl', label: 'ISMS Control', width: 'w-32' },
  { field: 'relevance', label: 'Relevance', width: 'w-24' },
  { field: 'owner', label: 'Owner', width: 'w-32' },
  { field: 'initialProbability', label: 'Init. Prob.', width: 'w-24', format: v => v },
  { field: 'initialNormalizedImpact', label: 'Init. Impact', width: 'w-24', format: v => v?.toFixed(2) },
  { field: 'initialRiskIndex', label: 'Init. Risk Index', width: 'w-28', render: v => <RiskIndexBadge value={v} /> },
  { field: 'currentProbability', label: 'Curr. Prob.', width: 'w-24', format: v => v },
  { field: 'currentNormalizedImpact', label: 'Curr. Impact', width: 'w-24', format: v => v?.toFixed(2) },
  { field: 'currentRiskIndex', label: 'Curr. Risk Index', width: 'w-28', render: v => <RiskIndexBadge value={v} /> },
  { field: 'riskTreatmentPlan', label: 'Treatment Plan', width: 'w-28' },
  { field: 'costOfRisk', label: 'Cost of Risk', width: 'w-24', format: v => v ? `$${Number(v).toLocaleString()}` : '-' },
  { field: 'costOfMitigationPlan', label: 'Cost of Mitigation', width: 'w-28', format: v => v ? `$${Number(v).toLocaleString()}` : '-' },
  { field: 'costBenefitRatio', label: 'C/B Ratio', width: 'w-24', format: v => v?.toFixed(2) || '-' },
  { field: 'escalationThreshold', label: 'Escalation', width: 'w-24', format: v => v },
  { field: 'mitigationPlan', label: 'Mitigation Plan', width: 'min-w-[200px] w-[200px]', truncate: 80 },
  { field: 'contingencyPlan', label: 'Contingency Plan', width: 'min-w-[200px] w-[200px]', truncate: 80 },
  { field: 'externalInternal', label: 'Ext/Int', width: 'w-24', render: v => v === 'External (Impacts Customer)' ? 'External' : 'Internal' },
  { field: 'remarks', label: 'Remarks', width: 'min-w-[150px] w-[150px]', truncate: 60 },
  { field: 'updateDate', label: 'Update date', width: 'w-28' },
  { field: 'status', label: 'Status', width: 'w-32' },
  { field: 'revProb', label: 'Rev Prob', width: 'w-24', format: v => v },
  { field: 'revImpact', label: 'Rev Impact', width: 'w-24', format: v => v?.toFixed(2) },
  { field: 'revRiskIndex', label: 'Rev Risk index', width: 'w-28', render: v => <RiskIndexBadge value={v} /> },
  { field: 'status1', label: 'Status-1', width: 'w-32' },
];

// ========== Default Form Data ==========
const getDefaultRisk = () => ({
  dateIdentified: new Date().toISOString().split('T')[0],
  riskCategory: 'Process or Method',
  riskSource: 'External/Internal (Project Requirements)',
  processIdentified: 'Kick off/ Bootcamp',
  riskTitle: '',
  riskDescription: '',
  relevantISMSControl: '',
  relevance: 'QMS',
  owner: 'Project Manager',
  initialProbability: 0.5,
  initialImpactCost: 3,
  initialImpactSchedule: 3,
  initialImpactScope: 3,
  initialImpactQuality: 3,
  initialImpactRegulatory: 1,
  currentProbability: 0.5,
  currentImpactCost: 3,
  currentImpactSchedule: 3,
  currentImpactScope: 3,
  currentImpactQuality: 3,
  currentImpactRegulatory: 1,
  riskTreatmentPlan: 'Mitigate',
  costOfRisk: 0,
  costOfMitigationPlan: 0,
  escalationThreshold: 0.9,
  mitigationPlan: '',
  contingencyPlan: '',
  externalInternal: 'Internal',
  remarks: '',
  status: 'Open',
  revProb: 0.5,
  revImpact: 0,
  revRiskIndex: 0,
  status1: '',
  updateDate: new Date().toISOString().split('T')[0],
});

// ========== Main Component ==========
const RiskManagementPage = () => {
  const { risks = [], addRisk, updateRisk, removeRisk } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState(null);
  const [viewingRisk, setViewingRisk] = useState(null);
  const [formData, setFormData] = useState(getDefaultRisk());

  const numericFields = [
    'initialProbability', 'currentProbability', 'revProb',
    'initialImpactCost', 'initialImpactSchedule', 'initialImpactScope', 'initialImpactQuality', 'initialImpactRegulatory',
    'currentImpactCost', 'currentImpactSchedule', 'currentImpactScope', 'currentImpactQuality', 'currentImpactRegulatory',
    'costOfRisk', 'costOfMitigationPlan', 'escalationThreshold', 'revImpact'
  ];

  const stats = useMemo(() => ({
    total: risks.length,
    open: risks.filter(r => r.status === 'Open' || r.status === 'Occurred & Open').length,
    closed: risks.filter(r => r.status === 'Closed' || r.status === "Didn't occur & Closed").length,
    highRisk: risks.filter(r => (r.currentRiskIndex || 0) >= 1.5).length,
  }), [risks]);

  const openModal = (risk = null) => {
    setEditingRisk(risk);
    setFormData(risk ? { ...risk } : getDefaultRisk());
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = numericFields.includes(name) ? (value === '' ? 0 : parseFloat(value)) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = () => {
    if (editingRisk) {
      updateRisk(editingRisk.id, formData);
    } else {
      addRisk(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this risk?')) removeRisk(id);
  };

  const initialNormImpact = calcNormalizedImpact(
    formData.initialImpactCost, formData.initialImpactSchedule,
    formData.initialImpactScope, formData.initialImpactQuality, formData.initialImpactRegulatory
  );
  const initialRiskIdx = formData.initialProbability * initialNormImpact;
  
  const currentNormImpact = calcNormalizedImpact(
    formData.currentImpactCost, formData.currentImpactSchedule,
    formData.currentImpactScope, formData.currentImpactQuality, formData.currentImpactRegulatory
  );
  const currentRiskIdx = formData.currentProbability * currentNormImpact;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Management"
        subtitle="Identify, assess, and mitigate project risks"
        actions={[<Button key="add" variant="primary" onClick={() => openModal()}>+ Add Risk</Button>]}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard label="Total Risks" value={stats.total} color="blue" />
        <SummaryCard label="Open Risks" value={stats.open} color="yellow" />
        <SummaryCard label="Closed Risks" value={stats.closed} color="green" />
        <SummaryCard label="High Risk (Index ≥1.5)" value={stats.highRisk} color="red" />
      </div>

      {/* Risks Table */}
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
              {risks.map(risk => (
                <tr key={risk.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setViewingRisk(risk); setIsViewModalOpen(true); }}>
                  {columns.map(col => {
                    let value = risk[col.field];
                    if (col.render) return <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''}`} style={col.sticky ? { left: col.left } : {}}>{col.render(value)}</td>;
                    if (col.format) value = col.format(value);
                    if (col.truncate && value?.length > col.truncate) value = value.substring(0, col.truncate) + '...';
                    if (value === undefined || value === null) value = '-';
                    return (
                      <td key={col.field} className={`${col.width} px-3 py-2 ${col.sticky ? 'sticky bg-white border-r border-gray-200' : ''}`} style={col.sticky ? { left: col.left } : {}}>
                        {value}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2 text-center" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openModal(risk)} className="text-blue-600 hover:text-blue-800 mr-2">Edit</button>
                    <button onClick={() => handleDelete(risk.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
              {risks.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="text-center py-8 text-gray-500">No risks added. Click "Add Risk" to begin.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRisk ? 'Edit Risk' : 'Add Risk'} onConfirm={handleSubmit} size="xlarge">
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Date identified" name="dateIdentified" type="date" value={formData.dateIdentified} onChange={handleFormChange} required />
            <SelectField label="Risk Category" name="riskCategory" options={riskCategoryOptions} value={formData.riskCategory} onChange={handleFormChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Risk Source" name="riskSource" options={riskSourceOptions} value={formData.riskSource} onChange={handleFormChange} />
            <SelectField label="Process where Identified" name="processIdentified" options={processIdentifiedOptions} value={formData.processIdentified} onChange={handleFormChange} />
          </div>
          <InputField label="Risk Title" name="riskTitle" value={formData.riskTitle} onChange={handleFormChange} required />
          <TextAreaField label="Risk description" name="riskDescription" value={formData.riskDescription} onChange={handleFormChange} rows={2} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Relevant ISMS Control" name="relevantISMSControl" value={formData.relevantISMSControl} onChange={handleFormChange} />
            <SelectField label="Relevance (ISMS, QMS, Both)" name="relevance" options={relevanceOptions} value={formData.relevance} onChange={handleFormChange} />
          </div>
          <SelectField label="Owner" name="owner" options={riskOwnerOptions} value={formData.owner} onChange={handleFormChange} />

          <SectionHeader title="Initial Risk Assessment (without controls)" />
          <SelectField label="Probability" name="initialProbability" options={probabilityOptions} value={formData.initialProbability} onChange={handleFormChange} />
          <ImpactFields prefix="initial" formData={formData} handleFormChange={handleFormChange} />
          <StatsDisplay normalizedImpact={initialNormImpact} riskIndex={initialRiskIdx} label="Initial" />

          <SectionHeader title="Current Risk Assessment (with controls)" />
          <SelectField label="Probability" name="currentProbability" options={probabilityOptions} value={formData.currentProbability} onChange={handleFormChange} />
          <ImpactFields prefix="current" formData={formData} handleFormChange={handleFormChange} />
          <StatsDisplay normalizedImpact={currentNormImpact} riskIndex={currentRiskIdx} label="Current" />

          <SectionHeader title="Risk Treatment Plan" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="Risk Treatment Plan" name="riskTreatmentPlan" options={riskTreatmentOptions} value={formData.riskTreatmentPlan} onChange={handleFormChange} />
            <InputField label="Cost of Risk" name="costOfRisk" type="number" value={formData.costOfRisk} onChange={handleFormChange} step="1000" placeholder="USD" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Cost of Mitigation Plan" name="costOfMitigationPlan" type="number" value={formData.costOfMitigationPlan} onChange={handleFormChange} step="1000" placeholder="USD" />
            <InputField label="Escalation threshold" name="escalationThreshold" type="number" value={formData.escalationThreshold} onChange={handleFormChange} step="0.1" />
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <label className="text-xs text-gray-500">Cost / Benefit ratio</label>
            <p className="font-medium">{formData.costOfMitigationPlan && formData.costOfRisk ? (formData.costOfMitigationPlan / formData.costOfRisk).toFixed(2) : '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextAreaField label="Mitigation plan" name="mitigationPlan" value={formData.mitigationPlan} onChange={handleFormChange} rows={2} />
            <TextAreaField label="Contingency plan" name="contingencyPlan" value={formData.contingencyPlan} onChange={handleFormChange} rows={2} />
          </div>

          <SectionHeader title="Status & Review" />
          <div className="grid grid-cols-2 gap-4">
            <SelectField label="External (Impacts customer) / Internal" name="externalInternal" options={externalInternalOptions} value={formData.externalInternal} onChange={handleFormChange} />
            <SelectField label="Status" name="status" options={riskStatusOptions} value={formData.status} onChange={handleFormChange} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputField label="Rev Prob" name="revProb" type="number" value={formData.revProb} onChange={handleFormChange} step="0.1" />
            <InputField label="Rev Impact" name="revImpact" type="number" value={formData.revImpact} onChange={handleFormChange} step="0.1" />
            <div className="bg-gray-50 p-2 rounded">
              <label className="text-xs text-gray-500">Rev Risk index</label>
              <p className="font-medium">{(formData.revProb * formData.revImpact).toFixed(2)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Status-1" name="status1" value={formData.status1} onChange={handleFormChange} />
            <InputField label="Update date" name="updateDate" type="date" value={formData.updateDate} onChange={handleFormChange} readOnly />
          </div>
          <TextAreaField label="Remarks" name="remarks" value={formData.remarks} onChange={handleFormChange} rows={2} />
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Risk Details" onConfirm={() => setIsViewModalOpen(false)} confirmText="Close" size="xlarge">
        {viewingRisk && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Date identified</label><p>{viewingRisk.dateIdentified}</p></div>
              <div><label className="text-xs text-gray-500">Risk Category</label><p>{viewingRisk.riskCategory}</p></div>
            </div>
            <div><label className="text-xs text-gray-500">Risk Title</label><p className="font-semibold">{viewingRisk.riskTitle}</p></div>
            <div><label className="text-xs text-gray-500">Description</label><p className="text-sm bg-gray-50 p-2 rounded">{viewingRisk.riskDescription}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Initial Probability</label><p>{viewingRisk.initialProbability}</p></div>
              <div><label className="text-xs text-gray-500">Initial Risk Index</label><p className="font-bold">{(viewingRisk.initialRiskIndex || 0).toFixed(2)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">Current Probability</label><p>{viewingRisk.currentProbability}</p></div>
              <div><label className="text-xs text-gray-500">Current Risk Index</label><p className="font-bold text-red-600">{(viewingRisk.currentRiskIndex || 0).toFixed(2)}</p></div>
            </div>
            <div><label className="text-xs text-gray-500">Mitigation Plan</label><p>{viewingRisk.mitigationPlan || '-'}</p></div>
            <div><label className="text-xs text-gray-500">Contingency Plan</label><p>{viewingRisk.contingencyPlan || '-'}</p></div>
            <div><label className="text-xs text-gray-500">Status</label><p>{viewingRisk.status}</p></div>
            <div><label className="text-xs text-gray-500">Remarks</label><p>{viewingRisk.remarks || '-'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RiskManagementPage;