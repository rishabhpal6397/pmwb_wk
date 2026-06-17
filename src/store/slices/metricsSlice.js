

const createDefaultMetric = () => ({
  id: '',
  objective: '',
  sourceOfObjective: 'Organizational Measurement Objectives',
  metric: '',
  unit: '%',
  requiredMeasure: '',
  definition: '',
  priority: 'Medium',
  organizationBaseline: null,
  sdcCenterBaseline: null,
  projectGoal: null,
  upperSpecificationLimit: null,
  lowerSpecificationLimit: null,
  currentValue: null,
  analysisModelMethodology: '',
  trackingRemarks: '',
});

export const createMetricsSlice = (set, get) => ({
  metricsList: [
    {
      id: '1',
      objective: 'Improve Delivery Variances',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Effort Variation - Initial',
      unit: '%',
      requiredMeasure: 'Initial effort estimated and Actual effort',
      definition: '(Actual effort - Estimated effort) x 100 / Estimated effort',
      priority: 'Medium',
      organizationBaseline: 10,
      sdcCenterBaseline: 10,
      projectGoal: 10,
      upperSpecificationLimit: 15,
      lowerSpecificationLimit: 0,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '2',
      objective: 'Improve Delivery Variances',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Effort Variation - Baselined',
      unit: '%',
      requiredMeasure: 'Last baselined effort estimate and Actual effort',
      definition: '(Actual effort - Baselined effort) x 100 / Baselined effort',
      priority: 'High',
      organizationBaseline: 5,
      sdcCenterBaseline: 5,
      projectGoal: 5,
      upperSpecificationLimit: 10,
      lowerSpecificationLimit: 0,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '3',
      objective: 'Improve Delivery Variances',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Schedule Variation - Initial',
      unit: '%',
      requiredMeasure: 'Schedule',
      definition: '(Actual completion date - Estimated completion date) x 100 / (Estimated duration)',
      priority: 'Medium',
      organizationBaseline: 10,
      sdcCenterBaseline: 10,
      projectGoal: 10,
      upperSpecificationLimit: 15,
      lowerSpecificationLimit: 0,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '4',
      objective: 'Improve Delivery Variances',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Schedule Variation - Baselined',
      unit: '%',
      requiredMeasure: 'Schedule',
      definition: '(Actual completion date - Last Baselined completion date) x 100 / (Last baselined duration)',
      priority: 'High',
      organizationBaseline: 5,
      sdcCenterBaseline: 5,
      projectGoal: 5,
      upperSpecificationLimit: 10,
      lowerSpecificationLimit: 0,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '5',
      objective: 'Improve Productivity and reduce Cost of Software Production',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Productivity',
      unit: 'FP/Hr',
      requiredMeasure: 'Actual Size and effort data',
      definition: 'Actual Size / Actual Effort',
      priority: 'High',
      organizationBaseline: 0.17,
      sdcCenterBaseline: 0.17,
      projectGoal: 0.18,
      upperSpecificationLimit: 0.18,
      lowerSpecificationLimit: 0.15,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '6',
      objective: 'Reduce Pre and Post Delivery Defects in all Deliveries',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Weighted Defect density',
      unit: 'Weighted defects/unit',
      requiredMeasure: 'Actual Size, Review issues and test defects',
      definition: 'Total Weighted Defects found / Actual project size',
      priority: 'High',
      organizationBaseline: 0.002,
      sdcCenterBaseline: 0.002,
      projectGoal: 0.002,
      upperSpecificationLimit: 0.003,
      lowerSpecificationLimit: 0,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '7',
      objective: 'Reduce Pre and Post Delivery Defects in all Deliveries',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Review efficiency',
      unit: '%',
      requiredMeasure: 'Total review issues and testing issues',
      definition: '[(No. of Weighted Defects found in Review) / Total No. of Weighted Defects found before Delivery (both Reviews and Testing)] * 100',
      priority: 'High',
      organizationBaseline: 70,
      sdcCenterBaseline: 70,
      projectGoal: 70,
      upperSpecificationLimit: 95,
      lowerSpecificationLimit: 60,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
    {
      id: '8',
      objective: 'Reduce Pre and Post Delivery Defects in all Deliveries',
      sourceOfObjective: 'Organizational Measurement Objectives',
      metric: 'Defect removal efficiency',
      unit: '%',
      requiredMeasure: 'Defects detected before release and post release defects',
      definition: 'DRE = (E / E + D) x 100 where E = weighted Pre-delivery errors (detected during all QC / QA activities) D = weighted Post-delivery Defects',
      priority: 'High',
      organizationBaseline: 90,
      sdcCenterBaseline: 90,
      projectGoal: 90,
      upperSpecificationLimit: 100,
      lowerSpecificationLimit: 80,
      currentValue: null,
      analysisModelMethodology: '',
      trackingRemarks: '',
    },
  ],
  addMetric: (metric) => {
      set((state) => ({
        metricsList: [...state.metricsList, { ...metric, currentValue: null }],
      }));
    },
    
  deleteMetric: (id) => {
      set((state) => ({
        metricsList: state.metricsList.filter((m) => m.id !== id),
      }));
    },

  updateMetric: (id, updates) => {
    set((state) => ({
      metricsList: state.metricsList.map((metric) =>
        metric.id === id ? { ...metric, ...updates } : metric
      ),
    }));
  },

  // Calculate all metrics based on current project data
  calculateAllMetrics: () => {
    const state = get();
    const { projectInfo, projectSize, offshoreEfforts, onsiteEfforts, resources } = state;

    // Get total actual effort from PSR
    const getTotalActualEffort = () => {
      let total = 0;
      if (offshoreEfforts) {
        Object.values(offshoreEfforts).forEach(e => total += e.cumulativeActual || 0);
      }
      if (onsiteEfforts) {
        Object.values(onsiteEfforts).forEach(e => total += e.cumulativeActual || 0);
      }
      return total;
    };

    const getTotalPlannedEffort = () => {
      let total = 0;
      if (offshoreEfforts) {
        Object.values(offshoreEfforts).forEach(e => total += e.cumulativePlanned || 0);
      }
      if (onsiteEfforts) {
        Object.values(onsiteEfforts).forEach(e => total += e.cumulativePlanned || 0);
      }
      return total;
    };

    const actualEffort = getTotalActualEffort();
    const plannedEffort = getTotalPlannedEffort();

    // 1. Effort Variation - Initial
    const initialEffort = projectInfo?.initialEstimatedEffort || 0;
    const effortVariationInitial = initialEffort > 0 
      ? ((actualEffort - initialEffort) / initialEffort) * 100 
      : null;

    // 2. Effort Variation - Baselined
    const baselinedEffort = projectInfo?.baselinedEffort || 0;
    const effortVariationBaselined = baselinedEffort > 0 
      ? ((actualEffort - baselinedEffort) / baselinedEffort) * 100 
      : null;

    // 3. Schedule Variation - Initial
    const estimatedStart = projectInfo?.estimatedStartDate ? new Date(projectInfo.estimatedStartDate) : null;
    const estimatedEnd = projectInfo?.estimatedEndDate ? new Date(projectInfo.estimatedEndDate) : null;
    const actualStart = projectInfo?.actualStartDate ? new Date(projectInfo.actualStartDate) : null;
    const actualEnd = projectInfo?.actualEndDate ? new Date(projectInfo.actualEndDate) : null;
    
    let scheduleVariationInitial = null;
    if (estimatedStart && estimatedEnd && actualEnd) {
      const estimatedDuration = Math.ceil((estimatedEnd - estimatedStart) / (1000 * 60 * 60 * 24));
      const actualDuration = Math.ceil((actualEnd - (actualStart || estimatedStart)) / (1000 * 60 * 60 * 24));
      scheduleVariationInitial = estimatedDuration > 0 
        ? ((actualDuration - estimatedDuration) / estimatedDuration) * 100 
        : null;
    }

    // 4. Schedule Variation - Baselined
    const baselinedStart = projectInfo?.baselinedStartDate ? new Date(projectInfo.baselinedStartDate) : null;
    const baselinedEnd = projectInfo?.baselinedEndDate ? new Date(projectInfo.baselinedEndDate) : null;
    
    let scheduleVariationBaselined = null;
    if (baselinedStart && baselinedEnd && actualEnd) {
      const baselinedDuration = Math.ceil((baselinedEnd - baselinedStart) / (1000 * 60 * 60 * 24));
      const actualDuration = Math.ceil((actualEnd - (actualStart || baselinedStart)) / (1000 * 60 * 60 * 24));
      scheduleVariationBaselined = baselinedDuration > 0 
        ? ((actualDuration - baselinedDuration) / baselinedDuration) * 100 
        : null;
    }

    // 5. Productivity
    const currentSize = projectSize?.current || 0;
    const productivity = actualEffort > 0 ? currentSize / actualEffort : null;

    // 6. Weighted Defect Density
    const weightedDefectDensity = null;

    // 7. Review Efficiency (simplified)
    const reviewEfficiency = null;

    // 8. Defect Removal Efficiency (simplified)
    const defectRemovalEfficiency = null;


    // Update all metrics
    set((state) => ({
      metricsList: state.metricsList.map((metric) => {
        if (metric.id === '1') return { ...metric, currentValue: effortVariationInitial };
        if (metric.id === '2') return { ...metric, currentValue: effortVariationBaselined };
        if (metric.id === '3') return { ...metric, currentValue: scheduleVariationInitial };
        if (metric.id === '4') return { ...metric, currentValue: scheduleVariationBaselined };
        if (metric.id === '5') return { ...metric, currentValue: productivity };
        if (metric.id === '6') return { ...metric, currentValue: weightedDefectDensity };
        if (metric.id === '7') return { ...metric, currentValue: reviewEfficiency };
        if (metric.id === '8') return { ...metric, currentValue: defectRemovalEfficiency };
        return metric;
      }),
    }));
  },
});