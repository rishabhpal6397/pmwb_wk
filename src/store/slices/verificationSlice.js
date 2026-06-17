

const createDefaultVerificationEntry = () => ({
  id: '',
  date: new Date().toISOString().split('T')[0],
  projectName: '',
  totalPlannedEffort: 0,
  phase: 'Analysis and Design',
  moduleSubmodule: '',
  verificationActivity: 'Review-Peer review inspection',
  type: 'Internal',
  estimatedEffort: 0,
  actualEffort: 0,
  majorDefects: 0,
  minorDefects: 0,
  trivialDefects: 0,
  totalDefects: 0,
  closedDefects: 0,
  weightedDefects: 0,
  estimatedRework: 0,
  actualRework: 0,
  remarks: '',
});

export const createVerificationSlice = (set, get) => ({
  verificationEntries: [],

  addVerificationEntry: (entry) => {
    // Calculate derived fields
    const totalDefects = (entry.majorDefects || 0) + (entry.minorDefects || 0) + (entry.trivialDefects || 0);
    const weightedDefects = (entry.majorDefects || 0) * 1 + (entry.minorDefects || 0) * 0.33 + (entry.trivialDefects || 0) * 0.2;
    
    set((state) => ({
      verificationEntries: [...state.verificationEntries, {
        ...entry,
        id: Date.now().toString(),
        totalDefects,
        weightedDefects,
      }],
    }));
  },

  updateVerificationEntry: (id, updates) => {
    set((state) => ({
      verificationEntries: state.verificationEntries.map((entry) => {
        if (entry.id !== id) return entry;
        
        const updatedEntry = { ...entry, ...updates };
        // Recalculate derived fields
        updatedEntry.totalDefects = (updatedEntry.majorDefects || 0) + (updatedEntry.minorDefects || 0) + (updatedEntry.trivialDefects || 0);
        updatedEntry.weightedDefects = (updatedEntry.majorDefects || 0) * 1 + (updatedEntry.minorDefects || 0) * 0.33 + (updatedEntry.trivialDefects || 0) * 0.2;
        
        return updatedEntry;
      }),
    }));
  },

  removeVerificationEntry: (id) => {
    set((state) => ({
      verificationEntries: state.verificationEntries.filter((entry) => entry.id !== id),
    }));
  },

  // Get entries by phase
  getEntriesByPhase: (phase) => {
    const state = get();
    return (state.verificationEntries || []).filter((entry) => entry.phase === phase);
  },

  // Get entries by type (Internal/External)
  getEntriesByType: (type) => {
    const state = get();
    return (state.verificationEntries || []).filter((entry) => entry.type === type);
  },

  // Get summary by phase for Verification Summary table
  getPhaseSummary: () => {
    const state = get();
    const entries = state.verificationEntries || [];
    const phases = [
      'Analysis and Design', 
      'Coding and unit testing', 
      'System Integration testing',
      'User acceptance testing', 
      'Production deployment', 
      'Post production support'
    ];
    
    const summary = {};
    phases.forEach(phase => {
      const phaseEntries = entries.filter(e => e.phase === phase);
      summary[phase] = {
        review: {
          effort: 0,
          majorDefects: 0,
          minorDefects: 0,
          trivialDefects: 0,
          reworkEffort: 0,
        },
        testing: {
          effort: 0,
          majorDefects: 0,
          minorDefects: 0,
          trivialDefects: 0,
          reworkEffort: 0,
        },
      };
      
      phaseEntries.forEach(entry => {
        const isReview = entry.verificationActivity?.toLowerCase().includes('review');
        const category = isReview ? 'review' : 'testing';
        summary[phase][category].effort += entry.actualEffort || 0;
        summary[phase][category].majorDefects += entry.majorDefects || 0;
        summary[phase][category].minorDefects += entry.minorDefects || 0;
        summary[phase][category].trivialDefects += entry.trivialDefects || 0;
        summary[phase][category].reworkEffort += entry.actualRework || 0;
      });
    });
    
    return summary;
  },

  // Calculate total weighted defects
  getTotalWeightedDefects: (type = null) => {
    const state = get();
    let entries = state.verificationEntries || [];
    if (type) {
      entries = entries.filter(e => e.type === type);
    }
    return entries.reduce((sum, e) => sum + (e.weightedDefects || 0), 0);
  },

  // Calculate review efficiency
  getReviewEfficiency: () => {
    const state = get();
    const entries = state.verificationEntries || [];
    let reviewWeighted = 0;
    let testingWeighted = 0;
    
    entries.forEach(entry => {
      const isReview = entry.verificationActivity?.toLowerCase().includes('review');
      if (isReview) {
        reviewWeighted += entry.weightedDefects || 0;
      } else {
        testingWeighted += entry.weightedDefects || 0;
      }
    });
    
    const total = reviewWeighted + testingWeighted;
    return total > 0 ? (reviewWeighted / total) * 100 : 0;
  },

  // Calculate defect removal efficiency
  getDefectRemovalEfficiency: () => {
    const state = get();
    const entries = state.verificationEntries || [];
    let internalWeighted = 0;
    let externalWeighted = 0;
    
    entries.forEach(entry => {
      if (entry.type === 'Internal') {
        internalWeighted += entry.weightedDefects || 0;
      } else {
        externalWeighted += entry.weightedDefects || 0;
      }
    });
    
    const total = internalWeighted + externalWeighted;
    return total > 0 ? (internalWeighted / total) * 100 : 0;
  },
});