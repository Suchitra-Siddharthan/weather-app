const Trip = require('../models/Trip');

const tripController = {
  // Create a new trip
  createTrip: async (req, res) => {
    try {
      console.log('Request body:', JSON.stringify(req.body, null, 2));
      console.log('User:', req.user);
      
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const { destination, startDate, endDate, todos } = req.body;
      
      // Validate required fields
      if (!destination) {
        return res.status(400).json({ message: 'Destination is required' });
      }
      if (!startDate) {
        return res.status(400).json({ message: 'Start date is required' });
      }
      if (!endDate) {
        return res.status(400).json({ message: 'End date is required' });
      }

      // Create the trip object
      const tripData = {
        user: req.user._id,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        todos: Array.isArray(todos) ? todos : []
      };

      console.log('Creating trip with data:', JSON.stringify(tripData, null, 2));

      // Create and save the trip
      const trip = new Trip(tripData);
      const savedTrip = await trip.save();
      
      console.log('Trip saved successfully:', savedTrip);
      
      // Populate the destination details in the response
      const populatedTrip = await Trip.findById(savedTrip._id)
        .populate('destination', 'name description country weatherData')
        .populate('user', 'name email');
      
      console.log('Populated trip:', populatedTrip);
      
      res.status(201).json(populatedTrip);
    } catch (error) {
      console.error('Error creating trip:', error);
      
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({ 
          message: 'Validation error',
          errors: errors
        });
      }
      
      res.status(400).json({ 
        message: error.message || 'Failed to create trip'
      });
    }
  },

  // Get all trips for the current user
  getTrips: async (req, res) => {
    try {
      console.log('Getting trips for user:', req.user._id);
      
      if (!req.user || !req.user._id) {
        console.log('No user found in request');
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // First, check if any trips exist for this user
      const tripCount = await Trip.countDocuments({ user: req.user._id });
      console.log(`Found ${tripCount} trips for user ${req.user._id}`);

      const trips = await Trip.find({ user: req.user._id })
        .populate('destination', 'name description country weatherData')
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
      
      console.log('Found trips:', JSON.stringify(trips, null, 2));
      res.json(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      res.status(500).json({ message: 'Error fetching trips' });
    }
  },

  // Get a single trip
  getTrip: async (req, res) => {
    try {
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('destination', 'name description country weatherData');

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a trip
  updateTrip: async (req, res) => {
    try {
      const { startDate, endDate, todos } = req.body;
      
      const trip = await Trip.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      if (startDate) trip.startDate = startDate;
      if (endDate) trip.endDate = endDate;
      if (todos) trip.todos = todos;

      await trip.save();
      res.json(trip);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a trip
  deleteTrip: async (req, res) => {
    try {
      const trip = await Trip.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' });
      }

      res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = tripController; 