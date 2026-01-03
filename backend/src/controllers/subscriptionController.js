// Mock data for testing
const mockSubscriptions = [
  {
    id: '1',
    serviceName: 'AWS Cloud Services',
    amount: 150.00,
    category: 'CLOUD',
    billingDate: new Date('2024-03-01'),
    billingFrequency: 'MONTHLY',
    userId: '1',
    metadata: { region: 'us-east-1' },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: '2',
    serviceName: 'GitHub Team',
    amount: 44.00,
    category: 'SAAS',
    billingDate: new Date('2024-03-01'),
    billingFrequency: 'MONTHLY',
    userId: '1',
    metadata: { seats: 5 },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

exports.getAllSubscriptions = async (req, res) => {
  try {
    res.json(mockSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = mockSubscriptions.find(s => s.id === req.params.id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const newSubscription = {
      id: String(mockSubscriptions.length + 1),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockSubscriptions.push(newSubscription);
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const index = mockSubscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const updatedSubscription = {
      ...mockSubscriptions[index],
      ...req.body,
      updatedAt: new Date()
    };
    mockSubscriptions[index] = updatedSubscription;
    
    res.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const index = mockSubscriptions.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    mockSubscriptions.splice(index, 1);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
}; 