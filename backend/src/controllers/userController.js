// Mock data for testing
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
];

exports.getAllUsers = async (req, res) => {
  try {
    res.json(mockUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = {
      id: String(mockUsers.length + 1),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockUsers.push(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const index = mockUsers.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
      ...mockUsers[index],
      ...req.body,
      updatedAt: new Date()
    };
    mockUsers[index] = updatedUser;
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const index = mockUsers.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    mockUsers.splice(index, 1);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}; 