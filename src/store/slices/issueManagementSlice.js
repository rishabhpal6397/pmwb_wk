

export const createIssueSlice = (set, get) => ({
  issues: [],

  addIssue: (issue) => {
    set((state) => ({
      issues: [...state.issues, {
        ...issue,
        id: Date.now().toString(),
      }],
    }));
  },

  updateIssue: (id, updates) => {
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id ? { ...issue, ...updates } : issue
      ),
    }));
  },

  removeIssue: (id) => {
    set((state) => ({
      issues: state.issues.filter((issue) => issue.id !== id),
    }));
  },

  getIssuesByStatus: (status) => {
    const state = get();
    return (state.issues || []).filter((issue) => issue.status === status);
  },

  getOpenIssuesCount: () => {
    const state = get();
    return (state.issues || []).filter((issue) => issue.status === 'Open' || issue.status === 'In Progress').length;
  },

  getClosedIssuesCount: () => {
    const state = get();
    return (state.issues || []).filter((issue) => issue.status === 'Closed').length;
  },

  getOverdueIssuesCount: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    return (state.issues || []).filter((issue) => 
      (issue.status === 'Open' || issue.status === 'In Progress') && 
      issue.targetClosureDate && 
      issue.targetClosureDate < today
    ).length;
  },
});