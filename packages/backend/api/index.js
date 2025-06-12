const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (we'll add the built frontend here)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from Vercel serverless function!' });
});

// Mock costs data for now (you can connect to your real database later)
app.get('/api/costs', (req, res) => {
  const mockCosts = [
    {
      id: 1,
      service_name: 'AWS EC2',
      amount: 150.00,
      category: 'Cloud',
      billing_date: '2024-01-15',
      metadata: {}
    },
    {
      id: 2,
      service_name: 'GitHub Pro',
      amount: 4.00,
      category: 'Software',
      billing_date: '2024-01-01',
      metadata: {}
    },
    {
      id: 3,
      service_name: 'Vercel Pro',
      amount: 20.00,
      category: 'Cloud',
      billing_date: '2024-01-01',
      metadata: {}
    }
  ];
  res.json(mockCosts);
});

// Serve the React app for all non-API routes
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cost Management Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        </style>
    </head>
    <body class="bg-gray-100">
        <div id="root">
            <div class="min-h-screen bg-gray-100">
                <!-- Header -->
                <div class="bg-white shadow-sm border-b">
                    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div class="flex justify-between items-center py-4">
                            <h1 class="text-2xl font-bold text-gray-900">Cost Management Dashboard</h1>
                            <div class="flex items-center space-x-4">
                                <span class="text-sm text-gray-700" id="user-info">Demo Mode</span>
                                <button 
                                    id="sign-in-btn"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                >
                                    Sign In with Clerk
                                </button>
                                <button 
                                    id="sign-out-btn"
                                    class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                                    style="display: none;"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Content -->
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <!-- Loading State -->
                    <div id="loading" class="flex items-center justify-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        <span class="ml-3 text-gray-600">Loading dashboard...</span>
                    </div>

                    <!-- Error State -->
                    <div id="error" class="hidden bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div class="text-red-800" id="error-message"></div>
                    </div>

                    <!-- Chart Section -->
                    <div id="chart-section" class="hidden bg-white rounded-lg shadow-lg p-6 mb-8">
                        <h2 class="text-xl font-semibold mb-4">Costs by Category</h2>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <h3 class="font-medium text-blue-900">Cloud Services</h3>
                                <p class="text-2xl font-bold text-blue-600" id="cloud-total">$0</p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <h3 class="font-medium text-green-900">Software</h3>
                                <p class="text-2xl font-bold text-green-600" id="software-total">$0</p>
                            </div>
                            <div class="bg-purple-50 p-4 rounded-lg">
                                <h3 class="font-medium text-purple-900">Total</h3>
                                <p class="text-2xl font-bold text-purple-600" id="total-cost">$0</p>
                            </div>
                        </div>
                    </div>

                    <!-- Table Section -->
                    <div id="table-section" class="hidden bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-xl font-semibold mb-4">Cost Details</h2>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody id="costs-table-body" class="bg-white divide-y divide-gray-200">
                                    <!-- Data will be inserted here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            console.log('Dashboard script starting...');
            
            // DOM elements
            const loading = document.getElementById('loading');
            const error = document.getElementById('error');
            const errorMessage = document.getElementById('error-message');
            const chartSection = document.getElementById('chart-section');
            const tableSection = document.getElementById('table-section');
            const userInfo = document.getElementById('user-info');
            const signInBtn = document.getElementById('sign-in-btn');
            const signOutBtn = document.getElementById('sign-out-btn');
            const costsTableBody = document.getElementById('costs-table-body');
            
            function showError(message) {
                console.error('Error:', message);
                loading.classList.add('hidden');
                error.classList.remove('hidden');
                errorMessage.textContent = message;
            }
            
            function showDashboard() {
                loading.classList.add('hidden');
                error.classList.add('hidden');
                chartSection.classList.remove('hidden');
                tableSection.classList.remove('hidden');
            }
            
            async function fetchCosts() {
                try {
                    console.log('Fetching costs...');
                    const response = await fetch('/api/costs');
                    if (!response.ok) {
                        throw new Error('Failed to fetch costs');
                    }
                    const costs = await response.json();
                    console.log('Costs fetched:', costs);
                    
                    // Calculate totals
                    let cloudTotal = 0;
                    let softwareTotal = 0;
                    let totalCost = 0;
                    
                    costs.forEach(cost => {
                        totalCost += cost.amount;
                        if (cost.category.toLowerCase() === 'cloud') {
                            cloudTotal += cost.amount;
                        } else if (cost.category.toLowerCase() === 'software') {
                            softwareTotal += cost.amount;
                        }
                    });
                    
                    // Update totals
                    document.getElementById('cloud-total').textContent = '$' + cloudTotal.toFixed(2);
                    document.getElementById('software-total').textContent = '$' + softwareTotal.toFixed(2);
                    document.getElementById('total-cost').textContent = '$' + totalCost.toFixed(2);
                    
                    // Populate table
                    costsTableBody.innerHTML = costs.map(cost => \`
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">\${cost.service_name}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${cost.category}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$\${cost.amount.toFixed(2)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">\${new Date(cost.billing_date).toLocaleDateString()}</td>
                        </tr>
                    \`).join('');
                    
                    showDashboard();
                } catch (err) {
                    showError('Failed to load cost data: ' + err.message);
                }
            }
            
            // Initialize Clerk (optional)
            let clerk = null;
            let clerkLoaded = false;
            
            function initializeClerk() {
                if (window.Clerk) {
                    console.log('Initializing Clerk...');
                    clerk = new window.Clerk('pk_test_aW1wcm92ZWQtcmVkYmlyZC04NS5jbGVyay5hY2NvdW50cy5kZXYk');
                    
                    clerk.load().then(() => {
                        console.log('Clerk loaded successfully');
                        clerkLoaded = true;
                        
                        if (clerk.user) {
                            console.log('User is signed in:', clerk.user);
                            updateUserInterface(clerk.user);
                        } else {
                            console.log('User is not signed in');
                        }
                        
                        // Listen for authentication state changes
                        clerk.addListener('user', (user) => {
                            console.log('User state changed:', user);
                            if (user) {
                                updateUserInterface(user);
                            } else {
                                resetUserInterface();
                            }
                        });
                        
                    }).catch(err => {
                        console.log('Clerk load error:', err);
                        clerkLoaded = false;
                    });
                } else {
                    console.log('Clerk not available');
                }
            }
            
            function updateUserInterface(user) {
                const displayName = user.firstName || 
                                  user.lastName || 
                                  (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || 
                                  'User';
                userInfo.textContent = `Welcome, ${displayName}`;
                signInBtn.style.display = 'none';
                signOutBtn.style.display = 'block';
            }
            
            function resetUserInterface() {
                userInfo.textContent = 'Demo Mode';
                signInBtn.style.display = 'block';
                signOutBtn.style.display = 'none';
            }
            
            // Load dashboard immediately (don't wait for auth)
            console.log('Loading dashboard...');
            fetchCosts();
            
            // Try to load Clerk
            console.log('Loading Clerk authentication...');
            const clerkScript = document.createElement('script');
            clerkScript.src = 'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js';
            clerkScript.onload = () => {
                console.log('Clerk script loaded');
                initializeClerk();
            };
            clerkScript.onerror = () => {
                console.log('Clerk failed to load');
                clerkLoaded = false;
            };
            document.head.appendChild(clerkScript);
            
            // Event listeners
            signInBtn.addEventListener('click', () => {
                console.log('Sign in button clicked');
                
                if (!clerkLoaded) {
                    // Show loading state
                    signInBtn.textContent = 'Loading...';
                    signInBtn.disabled = true;
                    
                    // Wait a bit for Clerk to load, then try again
                    setTimeout(() => {
                        if (clerk && clerkLoaded) {
                            console.log('Clerk now available, redirecting to sign in');
                            clerk.redirectToSignIn();
                        } else {
                            alert('Authentication system is still loading. Please wait a moment and try again.');
                            signInBtn.textContent = 'Sign In with Clerk';
                            signInBtn.disabled = false;
                        }
                    }, 2000);
                } else if (clerk) {
                    console.log('Redirecting to Clerk sign in');
                    clerk.redirectToSignIn();
                } else {
                    alert('Authentication system is not available. Please refresh the page and try again.');
                }
            });
            
            signOutBtn.addEventListener('click', () => {
                console.log('Sign out button clicked');
                if (clerk && clerkLoaded) {
                    signOutBtn.textContent = 'Signing out...';
                    signOutBtn.disabled = true;
                    
                    clerk.signOut().then(() => {
                        console.log('Successfully signed out');
                        resetUserInterface();
                        signOutBtn.textContent = 'Sign Out';
                        signOutBtn.disabled = false;
                    }).catch(err => {
                        console.error('Sign out error:', err);
                        signOutBtn.textContent = 'Sign Out';
                        signOutBtn.disabled = false;
                    });
                } else {
                    console.log('Clerk not available for sign out');
                }
            });
            
            console.log('Dashboard script loaded');
        </script>
    </body>
    </html>
  `);
});

// Export for Vercel
module.exports = app; 