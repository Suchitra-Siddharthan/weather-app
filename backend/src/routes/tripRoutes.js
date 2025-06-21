const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tripController = require('../controllers/tripController');

// All routes are protected
router.use(auth);

// Create a new trip
router.post('/', tripController.createTrip);

// Get all trips for the current user
router.get('/', tripController.getTrips);

// Get a single trip
router.get('/:id', tripController.getTrip);

// Update a trip
router.put('/:id', tripController.updateTrip);

// Delete a trip
router.delete('/:id', tripController.deleteTrip);

module.exports = router; 