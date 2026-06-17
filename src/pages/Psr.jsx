import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppstore';
import PageHeader from '../components/layout/PageHeader';
import InputField from '../components/forms/InputField';
import Button from '../components/common/Button';

const PsrPage = () => {
  const {
    offshoreEfforts,
    onsiteEfforts,
    projectInfo,
    resourceLevelEfforts,
    projectSize,
    resources,
    updateOffshoreEffort,
    updateOnsiteEffort,
    updateResourceLevelEffort,
    updateProjectSize,
    getTotalCumulativeEffort,
    getTotalPlannedEffort,
    getResourceTotalsByType,
    getResourceTotalsByLevel,
  } = useAppStore();

  const [location, setLocation] = useState('offshore'); // 'offshore' or 'onsite'

  const getDeviation = (planned, actual) => {
    if (!planned && !actual) return 0;
    if (!planned) return actual > 0 ? 100 : 0;
    return (((planned - actual) / planned) * 100).toFixed(1);
  };

  const resourceTypeTotals = useMemo(() => getResourceTotalsByType(), [resources, getResourceTotalsByType]);
  const resourceLevelTotals = useMemo(() => getResourceTotalsByLevel(), [resources, getResourceTotalsByLevel]);

  const typeToCategoryMap = {
    SEG: 'projectTeam',
    CTT: 'testingTeam',
    GRA: 'graphics',
    TWR: 'techWriter',
    QAG: 'qa',
    ORG: 'organizational',
    PMS: 'pm',
    ARC: 'architecture',
    BAS: 'businessAnalyst',
    PMO: 'pmo',
  };

  const currentPeriodByCategory = useMemo(() => {
    const result = {};
    Object.entries(typeToCategoryMap).forEach(([type, category]) => {
      const totals = resourceTypeTotals[type] || { offshorePlanned: 0, offshoreActual: 0, onsitePlanned: 0, onsiteActual: 0 };
      result[category] = {
        planned: location === 'offshore' ? totals.offshorePlanned : totals.onsitePlanned,
        actual: location === 'offshore' ? totals.offshoreActual : totals.onsiteActual,
      };
    });
    return result;
  }, [resourceTypeTotals, location]);

  // For resource levels, compute current planned/actual for each level
  const currentPeriodByLevel = useMemo(() => {
    const levels = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10'];
    const result = {};
    levels.forEach(level => {
      const totals = resourceLevelTotals[level] || { offshorePlanned: 0, offshoreActual: 0, onsitePlanned: 0, onsiteActual: 0 };
      result[level] = {
        planned: location === 'offshore' ? totals.offshorePlanned : totals.onsitePlanned,
        actual: location === 'offshore' ? totals.offshoreActual : totals.onsiteActual,
      };
    });
    return result;
  }, [resourceLevelTotals, location]);


  const typeSummary = useMemo(() => getResourceTotalsByType(), [resources, getResourceTotalsByType]);
  const levelSummary = useMemo(() => getResourceTotalsByLevel(), [resources, getResourceTotalsByLevel]);
  // Current efforts based on location
  const approvedEffort = useMemo(() => (projectInfo.estimatedEffort * 0.9).toFixed(2), [projectInfo.estimatedEffort]);
  const currentEfforts = location === 'offshore' ? offshoreEfforts : onsiteEfforts;
  const updateEffort = location === 'offshore' ? updateOffshoreEffort : updateOnsiteEffort;

  // Resource level data for current location
  const resourceLevelData = useMemo(() => {
    const levels = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10'];
    const data = {};
    levels.forEach(level => {
      const levelObj = resourceLevelEfforts?.[level]?.[location];
      if (levelObj) {
        data[level] = {
          uptoLastPlanned: levelObj.uptoLastPlanned ?? 0,
          uptoLastActual: levelObj.uptoLastActual ?? 0,
          currentPlanned: currentPeriodByLevel[level]?.planned ?? 0,
          currentActual: currentPeriodByLevel[level]?.actual ?? 0,
          cumulativePlanned: (levelObj.uptoLastPlanned ?? 0) + (currentPeriodByLevel[level]?.planned ?? 0),
          cumulativeActual: (levelObj.uptoLastActual ?? 0) + (currentPeriodByLevel[level]?.actual ?? 0),
        };
      } else {
        data[level] = {
          uptoLastPlanned: 0, uptoLastActual: 0,
          currentPlanned: currentPeriodByLevel[level]?.planned ?? 0,
          currentActual: currentPeriodByLevel[level]?.actual ?? 0,
          cumulativePlanned: currentPeriodByLevel[level]?.planned ?? 0,
          cumulativeActual: currentPeriodByLevel[level]?.actual ?? 0,
        };
      }
    });
    return data;
  }, [location, resourceLevelEfforts, currentPeriodByLevel]);

  // Totals for effort by type table
  const typeTotals = useMemo(() => {
    let uptoLastPlanned = 0, uptoLastActual = 0;
    let currentPlanned = 0, currentActual = 0;
    let cumulativePlanned = 0, cumulativeActual = 0;
    Object.values(currentEfforts).forEach(cat => {
      uptoLastPlanned += cat.uptoLastPlanned ?? 0;
      uptoLastActual += cat.uptoLastActual ?? 0;
    });
    Object.values(currentPeriodByCategory).forEach(cat => {
      currentPlanned += cat.planned;
      currentActual += cat.actual;
    });
    cumulativePlanned = uptoLastPlanned + currentPlanned;
    cumulativeActual = uptoLastActual + currentActual;
    return { uptoLastPlanned, uptoLastActual, currentPlanned, currentActual, cumulativePlanned, cumulativeActual };
  }, [currentEfforts, currentPeriodByCategory]);

  // Totals for resource level table
  const resourceTotals = useMemo(() => {
    let uptoLastPlanned = 0, uptoLastActual = 0;
    let currentPlanned = 0, currentActual = 0;
    let cumulativePlanned = 0, cumulativeActual = 0;
    Object.values(resourceLevelData).forEach(level => {
      uptoLastPlanned += level.uptoLastPlanned;
      uptoLastActual += level.uptoLastActual;
      currentPlanned += level.currentPlanned;
      currentActual += level.currentActual;
      cumulativePlanned += level.cumulativePlanned;
      cumulativeActual += level.cumulativeActual;
    });
    return { uptoLastPlanned, uptoLastActual, currentPlanned, currentActual, cumulativePlanned, cumulativeActual };
  }, [resourceLevelData]);

  // Categories and display names
  const categories = [
    'projectTeam', 'testingTeam', 'graphics', 'techWriter', 'qa',
    'organizational', 'pm', 'architecture', 'businessAnalyst', 'pmo'
  ];
  const displayNames = {
    projectTeam: 'Project Team Effort',
    testingTeam: 'Testing Team Effort',
    graphics: 'Graphics Efforts',
    techWriter: 'Tech. Writer Efforts',
    qa: 'QA Efforts',
    organizational: 'Organizational Efforts',
    pm: 'PM Efforts',
    architecture: 'Architecture',
    businessAnalyst: 'Business Analyst Efforts',
    pmo: 'PMO Efforts',
  };
  const levels = ['L1','L2','L3','L4','L5','L6','L7','L8','L9','L10'];

  // Team stats from resources
  const currentTeamSize = resources.filter(r => r.availabilityStatus !== 'Resigned' && r.availabilityStatus !== 'Not Available').length || 0;
  const resignedCount = resources.filter(r => r.availabilityStatus === 'Resigned').length || 0;
  const notAvailableCount = resources.filter(r => r.availabilityStatus === 'Not Available').length || 0;
  const levelCounts = useMemo(() => {
    const counts = { L1:0, L2:0, L3:0, L4:0, L5:0, L6:0, L7:0, L8:0, L9:0, L10:0 };
    resources.forEach(r => { if (counts.hasOwnProperty(r.level)) counts[r.level]++; });
    return counts;
  }, [resources]);

  // Productivity
  const totalCumulativeActual = getTotalCumulativeEffort();
  const totalCumulativePlanned = getTotalPlannedEffort();
  const plannedProductivity = (projectSize.current && totalCumulativePlanned) ? (projectSize.current / totalCumulativePlanned).toFixed(2) : 0;
  const actualProductivity = (projectSize.current && totalCumulativeActual) ? (projectSize.current / totalCumulativeActual).toFixed(2) : 0;
  const handleResourceLevelUptoLastChange = (level, field, value) => {
    updateResourceLevelEffort(level, location, 'uptoLast', field, value);
  };
  return (
    <div>
      <PageHeader title="Project Status Review" subtitle="Track planned vs actual effort" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded shadow"><p className="text-sm text-gray-500">Planned Productivity</p><p className="text-xl font-bold">{plannedProductivity} FP/Hr</p></div>
        <div className="bg-white p-3 rounded shadow"><p className="text-sm text-gray-500">Actual Productivity</p><p className="text-xl font-bold">{actualProductivity} FP/Hr</p></div>
        <div className="bg-white p-3 rounded shadow"><p className="text-sm text-gray-500">Current Team Size</p><p className="text-xl font-bold">{currentTeamSize}</p></div>
        <div className="bg-white p-3 rounded shadow"><p className="text-sm text-gray-500">Resigned / Not Available</p><p className="text-xl font-bold">{resignedCount} / {notAvailableCount}</p></div>
      </div>

      {/* Resource Level Counts */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-md font-semibold mb-2">Resource Level Counts</h3>
        <div className="grid grid-cols-5 gap-2">
          {levels.map(level => (
            <div key={level} className="flex justify-between border-b py-1">
              <span>{level}</span><span className="font-bold">{levelCounts[level] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-2 mb-4">
        <Button variant={location === 'offshore' ? 'primary' : 'secondary'} onClick={() => setLocation('offshore')}>Offshore</Button>
        <Button variant={location === 'onsite' ? 'primary' : 'secondary'} onClick={() => setLocation('onsite')}>Onsite</Button>
      </div>

      {/* Effort by Type Table */}
      <div className="mb-8 bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="text-md font-semibold mb-2">Effort as per Type (Man-hours) – {location === 'offshore' ? 'Offshore' : 'Onsite'}</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan="2" className="border p-2">Effort Type</th>
              <th colSpan="3" className="border p-2 text-center">Upto Last Period</th>
              <th colSpan="3" className="border p-2 text-center">Current Period</th>
              <th colSpan="3" className="border p-2 text-center">Current Cumulative</th>
            </tr>
            <tr>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const d = currentEfforts[cat] || {};
              const uptoLastPlanned = d.uptoLastPlanned || 0;
              const uptoLastActual = d.uptoLastActual || 0;
              const currentPlanned = currentPeriodByCategory[cat]?.planned ?? 0;
              const currentActual = currentPeriodByCategory[cat]?.actual ?? 0;
              const cumulativePlanned = uptoLastPlanned + currentPlanned;
              const cumulativeActual = uptoLastActual + currentActual;
              return (
                <tr key={cat}>
                  <td className="border p-2">{displayNames[cat]}</td>
                  {/* Upto Last – editable */}
                  <td className="border p-2">
                    <InputField type="number" value={uptoLastPlanned} onChange={(e) => updateEffort(cat, 'uptoLastPlanned', parseFloat(e.target.value) || 0)} className="w-20" />
                  </td>
                  <td className="border p-2">
                    <InputField type="number" value={uptoLastActual} onChange={(e) => updateEffort(cat, 'uptoLastActual', parseFloat(e.target.value) || 0)} className="w-20" />
                  </td>
                  <td className="border p-2 text-center">{getDeviation(uptoLastPlanned, uptoLastActual)}%</td>
                  {/* Current Period – editable */}
                  <td className="border p-2 text-center">{currentPlanned}</td>
                  <td className="border p-2 text-center">{currentActual}</td>
                  <td className="border p-2 text-center">{getDeviation(currentPlanned, currentActual)}%</td>
                  {/* Cumulative – computed, read-only */}
                  <td className="border p-2 text-center">{cumulativePlanned}</td>
                  <td className="border p-2 text-center">{cumulativeActual}</td>
                  <td className="border p-2 text-center">{getDeviation(cumulativePlanned, cumulativeActual)}%</td>
                </tr>
              );
            })}
            <tr className="bg-gray-200 font-semibold">
              <td className="border p-2">Total</td>
              <td className="border p-2">{typeTotals.uptoLastPlanned}</td>
              <td className="border p-2">{typeTotals.uptoLastActual}</td>
              <td className="border p-2">{getDeviation(typeTotals.uptoLastPlanned, typeTotals.uptoLastActual)}%</td>
              <td className="border p-2">{typeTotals.currentPlanned}</td>
              <td className="border p-2">{typeTotals.currentActual}</td>
              <td className="border p-2">{getDeviation(typeTotals.currentPlanned, typeTotals.currentActual)}%</td>
              <td className="border p-2">{typeTotals.cumulativePlanned}</td>
              <td className="border p-2">{typeTotals.cumulativeActual}</td>
              <td className="border p-2">{getDeviation(typeTotals.cumulativePlanned, typeTotals.cumulativeActual)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Effort by Resource Level Table */}
      <div className="mb-8 bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="text-md font-semibold mb-2">Effort as per Resource Level (Man-hours) – {location === 'offshore' ? 'Offshore' : 'Onsite'}</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan="2" className="border p-2">Level</th>
              <th colSpan="3" className="border p-2 text-center">Upto Last Period</th>
              <th colSpan="3" className="border p-2 text-center">Current Period</th>
              <th colSpan="3" className="border p-2 text-center">Current Cumulative</th>
            </tr>
            <tr>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
              <th className="border p-2">Planned</th><th className="border p-2">Actual</th><th className="border p-2">Dev%</th>
            </tr>
          </thead>
          <tbody>
            {levels.map(level => {
              const d = resourceLevelData[level];
              return (
                <tr key={level}>
                  <td className="border p-2 font-medium">{level}</td>
                  {/* Upto Last – editable */}
                  <td className="border p-2">
                    <InputField type="number" value={d.uptoLastPlanned} onChange={(e) => updateResourceLevelEffort(level, location, 'uptoLast', 'planned', parseFloat(e.target.value) || 0)} className="w-20" />
                   </td>
                  <td className="border p-2">
                    <InputField type="number" value={d.uptoLastActual} onChange={(e) => updateResourceLevelEffort(level, location, 'uptoLast', 'actual', parseFloat(e.target.value) || 0)} className="w-20" />
                   </td>
                  <td className="border p-2 text-center">{getDeviation(d.uptoLastPlanned, d.uptoLastActual)}%</td>
                  {/* Current Period – editable */}
                  <td className="border p-2 text-center">{d.currentPlanned}</td>
                  <td className="border p-2 text-center">{d.currentActual}</td>
                  <td className="border p-2 text-center">{getDeviation(d.currentPlanned, d.currentActual)}%</td>
                  {/* Cumulative – read-only */}
                  <td className="border p-2 text-center">{d.cumulativePlanned}</td>
                  <td className="border p-2 text-center">{d.cumulativeActual}</td>
                  <td className="border p-2 text-center">{getDeviation(d.cumulativePlanned, d.cumulativeActual)}%</td>
                </tr>
              );
            })}
            <tr className="bg-gray-200 font-semibold">
              <td className="border p-2">Total</td>
              <td className="border p-2">{resourceTotals.uptoLastPlanned}</td>
              <td className="border p-2">{resourceTotals.uptoLastActual}</td>
              <td className="border p-2">{getDeviation(resourceTotals.uptoLastPlanned, resourceTotals.uptoLastActual)}%</td>
              <td className="border p-2">{resourceTotals.currentPlanned}</td>
              <td className="border p-2">{resourceTotals.currentActual}</td>
              <td className="border p-2">{getDeviation(resourceTotals.currentPlanned, resourceTotals.currentActual)}%</td>
              <td className="border p-2">{resourceTotals.cumulativePlanned}</td>
              <td className="border p-2">{resourceTotals.cumulativeActual}</td>
              <td className="border p-2">{getDeviation(resourceTotals.cumulativePlanned, resourceTotals.cumulativeActual)}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Project Size Section */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-md font-semibold mb-2">Project Size (FP / Other count)</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm text-gray-500">Initial</label><p className="text-lg font-semibold">{projectInfo.estimatedEffort}</p></div>
          <div><label className="block text-sm text-gray-500">Last Calculated</label><p className="text-lg font-semibold">{approvedEffort}</p></div>
          <div><label className="block text-sm text-gray-500">Current Calculated</label><p className="text-lg font-semibold">{approvedEffort}</p></div>
          <div><label className="block text-sm text-gray-500">Deviation (%)</label><p className="text-lg font-semibold">{getDeviation(projectInfo.estimatedEffort, approvedEffort)}%</p></div>
        </div>
      </div>
    </div>
  );
};

export default PsrPage;