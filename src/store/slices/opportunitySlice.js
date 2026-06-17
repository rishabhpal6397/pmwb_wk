
export const createOpportunitySlice = (set, get) => ({
  opportunities: [],
  
  addOpportunity: (opportunity) => {
    const newOpportunity = {
      ...opportunity,
      id: Date.now().toString(),
    };
    set((state) => ({
      opportunities: [...state.opportunities, newOpportunity],
    }));
    return newOpportunity; 
  },

  updateOpportunity: (id, updates) => {
    set((state) => ({
      opportunities: state.opportunities.map((opp) =>
        opp.id === id ? { ...opp, ...updates } : opp
      ),
    }));
  },

  removeOpportunity: (id) => {
    set((state) => ({
      opportunities: state.opportunities.filter((opp) => opp.id !== id),
    }));
  },

  
  getOpportunitiesByStatus: (status) => {
    return (get().opportunities || []).filter((opp) => opp.status === status);
  },
  getOpenOpportunitiesCount: () => {
    return (get().opportunities || []).filter((opp) => 
      opp.status === 'Open' || opp.status === 'In Progress'
    ).length;
  },
  getClosedOpportunitiesCount: () => {
    return (get().opportunities || []).filter((opp) => 
      opp.status === 'Closed' || opp.status === 'Completed'
    ).length;
  },
  getTotalCostBenefit: () => {
    return (get().opportunities || []).reduce((sum, opp) => {
      const val = parseFloat(opp.costBenefit);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  },
  getTotalRevenueBenefit: () => {
    return (get().opportunities || []).reduce((sum, opp) => {
      const val = parseFloat(opp.revenueBenefit);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  },
});