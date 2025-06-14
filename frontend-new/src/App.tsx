// Updated Clerk implementation with proper provider structure
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';

function InnerApp() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to TreeCleaner</h1>
                    <p className="mb-4">User ID: {userId}</p>
                    <button
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Welcome to TreeCleaner</h1>
                      <p className="text-gray-600 mb-8">Please sign in to continue</p>
                      <div className="flex justify-center">
                        <a
                          href="/sign-in"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Sign In
                        </a>
                      </div>
                    </div>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
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
