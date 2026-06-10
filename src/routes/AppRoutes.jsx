import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../pages/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

import LandingPage            from '../pages/LandingPage';
import AuthPage               from '../pages/AuthPage';
import Dashboard              from '../pages/Dashboard';
import ProjectInfoPage        from '../pages/ProjectInfo';
import RiskMethodologyPage    from '../pages/RiskMethodology';
import SizeScheduleEffortPage from '../pages/SizeScheduleEffort';
import PsrPage                from '../pages/Psr';
import ResourcesPage          from '../pages/Resources';
import TrainingPage           from '../pages/TrainingPage';
import MetricsPage            from '../pages/MetricsPage';
import RiskManagementPage           from '../pages/RiskManagement';
import IssuesManagementPage      from '../pages/IssuesManagementPage';
import OpportunityTrackerPage   from '../pages/OpportunityTrackerPage';
 import VerificationDataPage    from '../pages/VerificationDataPage';
import ProjectCloseoutPage       from '../pages/ProjectCloseout';
import VerificationSummaryPage from '../pages/VerificationSummary';
import LessonLearnedPage         from '../pages/LessonLearned';
import PerformanceMetricsPage     from '../pages/PerformanceMetrics';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"     element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected — all inside DashboardLayout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard"            element={<Dashboard />} />
        <Route path="/project-info"         element={<ProjectInfoPage />} />
        <Route path="/psr"                  element={<PsrPage />} />
        <Route path="/resources"            element={<ResourcesPage />} />
        <Route path="/training"             element={<TrainingPage />} />
        <Route path="/metrics"              element={<MetricsPage />} />
        <Route path="/size-schedule-effort" element={<SizeScheduleEffortPage />} />
        <Route path="/risk-methodology"     element={<RiskMethodologyPage />} />
        <Route path="/risks"             element={<RiskManagementPage />} />
        { <Route path="/issues-management"   element={<IssuesManagementPage />} /> }
        { <Route path="/opportunities"     element={<OpportunityTrackerPage />} /> }
        { <Route path="/verification"      element={<VerificationDataPage />} /> }
        { <Route path="/verificationsummary" element={<VerificationSummaryPage />} /> }
        { <Route path="/closeout"          element={<ProjectCloseoutPage />} /> }
      
        <Route path="/lessons"           element={<LessonLearnedPage />} />
        <Route path="/performance"       element={<PerformanceMetricsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;