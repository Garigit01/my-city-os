import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/Shared/LandingPage';
import { Login } from './pages/Shared/Login';
import { Register } from './pages/Shared/Register';

import { Dashboard as CitizenDashboard } from './pages/Citizen/Dashboard';
import { FileComplaint } from './pages/Citizen/FileComplaint';
import { TrackComplaints } from './pages/Citizen/TrackComplaints';
import { Leaderboard } from './pages/Citizen/Leaderboard';

import { TaskList } from './pages/Worker/TaskList';
import { TaskDetail } from './pages/Worker/TaskDetail';

import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { HeatmapView } from './pages/Admin/HeatmapView';

const AppContent = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        {/* Collapsible Left Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Dashboard Workspace */}
        <main className="flex-1 overflow-x-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Citizen Portal (Protected) */}
            <Route path="/citizen/dashboard" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            } />
            <Route path="/citizen/file-complaint" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <FileComplaint />
              </ProtectedRoute>
            } />
            <Route path="/citizen/track-complaints" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <TrackComplaints />
              </ProtectedRoute>
            } />
            <Route path="/citizen/leaderboard" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <Leaderboard />
              </ProtectedRoute>
            } />

            {/* Worker Portal (Protected) */}
            <Route path="/worker/tasks" element={
              <ProtectedRoute allowedRoles={['worker']}>
                <TaskList />
              </ProtectedRoute>
            } />
            <Route path="/worker/task/:id" element={
              <ProtectedRoute allowedRoles={['worker']}>
                <TaskDetail />
              </ProtectedRoute>
            } />

            {/* Admin Portal (Protected) */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/heatmap" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HeatmapView />
              </ProtectedRoute>
            } />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
