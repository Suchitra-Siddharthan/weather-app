const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('../models/Destination');
const weatherService = require('../services/weatherService');

dotenv.config();

const sampleDestinations = [
  {
    name: "London",
    description: "The capital of England, known for its rich history and iconic landmarks.",
    country: "United Kingdom",
    coordinates: [51.5074, -0.1278],
    bestTimeToVisit: "Spring and Summer",
    activities: ["Sightseeing", "Museums", "Shopping", "Theater"],
    images: []
  },
  {
    name: "Paris",
    description: "The City of Light, famous for its art, fashion, and cuisine.",
    country: "France",
    coordinates: [48.8566, 2.3522],
    bestTimeToVisit: "Spring and Fall",
    activities: ["Museums", "Shopping", "Dining", "Sightseeing"],
    images: []
  },
  {
    name: "Tokyo",
    description: "A vibrant metropolis blending traditional culture with modern technology.",
    country: "Japan",
    coordinates: [35.6762, 139.6503],
    bestTimeToVisit: "Spring and Fall",
    activities: ["Temples", "Shopping", "Dining", "Technology"],
    images: []
  }
];

async function insertSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/weather-trip-planner', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    console.log('Cleared existing destinations');

    // Insert sample destinations with weather data
    for (const dest of sampleDestinations) {
      try {
        // Get weather data
        const weatherData = await weatherService.getCurrentWeather(dest.coordinates);
        const forecast = await weatherService.getForecast(dest.coordinates);

        const destination = new Destination({
          ...dest,
          weatherData: {
            current: {
              temperature: weatherData.main.temp,
              feelsLike: weatherData.main.feels_like,
              humidity: weatherData.main.humidity,
              windSpeed: weatherData.wind.speed,
              description: weatherData.weather[0].description,
              icon: weatherData.weather[0].icon,
              lastUpdated: new Date()
            },
            forecast: forecast.list.map(item => ({
              date: new Date(item.dt * 1000),
              temperature: item.main.temp,
              feelsLike: item.main.feels_like,
              humidity: item.main.humidity,
              windSpeed: item.wind.speed,
              description: item.weather[0].description,
              icon: item.weather[0].icon
            }))
          }
        });

        await destination.save();
        console.log(`Added destination: ${dest.name}`);
      } catch (error) {
        console.error(`Error adding ${dest.name}:`, error.message);
      }
    }

    console.log('Sample data insertion complete');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

insertSampleData(); 