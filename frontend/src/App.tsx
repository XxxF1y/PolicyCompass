import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import MatchingPage from './pages/matching/MatchingPage';
import ApplicationsPage from './pages/applications/ApplicationsPage';
import MessagesPage from './pages/messages/MessagesPage';
import CollaborationPage from './pages/collaboration/CollaborationPage';
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
        {role !== 'park' && (
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/policies" element={<MatchingPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
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
          role === 'park'
            ? <Navigate to="/park/dashboard" replace />
            : <Navigate to="/dashboard" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
