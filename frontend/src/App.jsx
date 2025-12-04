import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Loading from './components/Loading';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Dashboard from './pages/user/Dashboard';
import SelectVehicle from './pages/user/SelectVehicle';
import ViewProblems from './pages/user/ViewProblems';
import ViewSolution from './pages/user/ViewSolution';
import Feedback from './pages/user/Feedback';
import ViewAllFeedback from './pages/user/ViewAllFeedback';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageVehicles from './pages/admin/ManageVehicles';
import ManageProblems from './pages/admin/ManageProblems';
import ManageSolutions from './pages/admin/ManageSolutions';
import ViewFeedback from './pages/admin/ViewFeedback';

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Check if user is admin
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          setIsAdmin(userDoc.data()?.isAdmin || false);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} isAdmin={isAdmin} />

        <main style={{ flex: 1 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin />} />
            <Route
              path="/admin"
              element={<ProtectedRoute isAllowed={isAdmin}><AdminDashboard /></ProtectedRoute>}
            />
            <Route
              path="/admin/vehicles"
              element={<ProtectedRoute isAllowed={isAdmin}><ManageVehicles /></ProtectedRoute>}
            />
            <Route
              path="/admin/problems"
              element={<ProtectedRoute isAllowed={isAdmin}><ManageProblems /></ProtectedRoute>}
            />
            <Route
              path="/admin/solutions"
              element={<ProtectedRoute isAllowed={isAdmin}><ManageSolutions /></ProtectedRoute>}
            />
            <Route
              path="/admin/feedback"
              element={<ProtectedRoute isAllowed={isAdmin}><ViewFeedback /></ProtectedRoute>}
            />

            {/* User Routes - Dashboard requires login */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><Dashboard /></ProtectedRoute>}
            />

            {/* Help Routes - Public access for emergency help */}
            <Route path="/select-vehicle" element={<SelectVehicle />} />
            <Route path="/problems/:vehicleType" element={<ViewProblems />} />
            <Route path="/solution/:problemId" element={<ViewSolution />} />

            {/* Feedback Routes - Require login to submit/view feedback */}
            <Route
              path="/feedback"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><Feedback /></ProtectedRoute>}
            />
            <Route
              path="/all-feedback"
              element={<ProtectedRoute isAllowed={!!user && !isAdmin}><ViewAllFeedback /></ProtectedRoute>}
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}