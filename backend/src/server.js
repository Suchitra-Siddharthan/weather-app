const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const tripRoutes = require('./routes/tripRoutes');
const adminRoutes = require('./routes/adminRoutes');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Enhanced request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Test weather API endpoint
app.get('/api/weather-test', async (req, res) => {
  try {
    const lat = 51.5074;
    const lon = -0.1278;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Get current weather
    const currentWeather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    // Get 5-day forecast
    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );

    res.json({
      current: {
        temperature: currentWeather.data.main.temp,
        feelsLike: currentWeather.data.main.feels_like,
        humidity: currentWeather.data.main.humidity,
        windSpeed: currentWeather.data.wind.speed,
        description: currentWeather.data.weather[0].description,
        icon: currentWeather.data.weather[0].icon
      },
      forecast: forecast.data.list.map(item => ({
        date: new Date(item.dt * 1000),
        temperature: item.main.temp,
        feelsLike: item.main.feels_like,
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }))
    });
  } catch (error) {
    console.error('Weather API test error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error testing weather API', 
      error: error.response?.data || error.message 
    });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-trip-planner', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Log environment variables (without sensitive data)
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
console.log('OpenWeather API Key:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'Not set');

// Routes
console.log('Setting up routes...');

// Test destination route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    message: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /test (Server test)');
  console.log('- GET /api/test (API test)');
  console.log('- GET /api/destinations');
  console.log('- GET /api/destinations/test');
  console.log('- GET /api/destinations/test-weather');
  console.log('- GET /api/weather-test (Test weather API)');
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- POST /api/trips (Create trip)');
  console.log('- GET /api/trips (Get user trips)');
  console.log('- GET /api/trips/:id (Get single trip)');
  console.log('- PUT /api/trips/:id (Update trip)');
  console.log('- DELETE /api/trips/:id (Delete trip)');
  console.log('- GET /api/admin');
  console.log('- POST /api/admin');
  console.log('- PUT /api/admin');
  console.log('- DELETE /api/admin');
}); 