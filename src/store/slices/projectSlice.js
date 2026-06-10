// src/store/slices/projectSlice.js

export const createProjectSlice = (set, get) => ({
  projectInfo: {
    name: '',
    code: '',
    status: 'Not Started',
    category: '',
    type: '',
    customer: '',
    customerLOB: '',
    primaryContact: '',
    startDateSOW: null,
    endDateSOW: null,
    planStart: null,
    planEnd: null,
    revisedPlanStart: null,
    revisedPlanEnd: null,
    actualStart: null,
    actualEnd: null,
    estimatedEffort: 0,
    actualEffort: 0,
    onsiteFTEs: 0,
    offshoreFTEs: 0,
  },
  projectExtended: {
    technology: '',
    programmingLanguage: '',
    platform: '',
    businessUnit: '',
    developmentLocation: '',
    projectManager: '',
    seniorManager: '',
    projectStatus: '',
    initialSize: 0,
    sizeUnit: '',
  },
  // Hardcoded phases from workbook (Control Panel sheet)
  phases: [
    { id: 1, phase: 'Analysis and Design-Rel1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
    { id: 2, phase: 'Development and Unit Testing-Rel-1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
    { id: 3, phase: 'System Integration Testing - Rel-1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
    { id: 4, phase: 'User Acceptance Testing - Rel-1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
    { id: 5, phase: 'Production Deployment Rel-1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
    { id: 6, phase: 'Post Production Deployment Support - Rel-1', estimatedStart: '', estimatedEnd: '', baselinedStart: '', baselinedEnd: '', actualStart: '', actualEnd: '', estimatedEffort: 0, revisedEffort: 0, actualEffort: 0, status: 'Not started', customerDeliverable: false, remarks: '' },
  ],
  versionHistory: [],

  updateProjectInfo: (payload) => set((state) => ({ projectInfo: { ...state.projectInfo, ...payload } })),
  updateProjectExtended: (payload) => set((state) => ({ projectExtended: { ...state.projectExtended, ...payload } })),

  setPhases: (phases) => set({ phases }),
  updatePhase: (id, updates) => set((state) => ({
    phases: state.phases.map(p => p.id === id ? { ...p, ...updates } : p),
  })),
  updatePhaseStatus: (phaseId, status) => get().updatePhase(phaseId, { status }),

  addVersionEntry: (entry) => set((state) => ({ versionHistory: [entry, ...state.versionHistory] })),
  updateVersionEntry: (index, updates) => set((state) => ({
    versionHistory: state.versionHistory.map((v, i) => i === index ? { ...v, ...updates } : v),
  })),
  removeVersionEntry: (index) => set((state) => ({
    versionHistory: state.versionHistory.filter((_, i) => i !== index),
  })),

  // Helper for cumulative efforts
  getCumulativeEfforts: () => {
    let cumEst = 0, cumRev = 0, cumAct = 0;
    return get().phases.map(phase => {
      cumEst += phase.estimatedEffort || 0;
      cumRev += phase.revisedEffort || 0;
      cumAct += phase.actualEffort || 0;
      return {
        id: phase.id,
        cumulativeEstimatedEffort: cumEst,
        cumulativeRevisedEffort: cumRev,
        cumulativeActualEffort: cumAct,
      };
    });
  },
});