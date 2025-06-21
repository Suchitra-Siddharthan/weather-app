const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');
const {
  getDestinations,
  addDestination,
  getWeather,
  deleteDestination,
  getExampleCities
} = destinationController;
const weatherService = require('../services/weatherService');

// Test weather API endpoint (public)
router.get('/test-weather', async (req, res) => {
  try {
    console.log('Testing weather API endpoint...');
    const coordinates = [51.5074, -0.1278]; // London coordinates
    console.log('Using coordinates:', coordinates);
    console.log('API Key:', process.env.OPENWEATHER_API_KEY);
    
    const weatherData = await weatherService.getCurrentWeather(coordinates);
    console.log('Weather data received:', weatherData);
    res.json(weatherData);
  } catch (error) {
    console.error('Weather API test error:', error);
    res.status(500).json({ 
      message: 'Error testing weather API', 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Public routes
router.get('/', getDestinations);
router.get('/:id/weather', getWeather);
router.get('/example-cities', getExampleCities);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Destination routes are working!' });
});

// Protected routes (add authentication middleware as needed)
router.post('/', addDestination);
router.delete('/:id', deleteDestination);

module.exports = router; 