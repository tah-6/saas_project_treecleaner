import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  Edit2,
  X
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
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<CategoryTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'SAAS',
    amount: '',
    billingFrequency: 'MONTHLY',
    billingDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return; // Wait for user to be loaded

      try {
        let apiUrl = import.meta.env.VITE_API_URL || '';
        if (apiUrl.endsWith('/')) {
          apiUrl = apiUrl.slice(0, -1);
        }

        console.log('Fetching subscriptions from:', `${apiUrl}/api/subscriptions`);
        console.log('User ID:', user.id);

        const response = await fetch(`${apiUrl}/api/subscriptions`, {
          headers: {
            'x-user-id': user.id
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); // Get raw text in case JSON fails
          throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
        }
        const data = await response.json();
        setSubscriptions(data);
        setIsDemoMode(false);
        setErrorDetails(null);
      } catch (err: any) {
        console.warn('API Error, falling back to mock data:', err);
        setSubscriptions(mockSubscriptions);
        setIsDemoMode(true);
        setErrorDetails(err.message || 'Unknown network error');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscriptions();
    }
  }, [user]);

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

  // Form Handlers
  const resetForm = () => {
    setFormData({
      serviceName: '',
      category: 'SAAS',
      amount: '',
      billingFrequency: 'MONTHLY',
      billingDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (sub: Subscription) => {
    setFormData({
      serviceName: sub.serviceName,
      category: sub.category,
      amount: sub.amount.toString(),
      billingFrequency: sub.billingFrequency,
      billingDate: sub.billingDate.split('T')[0]
    });
    setEditingId(sub.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    if (!user) return;

    try {
      if (isDemoMode) {
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      } else {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        await fetch(`${apiUrl}/api/subscriptions/${id}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user.id
          }
        });
        setSubscriptions(prev => prev.filter(sub => sub.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete subscription:', err);
      // Fallback for demo mode if API fails
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        userId: user.id
      };

      if (isDemoMode) {
        // Mock behavior for demo mode
        if (editingId) {
          setSubscriptions(prev => prev.map(sub =>
            sub.id === editingId ? { ...sub, ...payload, id: editingId } : sub
          ));
        } else {
          const newSub = {
            ...payload,
            id: Math.random().toString(36).substr(2, 9)
          } as Subscription;
          setSubscriptions(prev => [...prev, newSub]);
        }
        resetForm();
      } else {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const url = editingId ? `${apiUrl}/api/subscriptions/${editingId}` : `${apiUrl}/api/subscriptions`;
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save subscription');

        const savedSub = await response.json();

        if (editingId) {
          setSubscriptions(prev => prev.map(sub => sub.id === editingId ? savedSub : sub));
        } else {
          setSubscriptions(prev => [...prev, savedSub]);
        }
        resetForm();
      }
    } catch (err) {
      console.error('Failed to save subscription:', err);
      alert('Failed to save subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Add Subscription
        </button>
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-amber-500 shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-amber-800">Demo Mode Active</h3>
                <p className="text-amber-700 text-sm mt-1">
                  Unable to connect to the backend API. Showing mock data for demonstration purposes.
                  <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                    <DollarSign size={24} />
                  </div>
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
                              <button
                                onClick={() => handleEdit(sub)}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id)}
                                className="text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete"
                              >
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
            {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">
                  {editingId ? 'Edit Subscription' : 'Add New Subscription'}
                </h3>
                <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. Netflix, AWS, Spotify"
                    value={formData.serviceName}
                    onChange={e => setFormData({ ...formData, serviceName: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="SAAS">SaaS</option>
                      <option value="CLOUD">Cloud</option>
                      <option value="ENTERTAINMENT">Entertainment</option>
                      <option value="DATABASE">Database</option>
                      <option value="UTILITY">Utility</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Billing Frequency</label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      value={formData.billingFrequency}
                      onChange={e => setFormData({ ...formData, billingFrequency: e.target.value })}
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="WEEKLY">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Next Billing Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      value={formData.billingDate}
                      onChange={e => setFormData({ ...formData, billingDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (editingId ? 'Update' : 'Add Subscription')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      );
}

      export default Dashboard; 