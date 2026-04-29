import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import HowItWorks from './pages/HowItWorks/HowItWorks';
import WorkflowBuilder from './pages/WorkflowBuilder/WorkflowBuilder';
import Dashboard from './pages/Dashboard/Dashboard';
import MemoryViewer from './pages/MemoryViewer/MemoryViewer';
import ExecutionHistory from './pages/ExecutionHistory/ExecutionHistory';
import Settings from './pages/Settings/Settings';
import AdminLogs from './pages/AdminLogs/AdminLogs';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages — require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/workspace" element={<WorkflowBuilder />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/memory" element={<MemoryViewer />} />
            <Route path="/history" element={<ExecutionHistory />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-logs" element={<AdminLogs />} />
            <Route path="/logs" element={<AdminLogs />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
