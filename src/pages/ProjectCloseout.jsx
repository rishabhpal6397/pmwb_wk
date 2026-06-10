// src/pages/closeout/ProjectCloseoutPage.jsx
import React, { useState, useCallback, memo } from 'react';
import { useAppStore } from '../store/useAppStore';
import PageHeader from '../components/layout/PageHeader';
import InputField from '../components/forms/InputField';
import TextAreaField from '../components/forms/TextAreaField';
import SelectField from '../components/forms/SelectField';
import Button from '../components/common/Button';

// ========== Options ==========
const YES_NO_SIMPLE = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'NA', label: 'NA' },
  { value: 'Partly', label: 'Partly' },
];

// ========== Memoized sub‑components to prevent full re‑renders ==========
const BasicInfoSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Basic Information</h2>
    <div className="grid grid-cols-2 gap-4">
      <InputField label="Project Name" value={data.projectName || ''} onChange={(e) => onChange('projectName', e.target.value)} placeholder="Enter project name" />
      <InputField label="Recorded by" value={data.recordedBy || ''} onChange={(e) => onChange('recordedBy', e.target.value)} />
      <InputField label="Date Prepared" type="date" value={data.datePrepared || ''} onChange={(e) => onChange('datePrepared', e.target.value)} />
    </div>
    <TextAreaField label="Participants" value={data.participants || ''} onChange={(e) => onChange('participants', e.target.value)} rows={2} placeholder="List all participants" />
  </div>
));

const ProjectOverviewSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Project Overview</h2>
    <TextAreaField label="Goals and objectives of the project" value={data.goalsObjectives || ''} onChange={(e) => onChange('goalsObjectives', e.target.value)} rows={2} />
    <TextAreaField label="Original criteria for project success" value={data.successCriteria || ''} onChange={(e) => onChange('successCriteria', e.target.value)} rows={2} />
    <TextAreaField
          label="Was the project completed according to original expectation?"
          value={data.completedAsExpected || ""}
          onChange={(e) => onChange('completedAsExpected', e.target.value)}
          rows={2}
        />
  </div>
));

const HighlightsSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Project Highlights</h2>
    <TextAreaField label="Major accomplishments?" value={data.majorAccomplishments || ''} onChange={(e) => onChange('majorAccomplishments', e.target.value)} rows={2} />
    <TextAreaField label="Methods worked well?" value={data.methodsWorkedWell || ''} onChange={(e) => onChange('methodsWorkedWell', e.target.value)} rows={2} />
    <TextAreaField label="Found to be particularly useful to accomplish the project" value={data.particularlyUseful || ''} onChange={(e) => onChange('particularlyUseful', e.target.value)} rows={2} />
  </div>
));

const ChallengesSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Project Challenges</h2>
    <TextAreaField label="What elements of the project went wrong?" value={data.whatWentWrong || ''} onChange={(e) => onChange('whatWentWrong', e.target.value)} rows={2} />
    <TextAreaField label="What specific processes need improvement?" value={data.processesNeedImprovement || ''} onChange={(e) => onChange('processesNeedImprovement', e.target.value)} rows={2} />
    <TextAreaField label="How can these processes be improved in the future?" value={data.howImproveFuture || ''} onChange={(e) => onChange('howImproveFuture', e.target.value)} rows={2} />
    <TextAreaField label="What were the key problem areas (i.e., budgeting, scheduling, etc.)?" value={data.keyProblemAreas || ''} onChange={(e) => onChange('keyProblemAreas', e.target.value)} rows={2} />
    <TextAreaField label="List any technical challenges." value={data.technicalChallenges || ''} onChange={(e) => onChange('technicalChallenges', e.target.value)} rows={2} />
  </div>
));

const PostProjectTasksSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Post-Project Tasks</h2>
    <TextAreaField label="Mention any continuing development and maintenance objectives." value={data.continuingDevelopment || ''} onChange={(e) => onChange('continuingDevelopment', e.target.value)} rows={2} />
    <TextAreaField label="What actions still need to be completed, and who is responsible for completing them?" value={data.remainingActions || ''} onChange={(e) => onChange('remainingActions', e.target.value)} rows={2} />
  </div>
));

// KPI Table component (reusable)
const KpiTable = memo(({ title, kpis, commentsField, data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">{title}</h2>
    <table className="min-w-full border text-sm">
      <thead className="bg-gray-100">
        <tr><th className="border p-2 text-left">KPIs</th><th className="border p-2 text-center w-28">ACHIEVED?</th><th className="border p-2 text-left">COMMENTS</th></tr>
      </thead>
      <tbody>
        {kpis.map(({ field, label }) => (
          <tr key={field}>
            <td className="border p-2">{label}</td>
            <td className="border p-2 text-center">
              <SelectField options={YES_NO_SIMPLE} value={data[field] || ''} onChange={(e) => onChange(field, e.target.value)} className="w-24" />
            </td>
            <td className="border p-2">
              <InputField value={data[`${field}_comment`] || ''} onChange={(e) => onChange(`${field}_comment`, e.target.value)} placeholder="Comments" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {commentsField && (
      <div className="mt-3">
        <TextAreaField label="Overall Comments" value={data[commentsField] || ''} onChange={(e) => onChange(commentsField, e.target.value)} rows={2} />
      </div>
    )}
  </div>
));

// Feedback on Processes – two‑column table (Best Practices & Ineffective Practices)
const FeedbackSection = memo(({ data, onChange }) => (
  <div className="bg-white p-4 rounded-lg shadow mb-6">
    <h2 className="text-lg font-semibold mb-3 border-b pb-2">Feedback on Processes</h2>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-medium mb-2">Best Practices</h3>
        <TextAreaField value={data.bestPractices || ''} onChange={(e) => onChange('bestPractices', e.target.value)} rows={4} placeholder="List practices that worked well" />
      </div>
      <div>
        <h3 className="font-medium mb-2">Ineffective Practices</h3>
        <TextAreaField value={data.ineffectivePractices || ''} onChange={(e) => onChange('ineffectivePractices', e.target.value)} rows={4} placeholder="List practices that need improvement" />
      </div>
    </div>
    <div className="mt-3">
      <h3 className="font-medium mb-2">Best Practices Contributed to Knowledge Management System</h3>
      <TextAreaField value={data.bestPracticesContributions || ''} onChange={(e) => onChange('bestPracticesContributions', e.target.value)} rows={2} />
    </div>
  </div>
));

// Project Performance Metrics table
const PerformanceMetricsSection = memo(({ data, onChange }) => {
  const costVariance = data.budgetedCost ? ((data.actualCost - data.budgetedCost) / data.budgetedCost * 100).toFixed(1) : 0;
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3 border-b pb-2">Project Performance Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="text-xs text-gray-500">Budgeted Cost ($)</label><InputField type="number" value={data.budgetedCost ?? ''} onChange={(e) => onChange('budgetedCost', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Actual Cost ($)</label><InputField type="number" value={data.actualCost ?? ''} onChange={(e) => onChange('actualCost', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Cost Variance (%)</label><p className="font-medium">{costVariance}%</p></div>
        <div><label className="text-xs text-gray-500">Schedule Variance (%)</label><InputField type="number" value={data.scheduleVariance ?? 0} onChange={(e) => onChange('scheduleVariance', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Effort Variance (%)</label><InputField type="number" value={data.effortVariance ?? 0} onChange={(e) => onChange('effortVariance', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Resource Utilization</label><InputField value={data.resourceUtilization || ''} onChange={(e) => onChange('resourceUtilization', e.target.value)} /></div>
        <div><label className="text-xs text-gray-500">Overdue Tasks/Cross Deadlines</label><InputField type="number" value={data.overdueTasks ?? 0} onChange={(e) => onChange('overdueTasks', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Tasks % completed on time</label><InputField type="number" value={data.tasksCompletedOnTimePercent ?? 0} onChange={(e) => onChange('tasksCompletedOnTimePercent', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Defects identified During SIT</label><InputField type="number" value={data.defectsSIT ?? 0} onChange={(e) => onChange('defectsSIT', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Defects identified during UAT</label><InputField type="number" value={data.defectsUAT ?? 0} onChange={(e) => onChange('defectsUAT', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Customer Satisfaction Score</label><InputField type="number" step="0.1" value={data.customerSatisfactionScore ?? 0} onChange={(e) => onChange('customerSatisfactionScore', parseFloat(e.target.value) || 0)} /></div>
        <div><label className="text-xs text-gray-500">Last Audit Score</label><InputField type="number" value={data.lastAuditScore ?? 0} onChange={(e) => onChange('lastAuditScore', parseFloat(e.target.value) || 0)} /></div>
      </div>
    </div>
  );
});

// ========== Main Component ==========
const ProjectCloseoutPage = () => {
  const { closeout, updateCloseout } = useAppStore();
  const [formData, setFormData] = useState(() => closeout || {});

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    updateCloseout(formData);
    alert('Closeout data saved successfully!');
  }, [formData, updateCloseout]);

  // KPI definitions (matching workbook)
  const planningKpis = [
    { field: 'planning_kpi_1', label: 'Project plans and scheduling were well documented, complete with adequate structure and detail' },
    { field: 'planning_kpi_2', label: 'Project schedule contained all elements of project' },
    { field: 'planning_kpi_3', label: 'Tasks were clearly defined' },
    { field: 'planning_kpi_4', label: 'Stakeholders had adequate input in planning process' },
    { field: 'planning_kpi_5', label: 'Requirements were gathered and clearly documented' },
    { field: 'planning_kpi_6', label: 'Criteria were clear for all phases of project' },
  ];
  const executionKpis = [
    { field: 'execution_kpi_1', label: 'Project reached its original goals' },
    { field: 'execution_kpi_2', label: 'Unexpected changes that occurred were of manageable frequency and intensity' },
    { field: 'execution_kpi_3', label: 'Project baselines (i.e., time, scope, cost) were thoughtfully managed' },
    { field: 'execution_kpi_4', label: 'Fundamental project management processes (i.e., risk and issue management) were efficient' },
    { field: 'execution_kpi_5', label: 'Project progress was tracked and reported in accurate, organized manner' },
  ];
  const resourceKpis = [
    { field: 'resource_kpi_1', label: 'Project manager reported to appropriate parties' },
    { field: 'resource_kpi_2', label: 'Project management was effective' },
    { field: 'resource_kpi_3', label: 'Project team was organized and adequately staffed' },
    { field: 'resource_kpi_4', label: 'Project manager and team received proper training' },
    { field: 'resource_kpi_5', label: 'There was efficient communication among project team members' },
    { field: 'resource_kpi_6', label: 'Functional areas collaborated effectively' },
    { field: 'resource_kpi_7', label: 'Conflicting goals did not cause interdepartmental problems' },
  ];
  const overallKpis = [
    { field: 'overall_kpi_1', label: 'Original cost and schedule projections were accurate' },
    { field: 'overall_kpi_2', label: 'Deliverables were presented on time within schedule' },
    { field: 'overall_kpi_3', label: 'Project was concluded within budget' },
    { field: 'overall_kpi_4', label: 'Change control was constructive' },
    { field: 'overall_kpi_5', label: 'External dependencies were known and handled effectively' },
    { field: 'overall_kpi_6', label: 'Internal & Customer Defects were within the permissible limit' },
    { field: 'overall_kpi_7', label: 'Project objectives were met' },
    { field: 'overall_kpi_8', label: 'Business objectives were met' },
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Project Closeout Meeting"
        subtitle="Document project closure details, lessons learned, and final performance"
        actions={[<Button key="save" variant="primary" onClick={handleSave}>Save Closeout</Button>]}
      />

      <BasicInfoSection data={formData} onChange={handleChange} />
      <ProjectOverviewSection data={formData} onChange={handleChange} />
      <HighlightsSection data={formData} onChange={handleChange} />
      <ChallengesSection data={formData} onChange={handleChange} />
      <PostProjectTasksSection data={formData} onChange={handleChange} />

      <KpiTable title="KPIs – Planning Phase" kpis={planningKpis} commentsField="planning_comments" data={formData} onChange={handleChange} />
      <KpiTable title="KPIs – Execution Phase" kpis={executionKpis} commentsField="execution_comments" data={formData} onChange={handleChange} />
      <KpiTable title="KPIs – Resource Factors" kpis={resourceKpis} commentsField="resource_comments" data={formData} onChange={handleChange} />
      <KpiTable title="KPIs – Overall" kpis={overallKpis} commentsField="overall_comments" data={formData} onChange={handleChange} />

      <FeedbackSection data={formData} onChange={handleChange} />
      <PerformanceMetricsSection data={formData} onChange={handleChange} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>Save Closeout Report</Button>
      </div>
    </div>
  );
};

export default ProjectCloseoutPage;