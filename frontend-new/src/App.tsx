import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'

function App() {
  const { isLoaded, userId } = useAuth()
  const navigate = useNavigate()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <div className="container mx-auto px-4 py-8">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome to TreeCleaner</h1>
                    <p className="text-gray-600 mb-4">User ID: {userId}</p>
                    <div className="mt-4">
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to TreeCleaner</h1>
                    <p className="text-gray-600 mb-4">Please sign in to continue</p>
                    <SignedIn />
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
      </Routes>
    </div>
  )
}

export default App
