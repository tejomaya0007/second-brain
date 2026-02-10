import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddKnowledge from "./pages/AddKnowledge";
import Detail from "./pages/Detail";
import Chat from "./pages/Chat";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";

/* ===============================
   Protected Route Component
================================ */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loader while checking auth
  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/* ===============================
   Main App
================================ */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Layout Wrapper */}
          <Route path="/" element={<Layout />}>
            {/* Home */}
            <Route index element={<Home />} />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Profile */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Add Knowledge */}
            <Route
              path="add"
              element={
                <ProtectedRoute>
                  <AddKnowledge />
                </ProtectedRoute>
              }
            />

            {/* Edit Knowledge */}
            <Route
              path="edit/:id"
              element={
                <ProtectedRoute>
                  <AddKnowledge />
                </ProtectedRoute>
              }
            />

            {/* View Entry */}
            <Route
              path="entry/:id"
              element={
                <ProtectedRoute>
                  <Detail />
                </ProtectedRoute>
              }
            />

            {/* Chat */}
            <Route
              path="chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
