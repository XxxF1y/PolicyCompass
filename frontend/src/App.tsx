import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import MatchingPage from './pages/matching/MatchingPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import MaterialDetailPage from './pages/applications/MaterialDetailPage';
import MessagesPage from './pages/messages/MessagesPage';
import CollaborationPage from './pages/collaboration/CollaborationPage';
import PolicyDetailPage from './pages/policy/PolicyDetailPage';
import PolicyBlockerPage from './pages/policy/PolicyBlockerPage';
import ParkLayout from './layouts/ParkLayout';
import ParkSpacePage from './pages/park/ParkSpacePage';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Enterprise / Talent Routes */}
        {role === 'enterprise' && (
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/profile-edit" element={<ProfilePage />} />
            <Route path="/profile" element={<Navigate to="/dashboard/profile-edit" replace />} />
            <Route path="/policies" element={<MatchingPage />} />
            <Route path="/policy/:id" element={<PolicyDetailPage />} />
            <Route path="/policy/:id/blockers" element={<PolicyBlockerPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id/materials" element={<MaterialDetailPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            {/* Redirect /park to enterprise dashboard if not park */}
            <Route path="/park/*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        )}

        {/* Park Routes */}
        {role === 'park' && (
          <Route element={<ParkLayout />}>
            <Route path="/park/dashboard" element={<ParkSpacePage />} />
            <Route path="/park/investment" element={<ParkSpacePage />} />
            <Route path="/park/policies" element={<ParkSpacePage />} />
            <Route path="/park/insights" element={<ParkSpacePage />} />
            {/* Redirect other routes to park dashboard */}
            <Route path="/dashboard" element={<Navigate to="/park/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/park/dashboard" replace />} />
            <Route path="/policies" element={<Navigate to="/park/dashboard" replace />} />
            <Route path="/applications" element={<Navigate to="/park/dashboard" replace />} />
            <Route path="/collaboration" element={<Navigate to="/park/dashboard" replace />} />
          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={
          role === null
            ? <Navigate to="/login" replace />
            : role === 'park'
              ? <Navigate to="/park/dashboard" replace />
              : <Navigate to="/dashboard" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
