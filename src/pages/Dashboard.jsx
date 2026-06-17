import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import MetricCard from '../components/cards/MetricCard';
import InfoCard from '../components/cards/InfoCard';
import Button from '../components/common/Button';
import { exportToExcel } from '../services/excel/exportWorkBook';

const Dashboard = () => {
  const { 
    projectInfo, 
    resources, 
    risks, 
    issues,
    phases,
    offshoreEfforts,
    onsiteEfforts,
    versionHistory,
    getTotalCumulativeEffort,
    getTotalPlannedEffort
  } = useAppStore();

  // Calculate totals
  const totalResources = resources.length;
  const openRisks = risks?.filter(r => r.status !== 'Closed').length || 0;
  const openIssues = issues?.filter(i => i.status !== 'Closed').length || 0;
  
  const totalActualEffort = getTotalCumulativeEffort();
  const totalPlannedEffort = getTotalPlannedEffort();

  const effortVariance = totalPlannedEffort ? ((totalActualEffort - totalPlannedEffort) / totalPlannedEffort * 100).toFixed(1) : 0;
  const approvedEffort = projectInfo.estimatedEffort * 0.9;
  const remainingEffort = Math.max(approvedEffort - totalActualEffort, 0).toFixed(0);

  const projectProgress = useMemo(() => {
    if (!phases.length) return 0;
    const completed = phases.filter(p => p.status === 'Completed').length;
    return (completed / phases.length) * 100;
  }, [phases]);

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle={`Welcome back, ${projectInfo.projectManager || 'Project Manager'}`}
        actions={[
          <button key="export" variant="primary" onClick={exportToExcel} className="bg-green-600 text-white px-3 py-1 rounded">
            Export to Excel
            </button>
        ]}
      />

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <InfoCard 
          title="Project Status" 
          value={projectInfo.status || 'Not Started'} 
          icon="📋"
          color={projectInfo.status === 'In Progress' ? 'blue' : projectInfo.status === 'Completed' ? 'green' : 'yellow'}
        />
        <MetricCard 
          label="Total Resources" 
          value={totalResources} 
          unit="members"
        />
        <MetricCard 
          label="Open Risks" 
          value={openRisks} 
          trend={openRisks > 5 ? 'up' : 'down'}
        />
        <MetricCard 
          label="Open Issues" 
          value={openIssues} 
          trend={openIssues > 3 ? 'up' : 'down'}
        />
      </div>

      {/* Second row: Progress and Effort */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Project Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${projectProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{projectProgress.toFixed(0)}% Complete ({phases.filter(p => p.status === 'Completed').length}/{phases.length} phases)</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Effort Summary</h3>
          <div className="flex justify-between">
            <span>Actual Effort Consumed:</span>
            <span className="font-bold">{totalActualEffort} hrs</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Planned Effort:</span>
            <span className="font-bold">{projectInfo.estimatedEffort || 0} hrs</span>
          </div>
          <div className="flex justify-between mt-1"><span>Approved (90%):</span><span className="font-bold">{approvedEffort.toFixed(0)} hrs</span></div>
          <div className="flex justify-between mt-1">
            <span>Remaining Effort:</span>
            <span className="font-bold">{(projectInfo.estimatedEffort * 0.9 - totalActualEffort).toFixed(0)} hrs</span>
          </div>
          <div className="flex justify-between mt-1"><span>Effort Variance:</span><span className={`font-bold ${effortVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>{effortVariance}%</span></div>
        </div>
      </div>

      {/* Third row: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Risks</h3>
          {risks?.slice(0, 5).map(risk => (
            <div key={risk.id} className="border-b py-2 flex justify-between">
              <span>{risk.riskTitle}</span>
              <span className={`px-2 py-1 rounded text-xs ${risk.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {risk.status}
              </span>
            </div>
          ))}
          {(!risks || risks.length === 0) && <p className="text-gray-500">No risks recorded</p>}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Recent Issues</h3>
          {issues?.slice(0, 5).map(issue => (
            <div key={issue.id} className="border-b py-2 flex justify-between">
              <span>{issue.description}</span>
              <span className={`px-2 py-1 rounded text-xs ${issue.status === 'Open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {issue.status}
              </span>
            </div>
          ))}
          {(!issues || issues.length === 0) && <p className="text-gray-500">No issues recorded</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;