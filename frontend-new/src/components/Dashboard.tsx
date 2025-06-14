// Dashboard component with cost visualization using Recharts
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

interface Cost {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface CategoryTotal {
  category: string;
  total: number;
}

// Mock data for development
const mockCosts: Cost[] = [
  { id: '1', amount: 150.00, category: 'Infrastructure', description: 'AWS EC2 Instance', date: '2024-03-01' },
  { id: '2', amount: 75.50, category: 'Storage', description: 'S3 Storage', date: '2024-03-02' },
  { id: '3', amount: 200.00, category: 'Infrastructure', description: 'Load Balancer', date: '2024-03-03' },
  { id: '4', amount: 45.00, category: 'Database', description: 'RDS Instance', date: '2024-03-04' },
  { id: '5', amount: 30.00, category: 'Storage', description: 'Backup Storage', date: '2024-03-05' },
];

function Dashboard() {
  const [costs, setCosts] = useState<Cost[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/costs');
        if (!response.ok) {
          throw new Error('Failed to fetch costs');
        }
        const data = await response.json();
        setCosts(data);
      } catch (err) {
        console.warn('Using mock data due to API error:', err);
        // Fallback to mock data if API fails
        setCosts(mockCosts);
      } finally {
        // Calculate category totals
        const totals = costs.reduce((acc: { [key: string]: number }, cost: Cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + cost.amount;
          return acc;
        }, {});

        // Convert to array format for Recharts
        const categoryData = (Object.entries(totals) as [string, number][]).map(([category, total]) => ({
          category,
          total: Number(total.toFixed(2))
        }));

        setCategoryTotals(categoryData);
        setLoading(false);
      }
    };

    fetchCosts();
  }, [costs]);

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
      <h1 className="text-2xl font-bold mb-6">Cost Analysis Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Costs by Category</h2>
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
        <h2 className="text-xl font-semibold mb-4">Recent Costs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costs.slice(0, 5).map((cost) => (
                <tr key={cost.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cost.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cost.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${cost.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(cost.date).toLocaleDateString()}
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