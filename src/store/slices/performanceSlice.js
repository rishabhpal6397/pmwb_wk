

const createDefaultPerformance = () => ({
  id: '',
  resourceName: '',
  role: '',
  tasksAllotted: 0,
  tasksCompletedOnTime: 0,
  onTimeCompletionPercent: 0,
  plannedHour: 0,
  timeSpent: 0,
  effortVariation: 0,
  defectsMajor: 0,
  milestonesAchievedOnTime: 0,
  training: '',
  newTechnologyLearned: '',
  customerComplaints: '',
});

export const createPerformanceSlice = (set, get) => ({
  performanceMetrics: [],

  addPerformanceMetric: (metric) => {
   
    let onTimeCompletionPercent = 0;
    if (metric.tasksAllotted > 0 && metric.tasksCompletedOnTime > 0) {
      onTimeCompletionPercent = (metric.tasksCompletedOnTime / metric.tasksAllotted) * 100;
    }
    let effortVariation = 0;
    if (metric.plannedHour > 0 && metric.timeSpent > 0) {
      effortVariation = ((metric.timeSpent - metric.plannedHour) / metric.plannedHour) * 100;
    }
    
    const newMetric = {
      ...createDefaultPerformance(),
      ...metric,
      id: Date.now().toString(),
      onTimeCompletionPercent: parseFloat(onTimeCompletionPercent.toFixed(2)),
      effortVariation: parseFloat(effortVariation.toFixed(2)),
    };
    set((state) => ({
      performanceMetrics: [...state.performanceMetrics, newMetric],
    }));
  },

  updatePerformanceMetric: (id, updates) => {
    set((state) => ({
      performanceMetrics: state.performanceMetrics.map((metric) => {
        if (metric.id !== id) return metric;
        const updated = { ...metric, ...updates };
        // Recalculate derived fields
        let onTimeCompletionPercent = 0;
        if (updated.tasksAllotted > 0 && updated.tasksCompletedOnTime > 0) {
          onTimeCompletionPercent = (updated.tasksCompletedOnTime / updated.tasksAllotted) * 100;
        }
        let effortVariation = 0;
        if (updated.plannedHour > 0 && updated.timeSpent > 0) {
          effortVariation = ((updated.timeSpent - updated.plannedHour) / updated.plannedHour) * 100;
        }
        updated.onTimeCompletionPercent = parseFloat(onTimeCompletionPercent.toFixed(2));
        updated.effortVariation = parseFloat(effortVariation.toFixed(2));
        return updated;
      }),
    }));
  },

  removePerformanceMetric: (id) => {
    set((state) => ({
      performanceMetrics: state.performanceMetrics.filter((metric) => metric.id !== id),
    }));
  },

    getMetricsByRole: (role) => {
    return get().performanceMetrics.filter((m) => m.role === role);
  },
  getAverageOnTimeCompletion: () => {
    const metrics = get().performanceMetrics;
    if (metrics.length === 0) return 0;
    const total = metrics.reduce((sum, m) => sum + (m.onTimeCompletionPercent || 0), 0);
    return parseFloat((total / metrics.length).toFixed(2));
  },
});