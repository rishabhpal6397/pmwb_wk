import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useAppStore } from '../../store/useAppStore';

const isCellFormula = (cell) => {
  if (!cell || cell.value === null || cell.value === undefined) return false;
  if (typeof cell.value === 'object') {
    return (
      'formula' in cell.value ||
      'sharedFormula' in cell.value ||
      (cell.value.constructor?.name === 'Object' && 'result' in cell.value)
    );
  }
  return false;
};

const safeSet = (worksheet, cellRef, value) => {
  try {
    const cell = worksheet.getCell(cellRef);
    if (isCellFormula(cell)) return;
    cell.value = value === undefined || value === null ? null : value;
  } catch {
    
  }
};

const toDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const toNum = (val) => Number(val) || 0;

const copyRowStyle = (ws, sourceRow, targetRow, maxCol) => {
  try {
    const src = ws.getRow(sourceRow);
    const tgt = ws.getRow(targetRow);
    for (let col = 1; col <= maxCol; col++) {
      const srcCell = src.getCell(col);
      const tgtCell = tgt.getCell(col);
      if (srcCell.fill)      tgtCell.fill      = JSON.parse(JSON.stringify(srcCell.fill));
      if (srcCell.font)      tgtCell.font      = JSON.parse(JSON.stringify(srcCell.font));
      if (srcCell.border)    tgtCell.border    = JSON.parse(JSON.stringify(srcCell.border));
      if (srcCell.alignment) tgtCell.alignment = JSON.parse(JSON.stringify(srcCell.alignment));
    }
    tgt.height = src.height;
  } catch {
    
  }
};

const deleteRowsAfter = (worksheet, startRow) => {
  const totalRows = worksheet.rowCount;
  if (totalRows > startRow) {
    worksheet.spliceRows(startRow + 1, totalRows - startRow);
  }
};


const clearCellRange = (worksheet, startRow, endRow, startCol, endCol) => {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = worksheet.getCell(row, col);
      if (!isCellFormula(cell)) {
        cell.value = null;
      }
    }
  }
};

const clearDataCells = (worksheet, rowNumber) => {
  try {
    worksheet.getRow(rowNumber).eachCell({ includeEmpty: true }, (cell) => {
      if (!isCellFormula(cell)) {
        cell.value = null;
      }
    });
  } catch {
    
  }
};

const ensureRows = (ws, firstDataRow, templateStyleRow, count, maxCol) => {
  const lastNeeded = firstDataRow + count - 1;
  const lastExisting = ws.rowCount;
  for (let r = lastExisting + 1; r <= lastNeeded; r++) {
    ws.insertRow(r, []);
    copyRowStyle(ws, templateStyleRow, r, maxCol);
  }
};

// Helper: compute average of given numbers (ignoring empty)
const safeAverage = (...vals) => {
  const nums = vals.filter(v => typeof v === 'number' && !isNaN(v));
  return nums.length ? nums.reduce((a,b) => a+b,0) / nums.length : null;
};

// Helper: compute risk index (probability * normalized impact)
const riskIndex = (prob, normImpact) => {
  if (prob == null || normImpact == null) return null;
  return prob * normImpact;
};

// Helper: compute cumulative effort from phases array
const computeCumulativeEfforts = (phases) => {
  let cumEst = 0, cumRev = 0, cumAct = 0;
  return phases.map(p => {
    cumEst += toNum(p.estimatedEffort);
    cumRev += toNum(p.revisedEffort);
    cumAct += toNum(p.actualEffort);
    return { cumEst, cumRev, cumAct };
  });
};

export const exportToExcel = async () => {
  const state = useAppStore.getState();

  try {
    const response = await fetch('/template.xlsx');
    if (!response.ok) {
      throw new Error(`Failed to load Excel template (HTTP ${response.status})`);
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await response.arrayBuffer());

    const wsProjectInfo = workbook.getWorksheet('Project Info');
    if (wsProjectInfo) {
      const pi = state.projectInfo ?? {};

      safeSet(wsProjectInfo, 'B2', pi.name);
      safeSet(wsProjectInfo, 'B3', pi.code);
      safeSet(wsProjectInfo, 'D3', pi.status);
      safeSet(wsProjectInfo, 'B4', pi.category);
      safeSet(wsProjectInfo, 'D4', pi.type);
      safeSet(wsProjectInfo, 'B6', pi.customer);
      safeSet(wsProjectInfo, 'B7', pi.customerLOB);
      safeSet(wsProjectInfo, 'B8', pi.primaryContact);

      safeSet(wsProjectInfo, 'B10', toDate(pi.startDateSOW));
      safeSet(wsProjectInfo, 'D10', toDate(pi.endDateSOW));
      safeSet(wsProjectInfo, 'B11', toDate(pi.planStart));
      safeSet(wsProjectInfo, 'D11', toDate(pi.planEnd));
      safeSet(wsProjectInfo, 'B12', toDate(pi.revisedPlanStart));
      safeSet(wsProjectInfo, 'D12', toDate(pi.revisedPlanEnd));
      safeSet(wsProjectInfo, 'B13', toDate(pi.actualStart));
      safeSet(wsProjectInfo, 'D13', toDate(pi.actualEnd));

      safeSet(wsProjectInfo, 'B15', toNum(pi.estimatedEffort));
      safeSet(wsProjectInfo, 'B18', toNum(pi.onsiteFTEs));
      safeSet(wsProjectInfo, 'D18', toNum(pi.offshoreFTEs));

      const versions = state.versionHistory ?? [];
      deleteRowsAfter(wsProjectInfo, 23);
      ensureRows(wsProjectInfo, 24, 24, versions.length, 4);
      versions.forEach((v, i) => {
        const row = 24 + i;
        safeSet(wsProjectInfo, `A${row}`, toDate(v.date));
        safeSet(wsProjectInfo, `B${row}`, v.versionNo);
        safeSet(wsProjectInfo, `C${row}`, v.changes);
        safeSet(wsProjectInfo, `D${row}`, v.updatedBy);
      });
    }

    const wsInfo1 = workbook.getWorksheet('Project information1');
    if (wsInfo1) {
      const pi = state.projectInfo ?? {};
      const pe = state.projectExtended ?? {};

      safeSet(wsInfo1, 'B1', pi.name);
      safeSet(wsInfo1, 'D1', pi.customer);
      safeSet(wsInfo1, 'B2', pi.code);
      safeSet(wsInfo1, 'D2', toDate(pi.planStart));
      safeSet(wsInfo1, 'B3', pe.businessUnit);
      safeSet(wsInfo1, 'D3', toDate(pi.planEnd));
      safeSet(wsInfo1, 'B4', pi.category);
      safeSet(wsInfo1, 'D4', toDate(pi.revisedPlanStart));
      safeSet(wsInfo1, 'B5', pi.type);
      safeSet(wsInfo1, 'D5', toDate(pi.revisedPlanEnd));
      safeSet(wsInfo1, 'B6', pe.developmentLocation);
      safeSet(wsInfo1, 'D6', toDate(pi.actualStart));
      safeSet(wsInfo1, 'B7', pe.projectManager);
      safeSet(wsInfo1, 'D7', toDate(pi.actualEnd));
      safeSet(wsInfo1, 'B8', pe.seniorManager);
      safeSet(wsInfo1, 'D8', toNum(pi.estimatedEffort));
      safeSet(wsInfo1, 'B10', toNum(pe.initialSize));
      safeSet(wsInfo1, 'D11', 'Hours');
      safeSet(wsInfo1, 'B13', pe.sizeUnit);
      safeSet(wsInfo1, 'D13', pe.programmingLanguage);
      safeSet(wsInfo1, 'B14', pe.platform);
      safeSet(wsInfo1, 'D14', pe.technology);
      safeSet(wsInfo1, 'B15', pe.projectStatus);
    }

    const wsSize = workbook.getWorksheet('Size, Schedule and Effort');
    if (wsSize) {
      const phases = state.phases ?? [];
      deleteRowsAfter(wsSize, 3);
      const cumulatives = computeCumulativeEfforts(phases);
      ensureRows(wsSize, 3, 3, phases.length, 47);
      phases.forEach((p, i) => {
        
        const row = 3 + i;
        const cum = cumulatives[i];

        // clearDataCells(wsSize, row);

        for (let col = 1; col <= 47; col++) {
          const cell = wsSize.getCell(row, col);
          if (!isCellFormula(cell)) cell.value = null;
        }

        safeSet(wsSize, `A${row}`, p.phase);
        safeSet(wsSize, `B${row}`, toDate(p.estimatedStart));
        safeSet(wsSize, `C${row}`, toDate(p.estimatedEnd));
        safeSet(wsSize, `D${row}`, toDate(p.baselinedStart));
        safeSet(wsSize, `E${row}`, toDate(p.baselinedEnd));
        safeSet(wsSize, `F${row}`, toDate(p.actualStart));
        safeSet(wsSize, `G${row}`, toDate(p.actualEnd));
        safeSet(wsSize, `H${row}`, toNum(p.estimatedEffort));
        safeSet(wsSize, `I${row}`, toNum(p.revisedEffort));
        safeSet(wsSize, `J${row}`, toNum(p.actualEffort));
        safeSet(wsSize, `O${row}`, p.status ?? 'Not started');
        safeSet(wsSize, `P${row}`, p.customerDeliverable ? 'Yes' : 'No');
        safeSet(wsSize, `K${row}`, cum.cumEstt);  
        safeSet(wsSize, `L${row}`, cum.cumRev);  
        safeSet(wsSize, `M${row}`, cum.cumAct);  
      });
    }

    const wsResources = workbook.getWorksheet('Resources');
    if (wsResources) {
      const resources = state.resources ?? [];
      deleteRowsAfter(wsResources, 18);
      ensureRows(wsResources, 18, 18, resources.length, 16);
      resources.forEach((r, i) => {
        const row = 18 + i;
        const totalPlanned = toNum(r.offshorePlanned) + toNum(r.onsitePlanned);
        const totalActual = toNum(r.offshoreActual) + toNum(r.onsiteActual);
        const plannedBillable = (totalPlanned / 160) * 100;
        const actualBillable = (totalActual / 160) * 100;
        clearDataCells(wsResources, row);
        safeSet(wsResources, `A${row}`, r.employeeCode);
        safeSet(wsResources, `B${row}`, r.name);
        safeSet(wsResources, `F${row}`, r.level);
        safeSet(wsResources, `G${row}`, r.type);
        safeSet(wsResources, `H${row}`, toNum(r.offshorePlanned));
        safeSet(wsResources, `J${row}`, toNum(r.offshoreActual));
        safeSet(wsResources, `L${row}`, toNum(r.onsitePlanned));
        safeSet(wsResources, `N${row}`, toNum(r.onsiteActual));
        safeSet(wsResources, `P${row}`, r.availabilityStatus ?? 'Available');
        safeSet(wsResources, `T${row}`, plannedBillable.toFixed(1) + '%');
        safeSet(wsResources, `Z${row}`, actualBillable.toFixed(1) + '%');
      });
    }

    const wsRisks = workbook.getWorksheet('Risk Management');
    if (wsRisks) {
      const risks = state.risks ?? [];
      deleteRowsAfter(wsRisks, 3);
      ensureRows(wsRisks, 3, 3, risks.length, 41);
      risks.forEach((r, i) => {
        const row = 3 + i;
        

        safeSet(wsRisks, `A${row}`, toDate(r.dateIdentified));
        safeSet(wsRisks, `B${row}`, r.riskCategory);
        safeSet(wsRisks, `C${row}`, r.riskSource);
        safeSet(wsRisks, `D${row}`, r.processIdentified);
        safeSet(wsRisks, `E${row}`, r.riskTitle);
        safeSet(wsRisks, `F${row}`, r.riskDescription);
        safeSet(wsRisks, `G${row}`, r.relevantISMSControl);
        safeSet(wsRisks, `H${row}`, r.relevance);
        safeSet(wsRisks, `I${row}`, r.owner);

        safeSet(wsRisks, `J${row}`, toNum(r.initialProbability));
        safeSet(wsRisks, `K${row}`, toNum(r.initialImpactCost));
        safeSet(wsRisks, `L${row}`, toNum(r.initialImpactSchedule));
        safeSet(wsRisks, `M${row}`, toNum(r.initialImpactScope));
        safeSet(wsRisks, `N${row}`, toNum(r.initialImpactQuality));
        safeSet(wsRisks, `O${row}`, toNum(r.initialImpactRegulatory));

        safeSet(wsRisks, `R${row}`, toNum(r.currentProbability));
        safeSet(wsRisks, `S${row}`, toNum(r.currentImpactCost));
        safeSet(wsRisks, `T${row}`, toNum(r.currentImpactSchedule));
        safeSet(wsRisks, `U${row}`, toNum(r.currentImpactScope));
        safeSet(wsRisks, `V${row}`, toNum(r.currentImpactQuality));
        safeSet(wsRisks, `W${row}`, toNum(r.currentImpactRegulatory));

        safeSet(wsRisks, `Z${row}`,  r.riskTreatmentPlan ?? 'Mitigate');
        safeSet(wsRisks, `AA${row}`, toNum(r.costOfRisk));
        safeSet(wsRisks, `AB${row}`, toNum(r.costOfMitigationPlan));
        safeSet(wsRisks, `AD${row}`, toNum(r.escalationThreshold) || 0.9);
        safeSet(wsRisks, `AE${row}`, r.mitigationPlan);
        safeSet(wsRisks, `AF${row}`, r.contingencyPlan);
        safeSet(wsRisks, `AG${row}`, r.externalInternal ?? 'Internal');
        safeSet(wsRisks, `AH${row}`, r.remarks);
        safeSet(wsRisks, `AI${row}`, toDate(r.updateDate));
        safeSet(wsRisks, `AJ${row}`, r.status ?? 'Open');
        safeSet(wsRisks, `AK${row}`, toNum(r.revProb));
        safeSet(wsRisks, `AL${row}`, toNum(r.revImpact));
        safeSet(wsRisks, `AM${row}`, toNum(r.revRiskIndex));
        safeSet(wsRisks, `AN${row}`, r.status1);

        const initNorm = safeAverage(
          toNum(r.initialImpactCost),
          toNum(r.initialImpactSchedule),
          toNum(r.initialImpactScope),
          toNum(r.initialImpactQuality),
          toNum(r.initialImpactRegulatory)
        );
        safeSet(wsRisks, `P${row}`, initNorm);
        safeSet(wsRisks, `Q${row}`, riskIndex(toNum(r.initialProbability), initNorm));

        const currNorm = safeAverage(
          toNum(r.currentImpactCost),
          toNum(r.currentImpactSchedule),
          toNum(r.currentImpactScope),
          toNum(r.currentImpactQuality),
          toNum(r.currentImpactRegulatory)
        );
        safeSet(wsRisks, `X${row}`, currNorm);
        safeSet(wsRisks, `Y${row}`, riskIndex(toNum(r.currentProbability), currNorm));
      });
    }

    const wsIssues = workbook.getWorksheet('Issue Management');
    if (wsIssues) {
      const issues = state.issues ?? [];
      deleteRowsAfter(wsIssues, 2);
      ensureRows(wsIssues, 2, 2, issues.length, 10);
      issues.forEach((iss, i) => {
        const row = 2 + i;
        // clearDataCells(wsIssues, row);
        safeSet(wsIssues, `A${row}`, iss.serialNo);
        safeSet(wsIssues, `B${row}`, iss.description);
        safeSet(wsIssues, `C${row}`, iss.raisedBy);
        safeSet(wsIssues, `D${row}`, toDate(iss.dateRaised));
        safeSet(wsIssues, `E${row}`, iss.assignedTo);
        safeSet(wsIssues, `F${row}`, iss.resolutionSteps);
        safeSet(wsIssues, `G${row}`, toDate(iss.targetClosureDate));
        safeSet(wsIssues, `H${row}`, toDate(iss.actualClosureDate));
        safeSet(wsIssues, `I${row}`, iss.comments);
        safeSet(wsIssues, `J${row}`, iss.status ?? 'Open');
      });
    }

    const wsOpps = workbook.getWorksheet('Opportunity Tracker');
    if (wsOpps) {
      const opportunities = state.opportunities ?? [];
      deleteRowsAfter(wsOpps, 2);
      ensureRows(wsOpps, 2, 2, opportunities.length, 15);
      opportunities.forEach((o, i) => {
        const row = 2 + i;
        // clearDataCells(wsOpps, row);
        safeSet(wsOpps, `A${row}`, o.serialNo);
        safeSet(wsOpps, `B${row}`, toDate(o.dateIdentified));
        safeSet(wsOpps, `C${row}`, o.opportunityTitle);
        safeSet(wsOpps, `D${row}`, o.opportunityDescription);
        safeSet(wsOpps, `E${row}`, o.externalInternal ?? 'Internal');
        safeSet(wsOpps, `F${row}`, o.ownerDriving);
        safeSet(wsOpps, `G${row}`, o.processWhereIdentified);
        safeSet(wsOpps, `H${row}`, toNum(o.costBenefit));
        safeSet(wsOpps, `I${row}`, toNum(o.revenueBenefit));
        safeSet(wsOpps, `J${row}`, o.knowledgeBenefit);
        safeSet(wsOpps, `K${row}`, o.processEfficiencyBenefit);
        safeSet(wsOpps, `L${row}`, o.salesOpportunity);
        safeSet(wsOpps, `M${row}`, o.nextActionItem);
        safeSet(wsOpps, `N${row}`, o.status ?? 'Open');
        safeSet(wsOpps, `O${row}`, toDate(o.lastUpdatedOn));
        safeSet(wsOpps, `P${row}`, o.remarks);
      });
    }

    const wsTraining = workbook.getWorksheet('Training');
    if (wsTraining) {
      const trainings = state.trainings ?? [];
      deleteRowsAfter(wsTraining, 2);
      ensureRows(wsTraining, 2, 2, trainings.length, 10);
      trainings.forEach((t, i) => {
        const row = 2 + i;
        // clearDataCells(wsTraining, row);
        safeSet(wsTraining, `A${row}`, t.serialNo);
        safeSet(wsTraining, `B${row}`, t.trainingRequirement);
        safeSet(wsTraining, `C${row}`, t.trainingType);
        safeSet(wsTraining, `D${row}`, toNum(t.numberOfPeople));
        safeSet(wsTraining, `E${row}`, t.peopleToBeTrained);
        safeSet(wsTraining, `F${row}`, t.peopleTrained);
        safeSet(wsTraining, `G${row}`, toDate(t.completionDate));
        safeSet(wsTraining, `H${row}`, toNum(t.trainingEffort));
        safeSet(wsTraining, `I${row}`, t.status ?? 'Planned');
        safeSet(wsTraining, `J${row}`, t.remarks);
      });
    }

    const wsVerif = workbook.getWorksheet('Verification data');
    if (wsVerif) {
      const entries = state.verificationEntries ?? [];
      deleteRowsAfter(wsVerif, 2);
      ensureRows(wsVerif, 2, 2, entries.length, 18);
      entries.forEach((v, i) => {
        const row = 2 + i;
        // clearDataCells(wsVerif, row);
        safeSet(wsVerif, `A${row}`, toDate(v.date));
        safeSet(wsVerif, `B${row}`, v.projectName);
        safeSet(wsVerif, `C${row}`, toNum(v.totalPlannedEffort));
        safeSet(wsVerif, `D${row}`, v.phase);
        safeSet(wsVerif, `E${row}`, v.moduleSubmodule);
        safeSet(wsVerif, `F${row}`, v.verificationActivity);
        safeSet(wsVerif, `G${row}`, v.type ?? 'Internal');
        safeSet(wsVerif, `H${row}`, toNum(v.estimatedEffort));
        safeSet(wsVerif, `I${row}`, toNum(v.actualEffort));
        safeSet(wsVerif, `J${row}`, toNum(v.majorDefects));
        safeSet(wsVerif, `K${row}`, toNum(v.minorDefects));
        safeSet(wsVerif, `L${row}`, toNum(v.trivialDefects));
        safeSet(wsVerif, `M${row}`, toNum(v.totalDefects));
        safeSet(wsVerif, `N${row}`, toNum(v.closedDefects));
        safeSet(wsVerif, `O${row}`, toNum(v.weightedDefects));
        safeSet(wsVerif, `P${row}`, toNum(v.estimatedRework));
        safeSet(wsVerif, `Q${row}`, toNum(v.actualRework));
        safeSet(wsVerif, `R${row}`, v.remarks);
      });
    }

    const wsVerifSummary = workbook.getWorksheet('Verification Summary');
    if (wsVerifSummary) {
      const entries = state.verificationEntries ?? [];
      clearCellRange(wsVerifSummary, 10, 15, 3, 15);
      clearCellRange(wsVerifSummary, 29, 34, 3, 15);
    // Helper to sum by phase and activity type
    const sumBy = (phase, activityKeyword, field) => {
      return entries
        .filter(e => e.phase === phase && e.verificationActivity?.toLowerCase().includes(activityKeyword))
        .reduce((sum, e) => sum + toNum(e[field]), 0);
    };
    
    // Fill rows 10‑23 (internal review & testing)
    const phases = ['Analysis and design', 'Coding and unit testing', 'System Integration testing', 
                    'User acceptance testing', 'Production deployment', 'Post production support'];
    phases.forEach((phase, idx) => {
      const row = 10 + idx;
      // Review columns
      safeSet(wsVerifSummary, `C${row}`, sumBy(phase, 'review', 'actualEffort'));
      safeSet(wsVerifSummary, `D${row}`, sumBy(phase, 'review', 'totalSize'));
      safeSet(wsVerifSummary, `E${row}`, sumBy(phase, 'review', 'majorDefects'));
      safeSet(wsVerifSummary, `F${row}`, sumBy(phase, 'review', 'minorDefects'));
      safeSet(wsVerifSummary, `G${row}`, sumBy(phase, 'review', 'trivialDefects'));
      safeSet(wsVerifSummary, `H${row}`, sumBy(phase, 'review', 'reworkEffort'));
      // Testing columns
      safeSet(wsVerifSummary, `J${row}`, sumBy(phase, 'testing', 'actualEffort'));
      safeSet(wsVerifSummary, `K${row}`, sumBy(phase, 'testing', 'totalSize'));
      safeSet(wsVerifSummary, `L${row}`, sumBy(phase, 'testing', 'majorDefects'));
      safeSet(wsVerifSummary, `M${row}`, sumBy(phase, 'testing', 'minorDefects'));
      safeSet(wsVerifSummary, `N${row}`, sumBy(phase, 'testing', 'trivialDefects'));
      safeSet(wsVerifSummary, `O${row}`, sumBy(phase, 'testing', 'reworkEffort'));
    });
    
     const externalEntries = entries.filter(e => e.type === 'External');
      const sumExternal = (phase, activityKeyword, field) => {
        return externalEntries
          .filter(e => e.phase === phase && e.verificationActivity?.toLowerCase().includes(activityKeyword))
          .reduce((sum, e) => sum + toNum(e[field]), 0);
      };

      phases.forEach((phase, idx) => {
        const row = 29 + idx;
        // Review columns
        safeSet(wsVerifSummary, `C${row}`, sumExternal(phase, 'review', 'actualEffort'));
        safeSet(wsVerifSummary, `D${row}`, sumExternal(phase, 'review', 'totalSize'));
        safeSet(wsVerifSummary, `E${row}`, sumExternal(phase, 'review', 'majorDefects'));
        safeSet(wsVerifSummary, `F${row}`, sumExternal(phase, 'review', 'minorDefects'));
        safeSet(wsVerifSummary, `G${row}`, sumExternal(phase, 'review', 'trivialDefects'));
        safeSet(wsVerifSummary, `H${row}`, sumExternal(phase, 'review', 'actualRework'));
        // Testing columns
        safeSet(wsVerifSummary, `J${row}`, sumExternal(phase, 'testing', 'actualEffort'));
        safeSet(wsVerifSummary, `K${row}`, sumExternal(phase, 'testing', 'totalSize'));
        safeSet(wsVerifSummary, `L${row}`, sumExternal(phase, 'testing', 'majorDefects'));
        safeSet(wsVerifSummary, `M${row}`, sumExternal(phase, 'testing', 'minorDefects'));
        safeSet(wsVerifSummary, `N${row}`, sumExternal(phase, 'testing', 'trivialDefects'));
        safeSet(wsVerifSummary, `O${row}`, sumExternal(phase, 'testing', 'actualRework'));

      });
  }

    const wsLessons = workbook.getWorksheet('Lesson Learned');
    if (wsLessons) {
      const lessons = state.lessons ?? [];
      deleteRowsAfter(wsLessons, 6);
      ensureRows(wsLessons, 6, 6, lessons.length, 5);
      lessons.forEach((l, i) => {
        const row = 6 + i;
        // clearDataCells(wsLessons, row);
        safeSet(wsLessons, `C1`, l.projectName);
        safeSet(wsLessons, `A${row}`, l.winIssue);
        safeSet(wsLessons, `B${row}`, l.description);
        safeSet(wsLessons, `C${row}`, l.impact);
        safeSet(wsLessons, `D${row}`, l.futureChange);
        safeSet(wsLessons, `E${row}`, l.actionItems);
      });
    }

    const wsPerf = workbook.getWorksheet('PerformanceMetrices');
    if (wsPerf) {
      const metrics = state.performanceMetrics ?? [];
      deleteRowsAfter(wsPerf, 2);
      ensureRows(wsPerf, 2, 2, metrics.length, 13);
      metrics.forEach((m, i) => {
        const row = 2 + i;
        // clearDataCells(wsPerf, row);
        safeSet(wsPerf, `A${row}`, m.resourceName);
        safeSet(wsPerf, `B${row}`, m.role);
        safeSet(wsPerf, `C${row}`, toNum(m.tasksAllotted));
        safeSet(wsPerf, `D${row}`, toNum(m.tasksCompletedOnTime));
        safeSet(wsPerf, `E${row}`, m.onTimeCompletionPercent/100);
        safeSet(wsPerf, `F${row}`, toNum(m.plannedHour));
        safeSet(wsPerf, `G${row}`, toNum(m.timeSpent));
        safeSet(wsPerf, `H${row}`, m.effortVariation/100);
        safeSet(wsPerf, `I${row}`, toNum(m.defectsMajor));
        safeSet(wsPerf, `J${row}`, toNum(m.milestonesAchievedOnTime));
        safeSet(wsPerf, `K${row}`, m.training);
        safeSet(wsPerf, `L${row}`, m.newTechnologyLearned);
        safeSet(wsPerf, `M${row}`, m.customerComplaints);
      });
    }

    const wsPsr = workbook.getWorksheet('PSR');
    if (wsPsr) {
      const categoryRows = [
        { key: 'projectTeam',     row: 18 },
        { key: 'testingTeam',     row: 19 },
        { key: 'graphics',        row: 20 },
        { key: 'techWriter',      row: 21 },
        { key: 'qa',              row: 22 },
        { key: 'organizational',  row: 23 },
        { key: 'pm',              row: 24 },
        { key: 'architecture',    row: 25 },
        { key: 'businessAnalyst', row: 26 },
        { key: 'pmo',             row: 27 },
      ];

      categoryRows.forEach(({ key, row }) => {
        const off = state.offshoreEfforts?.[key] || {};
        const ons = state.onsiteEfforts?.[key] || {};

        safeSet(wsPsr, `B${row}`, toNum(off.uptoLastPlanned));
        safeSet(wsPsr, `C${row}`, toNum(off.uptoLastActual));
        safeSet(wsPsr, `K${row}`, toNum(ons.uptoLastPlanned));
        safeSet(wsPsr, `L${row}`, toNum(ons.uptoLastActual));

        // Current Period columns (offshore: E,F ; onsite: N,O)
        safeSet(wsPsr, `E${row}`, toNum(off.currentPlanned));
        safeSet(wsPsr, `F${row}`, toNum(off.currentActual));
        safeSet(wsPsr, `N${row}`, toNum(ons.currentPlanned));
        safeSet(wsPsr, `O${row}`, toNum(ons.currentActual));

        // Cumulative columns (offshore: H,I ; onsite: Q,R)
        const offCumPlanned = toNum(off.uptoLastPlanned) + toNum(off.currentPlanned);
        const offCumActual   = toNum(off.uptoLastActual) + toNum(off.currentActual);
        const onsCumPlanned = toNum(ons.uptoLastPlanned) + toNum(ons.currentPlanned);
        const onsCumActual   = toNum(ons.uptoLastActual) + toNum(ons.currentActual);
        safeSet(wsPsr, `H${row}`, offCumPlanned);
        safeSet(wsPsr, `I${row}`, offCumActual);
        safeSet(wsPsr, `Q${row}`, onsCumPlanned);
        safeSet(wsPsr, `R${row}`, onsCumActual);
      });

      // Resource Levels (rows 33-42)
      for (let lvl = 1; lvl <= 10; lvl++) {
        const levelKey = `L${lvl}`;
        const row = 32 + lvl;
        const levelData = state.resourceLevelEfforts?.[levelKey] || {};
        const off = levelData.offshore || {};
        const ons = levelData.onsite || {};

        safeSet(wsPsr, `B${row}`, toNum(off.uptoLastPlanned));
        safeSet(wsPsr, `C${row}`, toNum(off.uptoLastActual));
        safeSet(wsPsr, `K${row}`, toNum(ons.uptoLastPlanned));
        safeSet(wsPsr, `L${row}`, toNum(ons.uptoLastActual));

        // Current Period (offshore: E,F ; onsite: N,O)
        safeSet(wsPsr, `E${row}`, toNum(off.currentPlanned));
        safeSet(wsPsr, `F${row}`, toNum(off.currentActual));
        safeSet(wsPsr, `N${row}`, toNum(ons.currentPlanned));
        safeSet(wsPsr, `O${row}`, toNum(ons.currentActual));

        // Cumulative (offshore: H,I ; onsite: Q,R)
        const offCumPlanned = toNum(off.uptoLastPlanned) + toNum(off.currentPlanned);
        const offCumActual   = toNum(off.uptoLastActual) + toNum(off.currentActual);
        const onsCumPlanned = toNum(ons.uptoLastPlanned) + toNum(ons.currentPlanned);
        const onsCumActual   = toNum(ons.uptoLastActual) + toNum(ons.currentActual);
        safeSet(wsPsr, `H${row}`, offCumPlanned);
        safeSet(wsPsr, `I${row}`, offCumActual);
        safeSet(wsPsr, `Q${row}`, onsCumPlanned);
        safeSet(wsPsr, `R${row}`, onsCumActual);
      }

      // Also write the "Current Team Size" (cell C3) and resignation counts (cells C4, C5) if needed
      const resources = state.resources ?? [];
      const currentTeamSize = resources.filter(r => r.availabilityStatus !== 'Resigned' && r.availabilityStatus !== 'Not Available').length;
      const resignedCount = resources.filter(r => r.availabilityStatus === 'Resigned').length;
      const notAvailableCount = resources.filter(r => r.availabilityStatus === 'Not Available').length;
      safeSet(wsPsr, 'B4', currentTeamSize);
      safeSet(wsPsr, 'B5', resignedCount);
      safeSet(wsPsr, 'B6', notAvailableCount);
    }

    const wsCloseout = workbook.getWorksheet('Project Closeout Meeting');
    if (wsCloseout) {
      const co = state.closeout ?? {};

      safeSet(wsCloseout, 'A3', co.projectName);
      safeSet(wsCloseout, 'A5', co.recordedBy);
      safeSet(wsCloseout, 'B5', toDate(co.datePrepared));
      safeSet(wsCloseout, 'A7', co.participants);

      const cells = [
        { row: 14, col: 1, val: co.goalsObjectives },
        { row: 16, col: 1, val: co.successCriteria },
        { row: 18, col: 1, val: co.completedAsExpected },
        { row: 21, col: 1, val: co.majorAccomplishments },
        { row: 23, col: 1, val: co.methodsWorkedWell },
        { row: 25, col: 1, val: co.particularlyUseful },
        { row: 28, col: 1, val: co.whatWentWrong },
        { row: 30, col: 1, val: co.processesNeedImprovement },
        { row: 32, col: 1, val: co.howImproveFuture },
        { row: 34, col: 1, val: co.keyProblemAreas },
        { row: 36, col: 1, val: co.technicalChallenges },
        { row: 40, col: 1, val: co.continuingDevelopment },
        { row: 42, col: 1, val: co.remainingActions },
        { row: 70, col: 3, val: co.planning_comments },
        { row: 78, col: 3, val: co.execution_comments },
        { row: 86, col: 3, val: co.resource_comments },
        { row: 94, col: 3, val: co.overall_comments },
        { row: 82, col: 2, val: co.bestPractices },
        { row: 87, col: 2, val: co.ineffectivePractices },
        { row: 90, col: 3, val: co.bestPracticesContributions },
        { row: 94, col: 2, val: co.budgetedCost },
        { row: 95, col: 2, val: co.actualCost },
        { row: 100, col: 2, val: co.resourceUtilization },
        { row: 101, col: 2, val: co.overdueTasks },
        { row: 102, col: 2, val: co.tasksCompletedOnTimePercent },
        { row: 103, col: 2, val: co.defectsSIT },
        { row: 104, col: 2, val: co.defectsUAT },
        { row: 105, col: 2, val: co.customerSatisfactionScore },
        { row: 106, col: 2, val: co.lastAuditScore },
        { row: 97, col: 2, val: co.scheduleVariance },
        { row: 99, col: 2, val: co.effortVariance },
      ];

      const planningKPIs = [
        { row: 46, col: 2, field: 'planning_kpi_1' },
        { row: 47, col: 2, field: 'planning_kpi_2' },
        { row: 48, col: 2, field: 'planning_kpi_3' },
        { row: 49, col: 2, field: 'planning_kpi_4' },
        { row: 50, col: 2, field: 'planning_kpi_5' },
        { row: 51, col: 2, field: 'planning_kpi_6' },
      ];
      const executionKPIs = [
        { row: 54, col: 2, field: 'execution_kpi_1' },
        { row: 55, col: 2, field: 'execution_kpi_2' },
        { row: 56, col: 2, field: 'execution_kpi_3' },
        { row: 57, col: 2, field: 'execution_kpi_4' },
        { row: 58, col: 2, field: 'execution_kpi_5' },
      ];
      const resourceKPIs = [
        { row: 61, col: 2, field: 'resource_kpi_1' },
        { row: 62, col: 2, field: 'resource_kpi_2' },
        { row: 63, col: 2, field: 'resource_kpi_3' },
        { row: 64, col: 2, field: 'resource_kpi_4' },
        { row: 65, col: 2, field: 'resource_kpi_5' },
        { row: 66, col: 2, field: 'resource_kpi_6' },
        { row: 67, col: 2, field: 'resource_kpi_7' },
      ];
      const overallKPIs = [
        { row: 70, col: 2, field: 'overall_kpi_1' },
        { row: 71, col: 2, field: 'overall_kpi_2' },
        { row: 72, col: 2, field: 'overall_kpi_3' },
        { row: 73, col: 2, field: 'overall_kpi_4' },
        { row: 74, col: 2, field: 'overall_kpi_5' },
        { row: 75, col: 2, field: 'overall_kpi_6' },
        { row: 76, col: 2, field: 'overall_kpi_7' },
        { row: 77, col: 2, field: 'overall_kpi_8' },
      ];

      [...planningKPIs, ...executionKPIs, ...resourceKPIs, ...overallKPIs].forEach(kpi => {
        safeSet(wsCloseout, `${String.fromCharCode(64 + kpi.col)}${kpi.row}`, co[kpi.field] ?? '');
      });

      cells.forEach(cell => {
        safeSet(wsCloseout, `${String.fromCharCode(64 + cell.col)}${cell.row}`, cell.val);
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob   = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const dateStamp = new Date().toISOString().split('T')[0];
    const fileName  = `PMWB_${state.projectInfo?.name || 'Project'}_${dateStamp}.xlsx`;
    saveAs(blob, fileName);
  } catch (error) {
    console.error('[Export] Error during Excel export:', error);
    alert(`Failed to export workbook: ${error.message}`);
  }
};