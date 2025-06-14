// Mock data for testing
const mockCosts = [
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

exports.getAllCosts = async (req, res) => {
  try {
    res.json(mockCosts);
  } catch (error) {
    console.error('Error fetching costs:', error);
    res.status(500).json({ error: 'Failed to fetch costs' });
  }
};

exports.getCostById = async (req, res) => {
  try {
    const cost = mockCosts.find(c => c.id === req.params.id);
    if (!cost) {
      return res.status(404).json({ error: 'Cost not found' });
    }
    res.json(cost);
  } catch (error) {
    console.error('Error fetching cost:', error);
    res.status(500).json({ error: 'Failed to fetch cost' });
  }
};

exports.createCost = async (req, res) => {
  try {
    const newCost = {
      id: String(mockCosts.length + 1),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockCosts.push(newCost);
    res.status(201).json(newCost);
  } catch (error) {
    console.error('Error creating cost:', error);
    res.status(500).json({ error: 'Failed to create cost' });
  }
};

exports.updateCost = async (req, res) => {
  try {
    const index = mockCosts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cost not found' });
    }

    const updatedCost = {
      ...mockCosts[index],
      ...req.body,
      updatedAt: new Date()
    };
    mockCosts[index] = updatedCost;
    
    res.json(updatedCost);
  } catch (error) {
    console.error('Error updating cost:', error);
    res.status(500).json({ error: 'Failed to update cost' });
  }
};

exports.deleteCost = async (req, res) => {
  try {
    const index = mockCosts.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Cost not found' });
    }

    mockCosts.splice(index, 1);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting cost:', error);
    res.status(500).json({ error: 'Failed to delete cost' });
  }
}; 