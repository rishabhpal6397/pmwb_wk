// src/store/slices/trainingSlice.js

const createTrainingState = () => ({
  trainings: [],
});

export const createTrainingSlice = (set, get) => ({
  trainings: [],

  addTraining: (training) => {
    set((state) => ({
      trainings: [...state.trainings, { id: Date.now(), ...training }],
    }));
  },

  updateTraining: (id, updates) => {
    set((state) => ({
      trainings: state.trainings.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  removeTraining: (id) => {
    set((state) => ({
      trainings: state.trainings.filter((t) => t.id !== id),
    }));
  },

  // Selectors
  getTrainingByStatus: (status) => {
    const { trainings } = get();
    return trainings.filter((t) => t.status === status);
  },

  getTotalTrainingEffort: () => {
    const { trainings } = get();
    return trainings.reduce((total, t) => total + (t.trainingEffort || 0), 0);
  },

  getCompletedTrainingsCount: () => {
    const { trainings } = get();
    return trainings.filter((t) => t.status === 'Completed').length;
  },
});