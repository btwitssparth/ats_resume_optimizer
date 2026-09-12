import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import AppShell from "./components/AppShell";
import LandingPage from "./views/LandingPage";
import Dashboard from "./views/Dashboard";
import Analyzer from "./views/Analyzer";
import History from "./views/History";
import Builder from "./views/Builder";
import Settings from "./views/Settings";

// A wrapper to enforce authentication on protected routes
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut><Navigate to="/" replace /></SignedOut>
    </>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={
          <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <SignedIn><Navigate to="/dashboard" replace /></SignedIn>
            <SignedOut><LandingPage /></SignedOut>
          </div>
        } />

        {/* Protected App Shell Routes */}
        <Route element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/history" element={<History />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Fallback for Job Matcher/Versions which reuse existing views for now */}
          <Route path="/jobs" element={<Navigate to="/analyzer" replace />} />
          <Route path="/versions" element={<Navigate to="/builder" replace />} />

          {/* Any other unknown protected path falls back to the dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}