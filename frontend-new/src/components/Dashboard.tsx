// Dashboard component with subscription visualization using Recharts
import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  CreditCard,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Calendar,
  Activity,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';

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
  { id: '6', amount: 12.99, category: 'ENTERTAINMENT', serviceName: 'Netflix', billingDate: '2024-03-10', billingFrequency: 'MONTHLY' },
  { id: '7', amount: 14.99, category: 'ENTERTAINMENT', serviceName: 'Spotify', billingDate: '2024-03-12', billingFrequency: 'MONTHLY' },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/subscriptions');
        if (!response.ok) {
          throw new Error('Failed to fetch subscriptions');
        }
        const data = await response.json();
        setSubscriptions(data);
        setIsDemoMode(false);
      } catch (err) {
        console.warn('API Error, falling back to mock data:', err);
        setSubscriptions(mockSubscriptions);
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Calculate totals
  useEffect(() => {
    const totals = subscriptions.reduce((acc: { [key: string]: number }, sub: Subscription) => {
      acc[sub.category] = (acc[sub.category] || 0) + sub.amount;
      return acc;
    }, {});

    const categoryData = (Object.entries(totals) as [string, number][]).map(([category, total]) => ({
      category,
      total: Number(total.toFixed(2))
    }));

    setCategoryTotals(categoryData);
  }, [subscriptions]);

  const totalMonthlyCost = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
  const highestCategory = categoryTotals.length > 0
    ? categoryTotals.reduce((max, current) => current.total > max.total ? current : max)
    : { category: 'N/A', total: 0 };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans text-slate-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Subscription Analysis</h1>
          <p className="text-slate-500 mt-1">Manage and track your recurring expenses</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md transition-all flex items-center gap-2">
          <Plus size={18} />
          Add Subscription
        </button>
      </div>

      {isDemoMode && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r shadow-sm flex items-start gap-3">
          <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-amber-800 font-semibold text-sm">Demo Mode Active</h3>
            <p className="text-amber-700 text-sm mt-1">Unable to connect to the backend API. Showing mock data for demonstration purposes.</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Monthly Cost</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">${totalMonthlyCost.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Subscriptions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{subscriptions.length}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full text-emerald-600">
            <Activity size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Highest Category</p>
            <p className="text-3xl font-bold text-slate-900 mt-2 capitalize">{highestCategory.category.toLowerCase()}</p>
            <p className="text-xs text-slate-400 font-medium">Coming in at ${highestCategory.total.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-rose-50 rounded-full text-rose-600">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CreditCard size={20} className="text-indigo-500" />
            Cost Distribution
          </h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryTotals} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {categoryTotals.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar size={20} className="text-indigo-500" />
              Active Subscriptions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 rounded-tl-lg">Service</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Frequency</th>
                  <th className="px-6 py-4">Next Bill</th>
                  <th className="px-6 py-4 text-right rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-700">{sub.serviceName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 uppercase tracking-wide">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">${sub.amount.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm capitalize">
                      {sub.billingFrequency.toLowerCase()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(sub.billingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-slate-400 hover:text-rose-600 transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {subscriptions.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              <p>No active subscriptions found.</p>
              <button className="mt-4 text-indigo-600 font-medium hover:underline text-sm">Add your first subscription</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 