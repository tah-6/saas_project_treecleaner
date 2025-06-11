import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <div className="container mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold">Welcome to TreeCleaner</h1>
                </div>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App 