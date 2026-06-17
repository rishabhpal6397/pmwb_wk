

const createCategoryState = () => ({
  uptoLastPlanned: 0,
  uptoLastActual: 0,
  currentPlanned: 0,
  currentActual: 0,
  cumulativePlanned: 0,
  cumulativeActual: 0,
});

const createResourceLevelState = () => ({
  uptoLastPlanned: 0,
  uptoLastActual: 0,
  currentPlanned: 0,
  currentActual: 0,
  cumulativePlanned: 0,
  cumulativeActual: 0,
});

export const createPsrSlice = (set, get) => ({
  offshoreEfforts: {
    projectTeam: createCategoryState(),
    testingTeam: createCategoryState(),
    graphics: createCategoryState(),
    techWriter: createCategoryState(),
    qa: createCategoryState(),
    organizational: createCategoryState(),
    pm: createCategoryState(),
    architecture: createCategoryState(),
    businessAnalyst: createCategoryState(),
    pmo: createCategoryState(),
  },
  onsiteEfforts: {
    projectTeam: createCategoryState(),
    testingTeam: createCategoryState(),
    graphics: createCategoryState(),
    techWriter: createCategoryState(),
    qa: createCategoryState(),
    organizational: createCategoryState(),
    pm: createCategoryState(),
    architecture: createCategoryState(),
    businessAnalyst: createCategoryState(),
    pmo: createCategoryState(),
  },
  resourceLevelEfforts: {
    L1: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L2: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L3: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L4: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L5: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L6: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L7: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L8: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L9: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
    L10: { offshore: createResourceLevelState(), onsite: createResourceLevelState() },
  },
  projectSize: { initial: 0, lastCalculated: 0, current: 0 },

  // Helper to update a category in a location (offshore/onsite)
  _updateCategory: (location, category, field, value) => {
    set((state) => {
      const oldEffort = state[`${location}Efforts`][category];
      const updatedEffort = {
        ...oldEffort,
        [field]: value,
      };
      // Recalculate cumulative
      updatedEffort.cumulativePlanned = updatedEffort.uptoLastPlanned + updatedEffort.currentPlanned;
      updatedEffort.cumulativeActual = updatedEffort.uptoLastActual + updatedEffort.currentActual;

      return {
        ...state,
        [`${location}Efforts`]: {
          ...state[`${location}Efforts`],
          [category]: updatedEffort,
        },
      };
    });
  },

  updateOffshoreEffort: (category, field, value) => {
    get()._updateCategory('offshore', category, field, value);
  },

  updateOnsiteEffort: (category, field, value) => {
    get()._updateCategory('onsite', category, field, value);
  },

  // Helper for resource level updates
  _updateResourceLevel: (level, location, period, field, value) => {
    set((state) => {
      const oldLevelData = state.resourceLevelEfforts[level][location];
      const updatedLevelData = { ...oldLevelData };
      if (period === 'uptoLast') {
        if (field === 'planned') updatedLevelData.uptoLastPlanned = value;
        if (field === 'actual') updatedLevelData.uptoLastActual = value;
      } else if (period === 'current') {
        if (field === 'planned') updatedLevelData.currentPlanned = value;
        if (field === 'actual') updatedLevelData.currentActual = value;
      }
      updatedLevelData.cumulativePlanned = updatedLevelData.uptoLastPlanned + updatedLevelData.currentPlanned;
      updatedLevelData.cumulativeActual = updatedLevelData.uptoLastActual + updatedLevelData.currentActual;

      return {
        ...state,
        resourceLevelEfforts: {
          ...state.resourceLevelEfforts,
          [level]: {
            ...state.resourceLevelEfforts[level],
            [location]: updatedLevelData,
          },
        },
      };
    });
  },

  updateResourceLevelEffort: (level, location, period, field, value) => {
    get()._updateResourceLevel(level, location, period, field, value);
  },

  updateProjectSize: (type, value) => {
    set((state) => ({
      ...state,
      projectSize: { ...state.projectSize, [type]: value },
    }));
  },

  // Selectors
  getTotalCumulativeEffort: () => {
    const state = get();
    let total = 0;
    Object.values(state.offshoreEfforts).forEach(e => total += e.cumulativeActual);
    Object.values(state.onsiteEfforts).forEach(e => total += e.cumulativeActual);
    return total;
  },

  getTotalPlannedEffort: () => {
    const state = get();
    let total = 0;
    Object.values(state.offshoreEfforts).forEach(e => total += e.cumulativePlanned);
    Object.values(state.onsiteEfforts).forEach(e => total += e.cumulativePlanned);
    return total;
  },

  getActualOffshoreFTEs: () => {
    const summary = get().getResourceTotalsByType();

    const total = Object.values(summary)
      .reduce(
        (sum, item) =>
          sum + (Number(item.offshoreActual) || 0),
        0
      );

    return (total / 8).toFixed(2);
  },

  getActualOnsiteFTEs: () => {
    const summary = get().getResourceTotalsByType();

    const total = Object.values(summary)
      .reduce(
        (sum, item) =>
          sum + (Number(item.onsiteActual) || 0),
        0
      );

    return (total / 8).toFixed(2);
  },
});