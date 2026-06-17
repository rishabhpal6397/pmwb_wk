// src/pages/size-schedule-effort/SizeScheduleEffortPage.jsx
import React, { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import InputField from '../components/forms/InputField';
import SelectField from '../components/forms/SelectField';

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: 'Not started', label: 'Not started' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Completed', label: 'Completed' },
];

const SECTIONS = [
  {
    label: 'Schedule',
    groups: [{ label: 'Schedule', cols: 6 }],
    cols: [
      { key: 'estimatedStart', label: 'Est. Start', type: 'date' },
      { key: 'estimatedEnd', label: 'Est. End', type: 'date' },
      { key: 'baselinedStart', label: 'Baselined Start', type: 'date' },
      { key: 'baselinedEnd', label: 'Baselined End', type: 'date' },
      { key: 'actualStart', label: 'Actual Start', type: 'date' },
      { key: 'actualEnd', label: 'Actual End', type: 'date' },
    ],
  },
  {
    label: 'Effort & Variance',
    groups: [
      { label: 'Effort (Person hours)', cols: 3 },
      { label: 'Schedule Variance (%)', cols: 2 },
      { label: 'Effort Variance (%)', cols: 2 },
    ],
    cols: [
      { key: 'estimatedEffort', label: 'Est.', type: 'number' },
      { key: 'revisedEffort', label: 'Rev.', type: 'number' },
      { key: 'actualEffort', label: 'Actual', type: 'number' },
      { key: 'sva', label: 'SVA', type: 'variance' },
      { key: 'svb', label: 'SVB', type: 'variance' },
      { key: 'eva', label: 'EVA', type: 'variance' },
      { key: 'evb', label: 'EVB', type: 'variance' },
    ],
  },
  {
    label: 'Cumulative Effort',
    groups: [{ label: 'Cumulative Effort', cols: 3 }],
    cols: [
      { key: 'cumulativeEstimatedEffort', label: 'Est.', type: 'readonly' },
      { key: 'cumulativeRevisedEffort', label: 'Rev.', type: 'readonly' },
      { key: 'cumulativeActualEffort', label: 'Actual', type: 'readonly' },
    ],
  },
  {
    label: 'Status & Remarks',
    groups: [{ label: 'Status & Remarks', cols: 3 }],
    cols: [
      { key: 'status', label: 'Status', type: 'select' },
      { key: 'customerDeliverable', label: 'Customer Deliverable', type: 'checkbox' },
      { key: 'remarks', label: 'Remarks', type: 'text' },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const daysBetween = (start, end) =>
  start && end ? (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) : null;

const calcScheduleVariance = (estStart, estEnd, actStart, actEnd) => {
  const estDur = daysBetween(estStart, estEnd);
  const actDur = daysBetween(actStart, actEnd);
  if (estDur === null || actDur === null || estDur === 0) return null;
  return (((actDur - estDur) / estDur) * 100).toFixed(1);
};

const calcEffortVariance = (planned, actual) =>
  planned ? (((actual - planned) / planned) * 100).toFixed(1) : null;

// ── Cell Components ────────────────────────────────────────────────────────
const VarianceCell = ({ value }) => {
  if (value == null) return <span className="text-gray-400">—</span>;
  const num = parseFloat(value);
  const color = num < 0 ? 'text-red-500' : num > 0 ? 'text-green-600' : 'text-gray-500';
  return <span className={`font-medium ${color}`}>{value}%</span>;
};

// ── Main Component ──────────────────────────────────────────────────────────
const SizeScheduleEffortPage = () => {
  const { phases, updatePhase, getCumulativeEfforts } = useAppStore();
  const [currentSection, setCurrentSection] = useState(0);

  const cumulativeEfforts = useMemo(() => getCumulativeEfforts(), [phases, getCumulativeEfforts]);

  const phasesWithData = useMemo(() =>
    phases.map(phase => {
      const cum = cumulativeEfforts.find(c => c.id === phase.id) || {};
      return {
        ...phase,
        sva: calcScheduleVariance(phase.estimatedStart, phase.estimatedEnd, phase.actualStart, phase.actualEnd),
        svb: calcScheduleVariance(phase.baselinedStart, phase.baselinedEnd, phase.actualStart, phase.actualEnd),
        eva: calcEffortVariance(phase.estimatedEffort, phase.actualEffort),
        evb: calcEffortVariance(phase.revisedEffort, phase.actualEffort),
        cumulativeEstimatedEffort: cum.cumulativeEstimatedEffort || 0,
        cumulativeRevisedEffort: cum.cumulativeRevisedEffort || 0,
        cumulativeActualEffort: cum.cumulativeActualEffort || 0,
      };
    }),
    [phases, cumulativeEfforts]
  );

  const handleFieldChange = (phaseId, field, value) => updatePhase(phaseId, { [field]: value });

  const renderCell = (phase, col) => {
    const common = {
      value: phase[col.key],
      onChange: (e) => handleFieldChange(phase.id, col.key, e.target.value),
    };

    switch (col.type) {
      case 'date':
        return <InputField type="date" {...common} className="w-28" />;
      case 'number':
        return (
          <InputField
            type="number"
            {...common}
            value={common.value || 0}
            onChange={(e) => handleFieldChange(phase.id, col.key, parseInt(e.target.value) || 0)}
            className="w-20"
          />
        );
      case 'text':
        return <InputField type="text" {...common} className="w-40" />;
      case 'select':
        return <SelectField options={STATUS_OPTIONS} {...common} />;
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={!!phase[col.key]}
            onChange={(e) => handleFieldChange(phase.id, col.key, e.target.checked)}
            className="w-4 h-4"
          />
        );
      case 'variance':
        return <VarianceCell value={phase[col.key]} />;
      default:
        return <span className="text-gray-600">{phase[col.key] ?? '—'}</span>;
    }
  };

  const section = SECTIONS[currentSection];
  const totalSections = SECTIONS.length;

  return (
    <div>
      <PageHeader title="Size, Schedule & Effort" subtitle="Phase-wise tracking with schedule & effort variances" />

      <div className="bg-white rounded shadow overflow-hidden">
        {/* Section Navigation */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600">
              Section {currentSection + 1} of {totalSections}: {section.label}
            </span>
            <div className="flex gap-1.5">
              {SECTIONS.map((sec, i) => (
                <button
                  key={i}
                  title={sec.label}
                  onClick={() => setCurrentSection(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentSection ? 'bg-blue-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentSection(s => s - 1)}
              disabled={currentSection === 0}
              className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCurrentSection(s => s + 1)}
              disabled={currentSection === totalSections - 1}
              className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-blue-500 hover:text-white hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr className="border-b">
                <th rowSpan={2} className="min-w-[150px] border p-2 align-middle text-left sticky left-0 bg-gray-100 z-10">
                  Project Phases
                </th>
                {section.groups.map((g, i) => (
                  <th key={i} colSpan={g.cols} className="border p-2 text-center bg-blue-50 text-blue-700 font-semibold">
                    {g.label}
                  </th>
                ))}
              </tr>
              <tr>
                {section.cols.map(col => (
                  <th key={col.key} className="border p-2 text-center font-medium text-gray-600 whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {phasesWithData.map(phase => (
                <tr key={phase.id} className="hover:bg-gray-50">
                  <td className="border p-2 font-semibold sticky left-0 bg-white z-10 text-gray-800">{phase.phase}</td>
                  {section.cols.map(col => (
                    <td key={col.key} className="border p-2 text-center">
                      {renderCell(phase, col)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SizeScheduleEffortPage;