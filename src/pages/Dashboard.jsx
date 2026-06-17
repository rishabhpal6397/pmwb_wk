import React, { useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import MetricCard from '../components/cards/MetricCard';
import InfoCard from '../components/cards/InfoCard';
import { exportToExcel } from '../services/excel/exportWorkBook';

// Reusable badge for status
const StatusBadge = ({ status }) => {
  const colors = {
    Open: 'bg-red-100 text-red-800',
    Closed: 'bg-green-100 text-green-800',
    'In Progress': 'bg-yellow-100 text-yellow-800',
  };
  return <span className={`px-2 py-1 rounded text-xs ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

// Reusable item list
const ItemList = ({ items, title, emptyText }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {items?.length ? (
      items.slice(0, 5).map((item) => (
        <div key={item.id} className="border-b py-2 flex justify-between">
          <span>{item.riskTitle || item.description}</span>
          <StatusBadge status={item.status} />
        </div>
      ))
    ) : (
      <p className="text-gray-500">{emptyText}</p>
    )}
  </div>
);

const Dashboard = () => {
  const {
    projectInfo,
    resources,
    risks,
    issues,
    phases,
    getTotalCumulativeEffort,
    getTotalPlannedEffort,
  } = useAppStore();

  // --- Derived stats with useMemo ---
  const stats = useMemo(() => {
    const totalActual = getTotalCumulativeEffort();
    const totalPlanned = getTotalPlannedEffort();
    const approved = projectInfo.estimatedEffort * 0.9;
    const effortVariance = totalPlanned ? ((totalActual - totalPlanned) / totalPlanned) * 100 : 0;

    return {
      totalResources: resources.length,
      openRisks: risks?.filter((r) => r.status !== 'Closed').length || 0,
      openIssues: issues?.filter((i) => i.status !== 'Closed').length || 0,
      totalActual,
      totalPlanned,
      approved,
      effortVariance,
      remainingEffort: Math.max(approved - totalActual, 0),
      projectProgress: phases.length ? (phases.filter((p) => p.status === 'Completed').length / phases.length) * 100 : 0,
    };
  }, [resources, risks, issues, phases, projectInfo.estimatedEffort, getTotalCumulativeEffort, getTotalPlannedEffort]);

  // --- Card configs ---
  const summaryCards = [
    { title: 'Project Status', value: projectInfo.status || 'Not Started', icon: '📋', color: projectInfo.status === 'In Progress' ? 'blue' : projectInfo.status === 'Completed' ? 'green' : 'yellow' },
    { label: 'Total Resources', value: stats.totalResources, unit: 'members' },
    { label: 'Open Risks', value: stats.openRisks, trend: stats.openRisks > 5 ? 'up' : 'down' },
    { label: 'Open Issues', value: stats.openIssues, trend: stats.openIssues > 3 ? 'up' : 'down' },
  ];

  const effortItems = [
    { label: 'Actual Effort Consumed', value: `${stats.totalActual} hrs` },
    { label: 'Planned Effort', value: `${projectInfo.estimatedEffort || 0} hrs` },
    { label: 'Approved (90%)', value: `${stats.approved.toFixed(0)} hrs` },
    { label: 'Remaining Effort', value: `${stats.remainingEffort.toFixed(0)} hrs` },
    { label: 'Effort Variance', value: `${stats.effortVariance.toFixed(1)}%`, highlight: stats.effortVariance > 0 ? 'text-red-600' : 'text-green-600' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${projectInfo.projectManager || 'Project Manager'}`}
        actions={[
          <button
            key="export"
            onClick={exportToExcel}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>,
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, idx) => {
          if (card.title) {
            return <InfoCard key={idx} title={card.title} value={card.value} icon={card.icon} color={card.color} />;
          }
          return <MetricCard key={idx} label={card.label} value={card.value} trend={card.trend} unit={card.unit} />;
        })}
      </div>

      {/* Progress + Effort */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Project Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${stats.projectProgress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {stats.projectProgress.toFixed(0)}% Complete ({phases.filter((p) => p.status === 'Completed').length}/{phases.length} phases)
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Effort Summary</h3>
          {effortItems.map((item, idx) => (
            <div key={idx} className="flex justify-between mt-1">
              <span>{item.label}:</span>
              <span className={`font-bold ${item.highlight || ''}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItemList items={risks} title="Recent Risks" emptyText="No risks recorded" />
        <ItemList items={issues} title="Recent Issues" emptyText="No issues recorded" />
      </div>
    </div>
  );
};

export default Dashboard;