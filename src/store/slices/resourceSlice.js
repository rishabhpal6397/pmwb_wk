

export const createResourceSlice = (set, get) => ({
  resources: [],

  addResource: (resource) => {
    set((state) => ({
      resources: [...state.resources, { id: Date.now(), ...resource }],
    }));
  },

  updateResource: (id, updates) => {
    set((state) => ({
      resources: state.resources.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  },

  removeResource: (id) => {
    set((state) => ({
      resources: state.resources.filter((r) => r.id !== id),
    }));
  },

  // Summaries
  getResourceTotalsByType: () => {
    const { resources } = get();
    const summary = {};
    resources.forEach((r) => {
      const type = r.type;
      if (!summary[type]) {
        summary[type] = {
          offshorePlanned: 0,
          offshoreActual: 0,
          onsitePlanned: 0,
          onsiteActual: 0,
        };
      }
      summary[type].offshorePlanned += parseInt(r.offshorePlanned) || 0;
      summary[type].offshoreActual += parseInt(r.offshoreActual) || 0;
      summary[type].onsitePlanned += parseInt(r.onsitePlanned) || 0;
      summary[type].onsiteActual += parseInt(r.onsiteActual) || 0;
    });
    return summary;
  },

  getResourceTotalsByLevel: () => {
    const { resources } = get();
    const summary = {};
    resources.forEach((r) => {
      const level = r.level;
      if (!summary[level]) {
        summary[level] = {
          offshorePlanned: 0,
          offshoreActual: 0,
          onsitePlanned: 0,
          onsiteActual: 0,
        };
      }
      summary[level].offshorePlanned += parseInt(r.offshorePlanned) || 0;
      summary[level].offshoreActual += parseInt(r.offshoreActual) || 0;
      summary[level].onsitePlanned += parseInt(r.onsitePlanned) || 0;
      summary[level].onsiteActual += parseInt(r.onsiteActual) || 0;
    });
    return summary;
  },
});