
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createUiSlice } from './slices/uiSlice';
import { createProjectSlice } from './slices/projectSlice';
import { createResourceSlice } from './slices/resourceSlice';
import { createPsrSlice } from './slices/psrSlice';
import { createMetricsSlice } from './slices/metricsSlice';
import { createTrainingSlice } from './slices/trainingSlice'; // Add this
import { createIssueSlice } from './slices/issueManagementSlice';
import { createOpportunitySlice } from './slices/opportunitySlice';
import { createVerificationSlice } from './slices/verificationSlice';
import { createRiskSlice } from './slices/riskSlice';
import { createLessonSlice } from './slices/lessonSlice';
import { createPerformanceSlice } from './slices/performanceSlice';
import { createCloseoutSlice } from './slices/closeoutSlice';

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...createUiSlice(set, get),
      ...createProjectSlice(set, get),
      ...createResourceSlice(set, get),
      ...createPsrSlice(set, get),
      ...createMetricsSlice(set, get),
      ...createTrainingSlice(set, get), 
      ...createIssueSlice(set,get),
      ...createOpportunitySlice(set,get),
      ...createVerificationSlice(set,get),
      ...createRiskSlice(set,get),
      ...createLessonSlice(set,get),
      ...createPerformanceSlice(set,get),
      ...createCloseoutSlice(set,get),
 
    }),
    {
      name: 'pmo-workbench-storage',
      version: 2,              
      migrate: (persistedState, version) => {
        if (version < 2) {
         
          return {};
        }
        return persistedState;
      },
    }
  )
);