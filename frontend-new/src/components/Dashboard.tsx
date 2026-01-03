// Dashboard component with subscription visualization using Recharts
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface Subscription {
  id: string;
  amount: number;
  category: string;
  serviceName: string;
  billingDate: string;
  billingFrequency: string;
}

interface CategoryTotal {
  category: string;
  total: number;
}

// Mock data for development
const mockSubscriptions: Subscription[] = [
  { id: '1', amount: 150.00, category: 'CLOUD', serviceName: 'AWS Cloud Services', billingDate: '2024-03-01', billingFrequency: 'MONTHLY' },
  { id: '2', amount: 44.00, category: 'SAAS', serviceName: 'GitHub Team', billingDate: '2024-03-01', billingFrequency: 'MONTHLY' },
  { id: '3', amount: 200.00, category: 'CLOUD', serviceName: 'Google Cloud Platform', billingDate: '2024-03-03', billingFrequency: 'MONTHLY' },
  { id: '4', amount: 45.00, category: 'DATABASE', serviceName: 'MongoDB Atlas', billingDate: '2024-03-04', billingFrequency: 'MONTHLY' },
  { id: '5', amount: 29.00, category: 'SAAS', serviceName: 'Adobe Creative Cloud', billingDate: '2024-03-05', billingFrequency: 'MONTHLY' },
];

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/subscriptions');
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        const data = await response.json();
        setSubscriptions(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.warn('Using mock data due to API error:', err);
        setError('Failed to fetch subscriptions from API. Using mock data instead.');
        // Fallback to mock data if API fails
        setSubscriptions(mockSubscriptions);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []); // Fixed infinite loop by removing subscriptions dependency

  // Calculate totals whenever subscriptions change
  useEffect(() => {
    const totals = subscriptions.reduce((acc: { [key: string]: number }, sub: Subscription) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
      return acc;
    }, {});

    // Convert to array format for Recharts
    const categoryData = (Object.entries(totals) as [string, number][]).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2))
    }));

    setCategoryTotals(categoryData);
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-500 text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-600">Using mock data for demonstration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Subscription Analysis Dashboard</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cost by Category</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryTotals}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
              />
              <Legend />
              <Bar
                dataKey="total"
                fill="#3B82F6"
                name="Total Cost"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Active Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billing Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((sub) => (
                <tr key={sub.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sub.serviceName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sub.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${sub.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sub.billingFrequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(sub.billingDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 