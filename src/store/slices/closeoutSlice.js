// src/store/slices/closeoutSlice.js
 
const createDefaultCloseout = () => ({
  // Basic info
  projectName: '',
  recordedBy: '',
  datePrepared: new Date().toISOString().split('T')[0],
  participants: '',
  // Project overview
  goalsObjectives: '',
  successCriteria: '',
  completedAsExpected: '',
  // Highlights
  majorAccomplishments: '',
  methodsWorkedWell: '',
  particularlyUseful: '',
  // Challenges
  whatWentWrong: '',
  processesNeedImprovement: '',
  howImproveFuture: '',
  keyProblemAreas: '',
  technicalChallenges: '',
  // Post-project tasks
  continuingDevelopment: '',
  remainingActions: '',
  // KPIs - Planning Phase
  planning_kpi_1: '', // Project plans and scheduling well documented
  planning_kpi_2: '', // Schedule contained all elements
  planning_kpi_3: '', // Tasks clearly defined
  planning_kpi_4: '', // Stakeholders had adequate input
  planning_kpi_5: '', // Requirements gathered and documented
  planning_kpi_6: '', // Criteria clear for all phases
  planning_comments: '',
  // KPIs - Execution Phase
  execution_kpi_1: '', // Project reached original goals
  execution_kpi_2: '', // Unexpected changes manageable
  execution_kpi_3: '', // Baselines managed
  execution_kpi_4: '', // Risk/issue management efficient
  execution_kpi_5: '', // Progress tracked accurately
  execution_comments: '',
  // KPIs - Resource Factors
  resource_kpi_1: '', // PM reported to appropriate parties
  resource_kpi_2: '', // Project management effective
  resource_kpi_3: '', // Team organized and staffed
  resource_kpi_4: '', // Proper training received
  resource_kpi_5: '', // Efficient communication
  resource_kpi_6: '', // Functional areas collaborated
  resource_kpi_7: '', // Conflicting goals caused problems
  resource_comments: '',
  // KPIs - Overall
  overall_kpi_1: '', // Original cost/schedule accurate
  overall_kpi_2: '', // Deliverables on time
  overall_kpi_3: '', // Project within budget
  overall_kpi_4: '', // Change control constructive
  overall_kpi_5: '', // External dependencies handled
  overall_kpi_6: '', // Defects within limit
  overall_kpi_7: '', // Project objectives met
  overall_kpi_8: '', // Business objectives met
  overall_comments: '',
  // Feedback on Processes
  bestPractices: '',
  ineffectivePractices: '',
  bestPracticesContributions: '',
  // Project Performance (numeric)
  budgetedCost: 0,
  actualCost: 0,
  costVariance: 0,
  scheduleVariance: 0,
  effortVariance: 0,
  resourceUtilization: '',
  overdueTasks: 0,
  tasksCompletedOnTimePercent: 0,
  defectsSIT: 0,
  defectsUAT: 0,
  customerSatisfactionScore: 0,
  lastAuditScore: 0,
});
 
export const createCloseoutSlice = (set, get) => ({
  closeout: createDefaultCloseout(),
  updateCloseout: (updates) => {
    set((state) => ({
      closeout: { ...state.closeout, ...updates },
    }));
  },
  resetCloseout: () => {
    set({ closeout: createDefaultCloseout() });
  },
});