const Subscription = require('../models/Subscription');

exports.getAllSubscriptions = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID' });
    }

    const subscriptions = await Subscription.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const subscription = await Subscription.findOne({
      where: { id: req.params.id, userId }
    });

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
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID' });
    }

    const newSubscription = await Subscription.create({
      ...req.body,
      userId // Enforce userId from header/auth
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const subscription = await Subscription.findOne({
      where: { id: req.params.id, userId }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found or unauthorized' });
    }

    const updatedSubscription = await subscription.update(req.body);
    res.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const subscription = await Subscription.findOne({
      where: { id: req.params.id, userId }
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found or unauthorized' });
    }

    await subscription.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ error: 'Failed to delete subscription' });
  }
}; 