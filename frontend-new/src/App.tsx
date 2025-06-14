import { SignedIn, SignedOut, useAuth, SignIn, SignUp } from '@clerk/clerk-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SignedIn>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
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
                      <p className="text-gray-600 mb-8">Please sign in or create an account to continue.</p>
                      <div className="flex justify-center space-x-4">
                        <SignIn routing="path" path="/sign-in" />
                        <SignUp routing="path" path="/sign-up" />
                      </div>
                    </div>
                  </div>
                </SignedOut>
              </>
            }
          />
          <Route
            path="/sign-in/*"
            element={
              <SignedOut>
                <div className="flex items-center justify-center min-h-screen">
                  <SignIn routing="path" path="/sign-in" />
                </div>
              </SignedOut>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <SignedOut>
                <div className="flex items-center justify-center min-h-screen">
                  <SignUp routing="path" path="/sign-up" />
                </div>
              </SignedOut>
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
  )
}

export default App
