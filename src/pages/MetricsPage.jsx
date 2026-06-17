// src/pages/metrics/MetricsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';
import TextAreaField from '../components/forms/TextAreaField';

const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

// ---- Helper Functions ----
const formatValue = (value, unit) => {
  if (value === null || value === undefined) return 'Not Available';
  if (unit === '%') return `${value.toFixed(2)}%`;
  if (unit === 'FP/Hr') return value.toFixed(4);
  if (unit === 'Weighted defects/unit') return value.toFixed(4);
  return value;
};

const getPriorityBadge = (priority) => {
  const classes = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
  };
  return classes[priority] || 'bg-gray-100 text-gray-800';
};

// ---- Field Configurations (shared between add & edit) ----
const FORM_FIELDS = [
  { label: 'ID', name: 'id', type: 'text', required: true, editable: false },
  { label: 'Metric', name: 'metric', type: 'text', required: true, editable: false },
  { label: 'Objective', name: 'objective', type: 'text', required: true, editable: false },
  { label: 'Source of Objective', name: 'sourceOfObjective', type: 'text', required: true, editable: false },
  { label: 'Unit', name: 'unit', type: 'text', required: true, editable: false },
  { label: 'Priority', name: 'priority', type: 'select', options: PRIORITY_OPTIONS, required: false, editable: true },
  { label: 'Required Measure', name: 'requiredMeasure', type: 'textarea', rows: 2, required: true, editable: false },
  { label: 'Definition', name: 'definition', type: 'textarea', rows: 3, required: true, editable: false },
  { label: 'Organization Baseline (%)', name: 'organizationBaseline', type: 'number', step: 0.1, editable: true },
  { label: 'SDC / Center Baseline (%)', name: 'sdcCenterBaseline', type: 'number', step: 0.1, editable: true },
  { label: 'Project Goal (%)', name: 'projectGoal', type: 'number', step: 0.1, required: true, editable: true },
  { label: 'Upper Specification Limit (%)', name: 'upperSpecificationLimit', type: 'number', step: 0.1, editable: true },
  { label: 'Lower Specification Limit (%)', name: 'lowerSpecificationLimit', type: 'number', step: 0.1, editable: true },
  { label: 'Analysis Model / Methodologies', name: 'analysisModelMethodology', type: 'textarea', rows: 2, editable: true },
  { label: 'Tracking Remarks', name: 'trackingRemarks', type: 'textarea', rows: 2, editable: true },
];

// ---- Table Column Configuration with sticky properties ----
const COLUMNS = [
  { key: 'id', label: 'ID', width: 'w-16', sticky: true, left: 0 },
  { key: 'objective', label: 'Objective', width: 'w-64', sticky: true, left: 64 },
  { key: 'sourceOfObjective', label: 'Source of Objective', width: 'w-56', sticky: true, left: 320 },
  { key: 'metric', label: 'Metric', width: 'w-56' },
  { key: 'unit', label: 'Unit', width: 'w-20', align: 'center' },
  { key: 'requiredMeasure', label: 'Required Measure', width: 'min-w-[300px] w-[300px]' },
  { key: 'definition', label: 'Definition', width: 'min-w-[400px] w-[400px]' },
  { key: 'priority', label: 'Priority', width: 'w-24', align: 'center' },
  { key: 'organizationBaseline', label: 'Org Baseline', width: 'w-24', align: 'center' },
  { key: 'sdcCenterBaseline', label: 'SDC Baseline', width: 'w-24', align: 'center' },
  { key: 'projectGoal', label: 'Project Goal', width: 'w-24', align: 'center' },
  { key: 'upperSpecificationLimit', label: 'USL', width: 'w-24', align: 'center' },
  { key: 'lowerSpecificationLimit', label: 'LSL', width: 'w-24', align: 'center' },
  { key: 'currentValue', label: 'Current Value', width: 'w-28', align: 'center' },
  { key: 'analysisModelMethodology', label: 'Analysis Model', width: 'min-w-[200px] w-[200px]' },
  { key: 'trackingRemarks', label: 'Tracking Remarks', width: 'min-w-[200px] w-[200px]' },
  { key: 'actions', label: 'Actions', width: 'w-20', align: 'center' },
];

const MetricsPage = () => {
  const { metricsList, updateMetric, addMetric, calculateAllMetrics, projectInfo, projectSize } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [formData, setFormData] = useState({});

  // ---- Stats ----
  const stats = useMemo(() => {
    const total = metricsList.length;
    const onTrack = metricsList.filter(m => {
      if (m.currentValue === null) return false;
      if (m.metric?.includes('Variation')) return Math.abs(m.currentValue) <= Math.abs(m.projectGoal);
      return m.currentValue >= m.projectGoal;
    }).length;
    const atRisk = metricsList.filter(m => {
      if (m.currentValue === null) return false;
      if (m.metric?.includes('Variation')) return Math.abs(m.currentValue) > Math.abs(m.projectGoal);
      return m.currentValue < m.projectGoal;
    }).length;
    const noData = metricsList.filter(m => m.currentValue === null || m.currentValue === undefined).length;
    return { total, onTrack, atRisk, noData };
  }, [metricsList]);

  // ---- Effects ----
  useEffect(() => {
    calculateAllMetrics();
  }, [calculateAllMetrics, projectInfo, projectSize]);

  // ---- Handlers ----
  const openModal = (metric = null) => {
    setEditingMetric(metric);
    setFormData(metric
      ? { ...metric }
      : {
          id: (metricsList.length + 1).toString(),
          objective: '',
          sourceOfObjective: 'Organizational Measurement Objectives',
          metric: '',
          unit: '%',
          requiredMeasure: '',
          definition: '',
          priority: 'Medium',
          organizationBaseline: null,
          sdcCenterBaseline: null,
          projectGoal: null,
          upperSpecificationLimit: null,
          lowerSpecificationLimit: null,
          analysisModelMethodology: '',
          trackingRemarks: '',
        }
    );
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = () => {
    if (editingMetric) {
      updateMetric(editingMetric.id, formData);
    } else {
      addMetric({ ...formData, currentValue: null });
    }
    setIsModalOpen(false);
  };

  // ---- Render helpers ----
  const renderField = (field) => {
    const commonProps = {
      key: field.name,
      label: field.label,
      name: field.name,
      value: formData[field.name] ?? '',
      onChange: handleFormChange,
      required: field.required || false,
    };

    if (field.type === 'select') {
      return <SelectField {...commonProps} options={field.options} />;
    }
    if (field.type === 'textarea') {
      return <TextAreaField {...commonProps} rows={field.rows || 2} />;
    }
    const isDisabled = field.editable === false;
    return <InputField {...commonProps} type={field.type || 'text'} step={field.step} disabled={isDisabled} />;
  };

  // ---- JSX ----
  return (
    <div className="space-y-6">
      <PageHeader
        title="Metrics Planning & Tracking"
        subtitle="Monitor project KPIs against organizational goals and baselines"
        actions={[
          <Button key="add" variant="primary" onClick={() => openModal()}>+ Add Metric</Button>,
          <Button key="refresh" variant="secondary" onClick={calculateAllMetrics}>Refresh Metrics</Button>,
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Metrics', value: stats.total, color: 'blue' },
          { label: 'On Track', value: stats.onTrack, color: 'green' },
          { label: 'At Risk', value: stats.atRisk, color: 'red' },
          { label: 'No Data', value: stats.noData, color: 'purple' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-4 rounded-lg shadow`}>
            <p className="text-sm opacity-90">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
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
              {metricsList.map(metric => (
                <tr key={metric.id} className="hover:bg-gray-50">
                  {COLUMNS.map(col => {
                    // --- Render actions column ---
                    if (col.key === 'actions') {
                      return (
                        <td
                          key={col.key}
                          className={`${col.width} px-3 py-2 text-center`}
                        >
                          <button onClick={() => openModal(metric)} className="text-blue-600 hover:text-blue-800">Edit</button>
                        </td>
                      );
                    }

                    // --- Render priority badge ---
                    if (col.key === 'priority') {
                      return (
                        <td
                          key={col.key}
                          className={`${col.width} px-3 py-2 text-center`}
                        >
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(metric.priority)}`}>
                            {metric.priority}
                          </span>
                        </td>
                      );
                    }

                    // --- Render current value with color ---
                    if (col.key === 'currentValue') {
                      const isVariance = metric.metric?.includes('Variation');
                      const isRed =
                        metric.currentValue !== null &&
                        ((isVariance && Math.abs(metric.currentValue) > Math.abs(metric.projectGoal)) ||
                          (!isVariance && metric.currentValue < metric.projectGoal));
                      return (
                        <td
                          key={col.key}
                          className={`${col.width} px-3 py-2 text-center font-bold ${isRed ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {formatValue(metric.currentValue, metric.unit)}
                        </td>
                      );
                    }

                    // --- Regular cells with sticky support ---
                    const val = metric[col.key];
                    const displayVal = val === null || val === undefined ? '-' : val;
                    return (
                      <td
                        key={col.key}
                        className={`${col.width} px-3 py-2 ${
                          col.align === 'center' ? 'text-center' : 'text-left'
                        } whitespace-normal break-words text-xs leading-relaxed ${
                          col.sticky ? `sticky left-${col.left} bg-white z-10 border-r border-gray-200` : ''
                        }`}
                        style={col.sticky ? { left: col.left } : {}}
                      >
                        {displayVal}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMetric ? `Edit Metric: ${editingMetric.metric || ''}` : 'Add New Metric'}
        onConfirm={handleSubmit}
        size="xlarge"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          <div className="grid grid-cols-2 gap-4">
            {FORM_FIELDS.filter(
              f => !['requiredMeasure', 'definition', 'analysisModelMethodology', 'trackingRemarks'].includes(f.name)
            ).map(renderField)}
          </div>
          {FORM_FIELDS.filter(f => ['requiredMeasure', 'definition'].includes(f.name)).map(renderField)}
          <div className="border-t pt-3">
            <h3 className="font-semibold text-md mb-3">Baselines & Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              {FORM_FIELDS.filter(f => ['organizationBaseline', 'sdcCenterBaseline'].includes(f.name)).map(renderField)}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {FORM_FIELDS.filter(f => ['projectGoal', 'upperSpecificationLimit', 'lowerSpecificationLimit'].includes(f.name)).map(
                renderField
              )}
            </div>
          </div>
          {FORM_FIELDS.filter(f => ['analysisModelMethodology', 'trackingRemarks'].includes(f.name)).map(renderField)}
        </div>
      </Modal>
    </div>
  );
};

export default MetricsPage;