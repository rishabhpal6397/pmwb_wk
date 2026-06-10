// src/store/slices/riskSlice.js

// Helper: ensure value is a number
const toNumber = (val) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
};

// Helper: calculate normalized impact (average of 5 impacts)
const calcNormalizedImpact = (cost, schedule, scope, quality, regulatory) => {
  const impacts = [toNumber(cost), toNumber(schedule), toNumber(scope), toNumber(quality), toNumber(regulatory)];
  const valid = impacts.filter(v => v !== undefined && v !== null && !isNaN(v));
  if (valid.length === 0) return 0;
  const sum = valid.reduce((a, b) => a + b, 0);
  return sum / valid.length;
};

// Helper: calculate risk index
const calcRiskIndex = (probability, normalizedImpact) => {
  const prob = toNumber(probability);
  const impact = toNumber(normalizedImpact);
  if (prob === 0) return 0;
  return prob * impact;
};

// Default risk object (all fields from workbook)
const createDefaultRisk = () => ({
  id: '',
  dateIdentified: new Date().toISOString().split('T')[0],
  riskCategory: 'Process or Method',
  riskSource: 'External/Internal (Project Requirements)',
  processIdentified: 'Kick off/ Bootcamp',
  riskTitle: '',
  riskDescription: '',
  relevantISMSControl: '',
  relevance: 'QMS',
  owner: 'Project Manager',
  
  // Initial assessment (without controls)
  initialProbability: 0.5,
  initialImpactCost: 3,
  initialImpactSchedule: 3,
  initialImpactScope: 3,
  initialImpactQuality: 3,
  initialImpactRegulatory: 1,
  initialNormalizedImpact: 0,
  initialRiskIndex: 0,
  
  // Current assessment (with controls)
  currentProbability: 0.5,
  currentImpactCost: 3,
  currentImpactSchedule: 3,
  currentImpactScope: 3,
  currentImpactQuality: 3,
  currentImpactRegulatory: 1,
  currentNormalizedImpact: 0,
  currentRiskIndex: 0,
  
  // Risk treatment
  riskTreatmentPlan: 'Mitigate',
  costOfRisk: 0,
  costOfMitigationPlan: 0,
  costBenefitRatio: 0,
  escalationThreshold: 0.9,
  mitigationPlan: '',
  contingencyPlan: '',
  
  // Classification
  externalInternal: 'Internal',
  remarks: '',
  
  // Status tracking
  updateDate: new Date().toISOString().split('T')[0],
  status: 'Open',
  revProb: 0.5,
  revImpact: 0,
  revRiskIndex: 0,
  status1: '',
});

export const createRiskSlice = (set, get) => ({
  risks: [],

  addRisk: (risk) => {
    const now = new Date().toISOString().split('T')[0];
    
    // Convert all numeric fields to numbers
    const sanitizedRisk = {};
    for (const [key, val] of Object.entries(risk)) {
      const numericFields = [
        'initialProbability', 'currentProbability', 'revProb',
        'initialImpactCost', 'initialImpactSchedule', 'initialImpactScope',
        'initialImpactQuality', 'initialImpactRegulatory',
        'currentImpactCost', 'currentImpactSchedule', 'currentImpactScope',
        'currentImpactQuality', 'currentImpactRegulatory',
        'costOfRisk', 'costOfMitigationPlan', 'escalationThreshold', 'revImpact'
      ];
      sanitizedRisk[key] = numericFields.includes(key) ? toNumber(val) : val;
    }
    
    const newRisk = {
      ...createDefaultRisk(),
      ...sanitizedRisk,
      id: Date.now().toString(),
      updateDate: now,
    };
    
    // Calculate derived fields for initial
    newRisk.initialNormalizedImpact = calcNormalizedImpact(
      newRisk.initialImpactCost, newRisk.initialImpactSchedule,
      newRisk.initialImpactScope, newRisk.initialImpactQuality, newRisk.initialImpactRegulatory
    );
    newRisk.initialRiskIndex = calcRiskIndex(newRisk.initialProbability, newRisk.initialNormalizedImpact);
    
    // Calculate derived fields for current
    newRisk.currentNormalizedImpact = calcNormalizedImpact(
      newRisk.currentImpactCost, newRisk.currentImpactSchedule,
      newRisk.currentImpactScope, newRisk.currentImpactQuality, newRisk.currentImpactRegulatory
    );
    newRisk.currentRiskIndex = calcRiskIndex(newRisk.currentProbability, newRisk.currentNormalizedImpact);
    
    // Cost/benefit ratio
    const costRisk = toNumber(newRisk.costOfRisk);
    const costMitigation = toNumber(newRisk.costOfMitigationPlan);
    newRisk.costBenefitRatio = (costRisk > 0 && costMitigation > 0) ? costMitigation / costRisk : 0;
    
    // Rev fields
    newRisk.revProb = toNumber(newRisk.currentProbability);
    newRisk.revImpact = newRisk.currentNormalizedImpact;
    newRisk.revRiskIndex = newRisk.currentRiskIndex;
    
    set((state) => ({
      risks: [...state.risks, newRisk],
    }));
  },

  updateRisk: (id, updates) => {
    set((state) => ({
      risks: state.risks.map((risk) => {
        if (risk.id !== id) return risk;
        
        // Sanitize numeric fields in updates
        const sanitizedUpdates = {};
        const numericFields = [
          'initialProbability', 'currentProbability', 'revProb',
          'initialImpactCost', 'initialImpactSchedule', 'initialImpactScope',
          'initialImpactQuality', 'initialImpactRegulatory',
          'currentImpactCost', 'currentImpactSchedule', 'currentImpactScope',
          'currentImpactQuality', 'currentImpactRegulatory',
          'costOfRisk', 'costOfMitigationPlan', 'escalationThreshold', 'revImpact'
        ];
        for (const [key, val] of Object.entries(updates)) {
          sanitizedUpdates[key] = numericFields.includes(key) ? toNumber(val) : val;
        }
        
        const updated = { ...risk, ...sanitizedUpdates, updateDate: new Date().toISOString().split('T')[0] };
        
        // Recalculate all derived fields
        updated.initialNormalizedImpact = calcNormalizedImpact(
          updated.initialImpactCost, updated.initialImpactSchedule,
          updated.initialImpactScope, updated.initialImpactQuality, updated.initialImpactRegulatory
        );
        updated.initialRiskIndex = calcRiskIndex(updated.initialProbability, updated.initialNormalizedImpact);
        
        updated.currentNormalizedImpact = calcNormalizedImpact(
          updated.currentImpactCost, updated.currentImpactSchedule,
          updated.currentImpactScope, updated.currentImpactQuality, updated.currentImpactRegulatory
        );
        updated.currentRiskIndex = calcRiskIndex(updated.currentProbability, updated.currentNormalizedImpact);
        
        const costRisk = toNumber(updated.costOfRisk);
        const costMitigation = toNumber(updated.costOfMitigationPlan);
        updated.costBenefitRatio = (costRisk > 0 && costMitigation > 0) ? costMitigation / costRisk : 0;
        
        updated.revRiskIndex = toNumber(updated.revProb) * toNumber(updated.revImpact);
        
        return updated;
      }),
    }));
  },

  removeRisk: (id) => {
    set((state) => ({
      risks: state.risks.filter((risk) => risk.id !== id),
    }));
  },

  // Helper selectors
  getRisksByStatus: (status) => {
    return get().risks.filter((r) => r.status === status);
  },
  getOpenRisksCount: () => {
    return get().risks.filter((r) => r.status === 'Open' || r.status === 'Occurred & Open').length;
  },
  getClosedRisksCount: () => {
    return get().risks.filter((r) => r.status === 'Closed' || r.status === "Didn't occur & Closed").length;
  },
  getHighRiskCount: () => {
    return get().risks.filter((r) => toNumber(r.currentRiskIndex) >= 1.5).length;
  },
});