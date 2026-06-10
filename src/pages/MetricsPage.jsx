// src/pages/metrics/MetricsPage.jsx
import React, { useEffect, useState } from 'react';
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

const MetricsPage = () => {
  const { metricsList, updateMetric, addMetric, calculateAllMetrics, projectInfo, projectSize } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState(null);
  const [formData, setFormData] = useState({});
  const [addFormData, setAddFormData] = useState({
    id: '',
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
  });

  useEffect(() => {
    calculateAllMetrics();
  }, [calculateAllMetrics, projectInfo, projectSize]);

  const handleEditMetric = (metric) => {
    setEditingMetric(metric);
    setFormData(metric);
    setIsModalOpen(true);
  };

  const handleAddMetric = () => {
    // Generate new ID
    const newId = (metricsList.length + 1).toString();
    setAddFormData({
      id: newId,
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
    });
    setIsAddModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddFormChange = (e) => {
    const { name, value, type } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value,
    }));
  };

  const handleSubmit = () => {
    updateMetric(editingMetric.id, formData);
    setIsModalOpen(false);
  };

  const handleAddSubmit = () => {
    addMetric({
      ...addFormData,
      currentValue: null,
    });
    setIsAddModalOpen(false);
  };

  const formatValue = (value, unit) => {
    if (value === null || value === undefined) return 'Not Available';
    if (unit === '%') return `${value.toFixed(2)}%`;
    if (unit === 'FP/Hr') return value.toFixed(4);
    if (unit === 'Weighted defects/unit') return value.toFixed(4);
    return value;
  };

  // Column width classes
  const columnWidths = {
    id: 'w-16',
    objective: 'w-64',
    sourceOfObjective: 'w-56',
    metric: 'w-56',
    unit: 'w-20',
    requiredMeasure: 'min-w-[300px] w-[300px]',
    definition: 'min-w-[400px] w-[400px]',
    priority: 'w-24',
    orgBaseline: 'w-24',
    sdcBaseline: 'w-24',
    projectGoal: 'w-24',
    usl: 'w-24',
    lsl: 'w-24',
    currentValue: 'w-28',
    analysisModel: 'min-w-[200px] w-[200px]',
    trackingRemarks: 'min-w-[200px] w-[200px]',
    actions: 'w-20',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Metrics Planning & Tracking"
        subtitle="Monitor project KPIs against organizational goals and baselines"
        actions={[
          <Button key="add" variant="primary" onClick={handleAddMetric}>
            + Add Metric
          </Button>,
          <Button key="refresh" variant="secondary" onClick={calculateAllMetrics}>
            Refresh Metrics
          </Button>,
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">Total Metrics</p>
          <p className="text-2xl font-bold">{metricsList.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">On Track</p>
          <p className="text-2xl font-bold">
            {metricsList.filter(m => {
              if (m.currentValue === null) return false;
              if (m.metric?.includes('Variation')) return Math.abs(m.currentValue) <= Math.abs(m.projectGoal);
              return m.currentValue >= m.projectGoal;
            }).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">At Risk</p>
          <p className="text-2xl font-bold">
            {metricsList.filter(m => {
              if (m.currentValue === null) return false;
              if (m.metric?.includes('Variation')) return Math.abs(m.currentValue) > Math.abs(m.projectGoal);
              return m.currentValue < m.projectGoal;
            }).length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow">
          <p className="text-sm opacity-90">No Data</p>
          <p className="text-2xl font-bold">
            {metricsList.filter(m => m.currentValue === null || m.currentValue === undefined).length}
          </p>
        </div>
      </div>

      {/* Main Metrics Table with Sticky Columns */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="scrollbar-hidden overflow-x-auto" style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <table className="min-w-max divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {/* Sticky Columns - First 3 */}
                <th className={`${columnWidths.id} px-3 py-3 text-left sticky left-0 bg-gray-100 z-20 border-r border-gray-200`}>ID</th>
                <th className={`${columnWidths.objective} px-3 py-3 text-left sticky left-16 bg-gray-100 z-20 border-r border-gray-200`}>Objective</th>
                <th className={`${columnWidths.sourceOfObjective} px-3 py-3 text-left sticky left-80 bg-gray-100 z-20 border-r border-gray-200`}>Source of Objective</th>
                
                {/* Scrollable Columns */}
                <th className={`${columnWidths.metric} px-3 py-3 text-left`}>Metric</th>
                <th className={`${columnWidths.unit} px-3 py-3 text-center`}>Unit</th>
                <th className={`${columnWidths.requiredMeasure} px-3 py-3 text-left`}>Required Measure</th>
                <th className={`${columnWidths.definition} px-3 py-3 text-left`}>Definition</th>
                <th className={`${columnWidths.priority} px-3 py-3 text-center`}>Priority</th>
                <th className={`${columnWidths.orgBaseline} px-3 py-3 text-center`}>Org Baseline</th>
                <th className={`${columnWidths.sdcBaseline} px-3 py-3 text-center`}>SDC Baseline</th>
                <th className={`${columnWidths.projectGoal} px-3 py-3 text-center`}>Project Goal</th>
                <th className={`${columnWidths.usl} px-3 py-3 text-center`}>USL</th>
                <th className={`${columnWidths.lsl} px-3 py-3 text-center`}>LSL</th>
                <th className={`${columnWidths.currentValue} px-3 py-3 text-center`}>Current Value</th>
                <th className={`${columnWidths.analysisModel} px-3 py-3 text-left`}>Analysis Model</th>
                <th className={`${columnWidths.trackingRemarks} px-3 py-3 text-left`}>Tracking Remarks</th>
                <th className={`${columnWidths.actions} px-3 py-3 text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {metricsList.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50">
                  {/* Sticky Columns - First 3 */}
                  <td className={`${columnWidths.id} px-3 py-2 font-medium sticky left-0 bg-white border-r border-gray-200`}>{metric.id}</td>
                  <td className={`${columnWidths.objective} px-3 py-2 sticky left-16 bg-white border-r border-gray-200 whitespace-normal break-words`}>{metric.objective}</td>
                  <td className={`${columnWidths.sourceOfObjective} px-3 py-2 sticky left-80 bg-white border-r border-gray-200`}>{metric.sourceOfObjective}</td>
                  
                  {/* Scrollable Columns */}
                  <td className={`${columnWidths.metric} px-3 py-2 font-medium whitespace-normal break-words`}>{metric.metric}</td>
                  <td className={`${columnWidths.unit} px-3 py-2 text-center`}>{metric.unit}</td>
                  <td className={`${columnWidths.requiredMeasure} px-3 py-2 whitespace-normal break-words text-xs leading-relaxed`}>{metric.requiredMeasure}</td>
                  <td className={`${columnWidths.definition} px-3 py-2 whitespace-normal break-words text-xs leading-relaxed`}>{metric.definition}</td>
                  <td className={`${columnWidths.priority} px-3 py-2 text-center`}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      metric.priority === 'High' ? 'bg-red-100 text-red-800' :
                      metric.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {metric.priority}
                    </span>
                  </td>
                  <td className={`${columnWidths.orgBaseline} px-3 py-2 text-center`}>{metric.organizationBaseline}%</td>
                  <td className={`${columnWidths.sdcBaseline} px-3 py-2 text-center`}>{metric.sdcCenterBaseline}%</td>
                  <td className={`${columnWidths.projectGoal} px-3 py-2 text-center font-semibold`}>{metric.projectGoal}%</td>
                  <td className={`${columnWidths.usl} px-3 py-2 text-center`}>{metric.upperSpecificationLimit}%</td>
                  <td className={`${columnWidths.lsl} px-3 py-2 text-center`}>{metric.lowerSpecificationLimit}%</td>
                  <td className={`${columnWidths.currentValue} px-3 py-2 text-center font-bold ${
                    metric.currentValue !== null && metric.metric?.includes('Variation') && Math.abs(metric.currentValue) > Math.abs(metric.projectGoal) ? 'text-red-600' :
                    metric.currentValue !== null && !metric.metric?.includes('Variation') && metric.currentValue < metric.projectGoal ? 'text-red-600' :
                    'text-green-600'
                  }`}>
                    {formatValue(metric.currentValue, metric.unit)}
                  </td>
                  <td className={`${columnWidths.analysisModel} px-3 py-2 whitespace-normal break-words text-xs`}>{metric.analysisModelMethodology || '-'}</td>
                  <td className={`${columnWidths.trackingRemarks} px-3 py-2 whitespace-normal break-words text-xs`}>{metric.trackingRemarks || '-'}</td>
                  <td className={`${columnWidths.actions} px-3 py-2 text-center`}>
                    <button
                      onClick={() => handleEditMetric(metric)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Metric Modal - Read-only fields */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Edit Metric: ${editingMetric?.metric || ''}`}
        onConfirm={handleSubmit}
        size="xlarge"
      >
        <div className="space-y-4">
          {/* Read-only fields - ID, Objective, Source, Metric, Unit */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="ID" name="id" value={formData.id || ''} onChange={handleFormChange} disabled />
            <InputField label="Metric" name="metric" value={formData.metric || ''} onChange={handleFormChange} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Objective" name="objective" value={formData.objective || ''} onChange={handleFormChange} disabled />
            <InputField label="Source of Objective" name="sourceOfObjective" value={formData.sourceOfObjective || ''} onChange={handleFormChange} disabled />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Unit" name="unit" value={formData.unit || ''} onChange={handleFormChange} disabled />
            <SelectField label="Priority" name="priority" options={PRIORITY_OPTIONS} value={formData.priority || 'Medium'} onChange={handleFormChange} />
          </div>

          {/* Required Measure - Read-only */}
          <TextAreaField 
            label="Required Measure" 
            name="requiredMeasure" 
            value={formData.requiredMeasure || ''} 
            onChange={handleFormChange} 
            rows={2} 
            disabled 
          />

          {/* Definition - Read-only */}
          <TextAreaField 
            label="Definition" 
            name="definition" 
            value={formData.definition || ''} 
            onChange={handleFormChange} 
            rows={3} 
            disabled 
          />

          {/* Editable fields - Baselines and Limits */}
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Organization Baseline (%)" 
              name="organizationBaseline" 
              type="number" 
              value={formData.organizationBaseline || 0} 
              onChange={handleFormChange} 
              step="0.1" 
            />
            <InputField 
              label="SDC / Center Baseline (%)" 
              name="sdcCenterBaseline" 
              type="number" 
              value={formData.sdcCenterBaseline || 0} 
              onChange={handleFormChange} 
              step="0.1" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputField 
              label="Project Goal (%)" 
              name="projectGoal" 
              type="number" 
              value={formData.projectGoal || 0} 
              onChange={handleFormChange} 
              step="0.1" 
              required 
            />
            <InputField 
              label="Upper Specification Limit (%)" 
              name="upperSpecificationLimit" 
              type="number" 
              value={formData.upperSpecificationLimit || 0} 
              onChange={handleFormChange} 
              step="0.1" 
            />
            <InputField 
              label="Lower Specification Limit (%)" 
              name="lowerSpecificationLimit" 
              type="number" 
              value={formData.lowerSpecificationLimit || 0} 
              onChange={handleFormChange} 
              step="0.1" 
            />
          </div>

          {/* Analysis Model and Tracking Remarks - Editable */}
          <TextAreaField 
            label="Analysis Model / Methodologies" 
            name="analysisModelMethodology" 
            value={formData.analysisModelMethodology || ''} 
            onChange={handleFormChange} 
            rows={2} 
            placeholder="Describe the analysis methodology used..."
          />

          <TextAreaField 
            label="Tracking Remarks" 
            name="trackingRemarks" 
            value={formData.trackingRemarks || ''} 
            onChange={handleFormChange} 
            rows={2} 
            placeholder="Any remarks about metric tracking..."
          />
        </div>
      </Modal>

      {/* Add New Metric Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Metric"
        onConfirm={handleAddSubmit}
        size="xlarge"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="ID" 
              name="id" 
              value={addFormData.id || ''} 
              onChange={handleAddFormChange} 
              required 
            />
            <InputField 
              label="Metric" 
              name="metric" 
              value={addFormData.metric || ''} 
              onChange={handleAddFormChange} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Objective" 
              name="objective" 
              value={addFormData.objective || ''} 
              onChange={handleAddFormChange} 
              required 
            />
            <InputField 
              label="Source of Objective" 
              name="sourceOfObjective" 
              value={addFormData.sourceOfObjective || ''} 
              onChange={handleAddFormChange} 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Unit" 
              name="unit" 
              value={addFormData.unit || ''} 
              onChange={handleAddFormChange} 
              required 
            />
            <SelectField 
              label="Priority" 
              name="priority" 
              options={PRIORITY_OPTIONS} 
              value={addFormData.priority || 'Medium'} 
              onChange={handleAddFormChange} 
            />
          </div>

          <TextAreaField 
            label="Required Measure" 
            name="requiredMeasure" 
            value={addFormData.requiredMeasure || ''} 
            onChange={handleAddFormChange} 
            rows={2} 
            required 
          />

          <TextAreaField 
            label="Definition" 
            name="definition" 
            value={addFormData.definition || ''} 
            onChange={handleAddFormChange} 
            rows={3} 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField 
              label="Organization Baseline (%)" 
              name="organizationBaseline" 
              type="number" 
              value={addFormData.organizationBaseline || 0} 
              onChange={handleAddFormChange} 
              step="0.1" 
            />
            <InputField 
              label="SDC / Center Baseline (%)" 
              name="sdcCenterBaseline" 
              type="number" 
              value={addFormData.sdcCenterBaseline || 0} 
              onChange={handleAddFormChange} 
              step="0.1" 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <InputField 
              label="Project Goal (%)" 
              name="projectGoal" 
              type="number" 
              value={addFormData.projectGoal || 0} 
              onChange={handleAddFormChange} 
              step="0.1" 
              required 
            />
            <InputField 
              label="Upper Specification Limit (%)" 
              name="upperSpecificationLimit" 
              type="number" 
              value={addFormData.upperSpecificationLimit || 0} 
              onChange={handleAddFormChange} 
              step="0.1" 
            />
            <InputField 
              label="Lower Specification Limit (%)" 
              name="lowerSpecificationLimit" 
              type="number" 
              value={addFormData.lowerSpecificationLimit || 0} 
              onChange={handleAddFormChange} 
              step="0.1" 
            />
          </div>

          <TextAreaField 
            label="Analysis Model / Methodologies" 
            name="analysisModelMethodology" 
            value={addFormData.analysisModelMethodology || ''} 
            onChange={handleAddFormChange} 
            rows={2} 
            placeholder="Describe the analysis methodology used..."
          />

          <TextAreaField 
            label="Tracking Remarks" 
            name="trackingRemarks" 
            value={addFormData.trackingRemarks || ''} 
            onChange={handleAddFormChange} 
            rows={2} 
            placeholder="Any remarks about metric tracking..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default MetricsPage;