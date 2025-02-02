import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import Managers from '../pages/managers';
import Services from '../pages/services';
import Areas from '../pages/areas';
import Settings from '../pages/settings';
import Login from '../pages/login';
import { useAuth } from '../context/AuthContext';

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/managers" element={<Managers />} />
      <Route path="/services" element={<Services />} />
      <Route path="/areas" element={<Areas />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
} 