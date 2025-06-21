const User = require('../models/User');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total destinations count
    const totalDestinations = await Destination.countDocuments();
    
    // Get recent destinations (last 5)
    const recentDestinations = await Destination.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name country weather');

    res.json({
      totalUsers,
      totalDestinations,
      recentDestinations
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers
}; 