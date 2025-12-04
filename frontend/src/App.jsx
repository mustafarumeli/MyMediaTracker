import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MediaDetail from './components/MediaDetail';
import './App.css';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
  return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-gold text-xl">Yükleniyor...</div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-gold text-xl">Yükleniyor...</div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/media/:id" element={
        <ProtectedRoute>
          <MediaDetail />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
