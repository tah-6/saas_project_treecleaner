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
  // For now, serve a simple HTML page with your dashboard
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cost Management Dashboard</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://unpkg.com/recharts@2.8.0/umd/Recharts.js"></script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="https://unpkg.com/@clerk/clerk-js@latest/dist/clerk.browser.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
        <div id="root"></div>
        
        <script type="text/babel">
            const { useState, useEffect } = React;
            const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

            // Initialize Clerk
            const clerk = new window.Clerk('pk_test_aW1wcm92ZWQtcmVkYmlyZC04NS5jbGVyay5hY2NvdW50cy5kZXYk');
            
            function Dashboard() {
                const [costs, setCosts] = useState([]);
                const [loading, setLoading] = useState(true);
                const [error, setError] = useState(null);
                const [user, setUser] = useState(null);

                useEffect(() => {
                    clerk.load().then(() => {
                        if (clerk.user) {
                            setUser(clerk.user);
                            fetchCosts();
                        } else {
                            clerk.redirectToSignIn();
                        }
                    });
                }, []);

                const fetchCosts = async () => {
                    try {
                        const response = await axios.get('/api/costs');
                        setCosts(response.data);
                        setLoading(false);
                    } catch (err) {
                        setError('Failed to fetch cost data');
                        setLoading(false);
                    }
                };

                const handleSignOut = () => {
                    clerk.signOut();
                };

                const categoryTotals = costs.reduce((acc, cost) => {
                    const existingCategory = acc.find(item => item.category === cost.category);
                    if (existingCategory) {
                        existingCategory.total += cost.amount;
                    } else {
                        acc.push({ category: cost.category, total: cost.amount });
                    }
                    return acc;
                }, []);

                if (loading) {
                    return (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    );
                }

                if (error) {
                    return (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="text-red-500">{error}</div>
                        </div>
                    );
                }

                return (
                    <div className="min-h-screen bg-gray-100">
                        {/* Header */}
                        <div className="bg-white shadow-sm border-b">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between items-center py-4">
                                    <h1 className="text-2xl font-bold text-gray-900">Cost Management Dashboard</h1>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-700">Welcome, {user?.firstName || 'User'}</span>
                                        <button 
                                            onClick={handleSignOut}
                                            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                                <h2 className="text-xl font-semibold mb-4">Costs by Category</h2>
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryTotals}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="category" />
                                            <YAxis />
                                            <Tooltip formatter={(value) => [\`$\${value.toFixed(2)}\`, 'Total']} />
                                            <Legend />
                                            <Bar dataKey="total" fill="#3B82F6" name="Total Cost" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold mb-4">Cost Details</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {costs.map((cost) => (
                                                <tr key={cost.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cost.service_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cost.category}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$\{cost.amount.toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cost.billing_date).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }

            // Render the app
            ReactDOM.render(<Dashboard />, document.getElementById('root'));
        </script>
    </body>
    </html>
  `);
});

// Export for Vercel
module.exports = app; 