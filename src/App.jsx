import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import InterviewPage from './pages/InterviewPage';
import RecruiterAuth from './pages/RecruiterAuth';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateScorecard from './pages/CandidateScorecard';
import InterviewConfiguration from './pages/InterviewConfiguration';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/recruiter/auth" element={<RecruiterAuth />} />
        <Route
          path="/recruiter"
          element={
            <ProtectedRoute>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/candidate/:id"
          element={
            <ProtectedRoute>
              <CandidateScorecard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/configure"
          element={
            <ProtectedRoute>
              <InterviewConfiguration />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
