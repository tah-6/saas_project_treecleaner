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
                                <span class="text-sm text-gray-700" id="user-info">Demo Mode - Working!</span>
                                <button 
                                    id="sign-in-btn"
                                    class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                                    style="display: none;"
                                >
                                    Sign In
                                </button>
                                <button 
                                    id="sign-out-btn"
                                    class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                                    style="display: none;"
                                >
                                    Sign Out
                                </button>
                                <button 
                                    id="add-auth-btn"
                                    class="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
                                >
                                    Enable Authentication
                                </button>
                                <button 
                                    id="debug-btn"
                                    class="bg-yellow-600 text-white px-4 py-2 rounded-md text-sm hover:bg-yellow-700"
                                >
                                    Debug Auth
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
            const addAuthBtn = document.getElementById('add-auth-btn');
            const debugBtn = document.getElementById('debug-btn');
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
            
            // Load dashboard immediately
            console.log('Loading dashboard...');
            fetchCosts();
            
            // Clerk integration variables
            let clerk = null;
            let clerkLoaded = false;
            let authEnabled = false;
            
            function updateUserInterface(user) {
                if (user) {
                    const displayName = user.firstName || 
                                      user.lastName || 
                                      (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || 
                                      'User';
                    userInfo.textContent = \`Welcome, \${displayName}\`;
                    signInBtn.style.display = 'none';
                    signOutBtn.style.display = 'block';
                    addAuthBtn.style.display = 'none';
                    debugBtn.style.display = 'block';
                } else {
                    userInfo.textContent = 'Please sign in';
                    signInBtn.style.display = 'block';
                    signOutBtn.style.display = 'none';
                    addAuthBtn.style.display = 'none';
                    debugBtn.style.display = 'none';
                }
            }
            
            function resetToDemo() {
                userInfo.textContent = 'Demo Mode - Working!';
                signInBtn.style.display = 'none';
                signOutBtn.style.display = 'none';
                addAuthBtn.style.display = 'block';
                debugBtn.style.display = 'none';
                authEnabled = false;
            }
            
            function loadClerkScript() {
                return new Promise((resolve, reject) => {
                    // Check if Clerk is already loaded
                    if (window.Clerk) {
                        console.log('Clerk already available');
                        resolve();
                        return;
                    }
                    
                    console.log('Trying multiple Clerk loading strategies...');
                    let resolved = false;
                    let attemptCount = 0;
                    const maxAttempts = 4;
                    
                    const clerkSources = [
                        // Strategy 1: Frontend API domain with clerk.js
                        'https://improved-redbird-85.clerk.accounts.dev/v1/client/clerk.js',
                        // Strategy 2: Frontend API domain with different path
                        'https://improved-redbird-85.clerk.accounts.dev/clerk.js',
                        // Strategy 3: Official unpkg CDN
                        'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js',
                        // Strategy 4: jsDelivr CDN
                        'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
                    ];
                    
                    function tryNextSource() {
                        if (resolved || attemptCount >= maxAttempts) {
                            if (!resolved) {
                                reject(new Error('All Clerk loading strategies failed'));
                            }
                            return;
                        }
                        
                        const currentSource = clerkSources[attemptCount];
                        console.log('Attempt ' + (attemptCount + 1) + ': Loading from ' + currentSource);
                        
                        const script = document.createElement('script');
                        script.src = currentSource;
                        script.async = true;
                        script.crossOrigin = 'anonymous';
                        
                        script.onload = () => {
                            console.log('Script loaded from attempt ' + (attemptCount + 1));
                            setTimeout(() => {
                                if (window.Clerk && !resolved) {
                                    console.log('SUCCESS: Clerk constructor available from attempt ' + (attemptCount + 1));
                                    resolved = true;
                                    resolve();
                                } else if (!resolved) {
                                    console.log('Attempt ' + (attemptCount + 1) + ' failed - Clerk constructor not available');
                                    attemptCount++;
                                    tryNextSource();
                                }
                            }, 300);
                        };
                        
                        script.onerror = (error) => {
                            console.error('Attempt ' + (attemptCount + 1) + ' failed to load:', error);
                            attemptCount++;
                            tryNextSource();
                        };
                        
                        document.head.appendChild(script);
                    }
                    
                    // Start the first attempt
                    tryNextSource();
                    
                    // Overall timeout
                    setTimeout(() => {
                        if (!resolved) {
                            console.error('All Clerk loading attempts timed out');
                            resolved = true;
                            reject(new Error('Clerk script load timeout - all strategies failed'));
                        }
                    }, 20000); // 20 second total timeout
                });
            }
            
            function initializeClerk() {
                return new Promise((resolve, reject) => {
                    try {
                        if (!window.Clerk) {
                            reject(new Error('Clerk constructor not available'));
                            return;
                        }
                        
                        console.log('Creating Clerk instance...');
                        
                        // Use your actual publishable key
                        const publishableKey = 'pk_test_aW1wcm92ZWQtcmVkYmlyZC04NS5jbGVyay5hY2NvdW50cy5kZXYk';
                        console.log('Using publishable key:', publishableKey.substring(0, 20) + '...');
                        
                        clerk = new window.Clerk(publishableKey);
                        
                        console.log('Clerk instance created, loading...');
                        
                        clerk.load({
                            // Add some options for better compatibility
                            appearance: {
                                baseTheme: 'light'
                            }
                        }).then(() => {
                            console.log('Clerk loaded successfully');
                            clerkLoaded = true;
                            
                            // Check if user is already signed in
                            if (clerk.user) {
                                console.log('User is already signed in:', clerk.user.firstName || clerk.user.emailAddresses?.[0]?.emailAddress);
                                updateUserInterface(clerk.user);
                            } else {
                                console.log('User is not signed in');
                                updateUserInterface(null);
                            }
                            
                            // Listen for authentication state changes
                            clerk.addListener('user', (user) => {
                                console.log('User state changed:', user ? 'signed in' : 'signed out');
                                updateUserInterface(user);
                            });
                            
                            resolve(clerk);
                        }).catch(err => {
                            console.error('Clerk load error:', err);
                            clerkLoaded = false;
                            reject(new Error('Clerk load failed: ' + err.message));
                        });
                    } catch (err) {
                        console.error('Clerk initialization error:', err);
                        reject(new Error('Clerk initialization failed: ' + err.message));
                    }
                });
            }
            
            async function enableAuthentication() {
                try {
                    console.log('Starting authentication enablement...');
                    addAuthBtn.textContent = 'Loading...';
                    addAuthBtn.disabled = true;
                    
                    // Step 1: Load Clerk script
                    console.log('Step 1: Loading Clerk script...');
                    await loadClerkScript();
                    console.log('Step 1: Complete');
                    
                    // Step 2: Initialize Clerk
                    console.log('Step 2: Initializing Clerk...');
                    await initializeClerk();
                    console.log('Step 2: Complete');
                    
                    authEnabled = true;
                    console.log('Authentication enabled successfully!');
                    
                } catch (err) {
                    console.error('Failed to enable authentication:', err);
                    
                    // More specific error messages
                    let errorMessage = 'Failed to load authentication system. ';
                    if (err.message.includes('script')) {
                        errorMessage += 'Could not load authentication library from CDN.';
                    } else if (err.message.includes('timeout')) {
                        errorMessage += 'Authentication system took too long to load.';
                    } else if (err.message.includes('constructor')) {
                        errorMessage += 'Authentication library did not initialize properly.';
                    } else {
                        errorMessage += 'Error: ' + err.message;
                    }
                    
                    errorMessage += ' The dashboard will continue to work in demo mode.';
                    
                    alert(errorMessage);
                    resetToDemo();
                    addAuthBtn.textContent = 'Try Authentication Again';
                    addAuthBtn.disabled = false;
                }
            }
            
            // Event listeners
            addAuthBtn.addEventListener('click', () => {
                console.log('Enable authentication clicked');
                enableAuthentication();
            });
            
            signInBtn.addEventListener('click', () => {
                console.log('Sign in clicked');
                if (clerk && clerkLoaded) {
                    clerk.redirectToSignIn();
                } else {
                    alert('Authentication system is not ready. Please try again.');
                }
            });
            
            signOutBtn.addEventListener('click', () => {
                console.log('Sign out clicked');
                if (clerk && clerkLoaded) {
                    signOutBtn.textContent = 'Signing out...';
                    signOutBtn.disabled = true;
                    
                    clerk.signOut().then(() => {
                        console.log('Successfully signed out');
                        updateUserInterface(null);
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
            
            debugBtn.addEventListener('click', () => {
                console.log('Debug button clicked');
                
                let debugInfo = 'Debug Information:\\n\\n';
                debugInfo += 'Window.Clerk available: ' + (!!window.Clerk) + '\\n';
                debugInfo += 'Clerk instance created: ' + (!!clerk) + '\\n';
                debugInfo += 'Clerk loaded: ' + clerkLoaded + '\\n';
                debugInfo += 'Auth enabled: ' + authEnabled + '\\n';
                debugInfo += 'Current URL: ' + window.location.href + '\\n';
                debugInfo += 'User agent: ' + navigator.userAgent + '\\n';
                
                if (clerk) {
                    debugInfo += 'Clerk user: ' + (clerk.user ? 'Yes' : 'No') + '\\n';
                    if (clerk.user) {
                        debugInfo += 'User ID: ' + clerk.user.id + '\\n';
                        debugInfo += 'User email: ' + (clerk.user.emailAddresses && clerk.user.emailAddresses[0] ? clerk.user.emailAddresses[0].emailAddress : 'N/A') + '\\n';
                    }
                }
                
                // Test network connectivity
                debugInfo += '\\nTesting network connectivity...\\n';
                
                console.log(debugInfo);
                alert(debugInfo);
                
                // Test all Clerk sources
                const testSources = [
                    'https://improved-redbird-85.clerk.accounts.dev/v1/client/clerk.js',
                    'https://improved-redbird-85.clerk.accounts.dev/clerk.js',
                    'https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js',
                    'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
                ];
                
                let testResults = 'Testing Clerk sources:\\n';
                let testsCompleted = 0;
                
                testSources.forEach((source, index) => {
                    fetch(source, { method: 'HEAD' })
                        .then(response => {
                            const result = 'Source ' + (index + 1) + ': ' + (response.status === 200 ? 'SUCCESS' : 'FAILED (' + response.status + ')');
                            testResults += result + '\\n';
                            console.log(result);
                            testsCompleted++;
                            
                            if (testsCompleted === testSources.length) {
                                alert(testResults);
                            }
                        })
                        .catch(err => {
                            const result = 'Source ' + (index + 1) + ': FAILED - ' + err.message;
                            testResults += result + '\\n';
                            console.log(result);
                            testsCompleted++;
                            
                            if (testsCompleted === testSources.length) {
                                alert(testResults);
                            }
                        });
                });
            });
            
            console.log('Dashboard script loaded - Clerk integration ready!');
        </script>
    </body>
    </html>
  `);
});

// Export for Vercel
module.exports = app; 