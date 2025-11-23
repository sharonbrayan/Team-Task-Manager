import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TeamView from "./pages/TeamView.jsx";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LandingPage from "./pages/Landingpage.jsx";
import Footer from "./components/Footer.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teams/:teamId"
            element={
              <ProtectedRoute>
                <TeamView />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Footer/>
    </AuthProvider>
  );
}
