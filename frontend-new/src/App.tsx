// Updated Clerk implementation with proper provider structure
import { SignedIn, SignedOut, useAuth, SignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';

function InnerApp() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F9F0]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-[#F9F9F0]">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
                <SignedOut>
                  <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <Hero />
                    <Features />
                    {/* Compact Footer */}
                    <footer className="py-8 bg-white border-t border-slate-100 text-center">
                      <p className="text-slate-500 text-sm">© {new Date().getFullYear()} TreeCleaner. All rights reserved.</p>
                    </footer>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route
            path="/sign-in"
            element={
              <div className="flex items-center justify-center min-h-screen bg-[#F9F9F0]">
                <SignIn routing="path" path="/sign-in" />
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" replace />
                </SignedOut>
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return <InnerApp />;
}

export default App;
