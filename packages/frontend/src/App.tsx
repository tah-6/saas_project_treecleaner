import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react'

function App() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
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
                  <h1 className="text-3xl font-bold mb-4">Welcome to TreeCleaner</h1>
                  <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">You are signed in as user: {userId}</p>
                    <div className="mt-4">
                      <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Welcome to TreeCleaner</h1>
                    <p className="text-gray-600 mb-4">Please sign in to continue</p>
                    <RedirectToSignIn />
                  </div>
                </div>
              </SignedOut>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App 