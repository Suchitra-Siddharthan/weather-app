const Destination = require('../models/Destination');
const { getCurrentWeather } = require('../services/weatherService');

// Example cities with their coordinates and descriptions
const exampleCities = {
  'Paris': { 
    coordinates: [2.3522, 48.8566], 
    country: 'France',
    description: 'The City of Light, known for its romantic atmosphere, iconic Eiffel Tower, and world-class museums like the Louvre.'
  },
  'London': { 
    coordinates: [-0.1278, 51.5074], 
    country: 'United Kingdom',
    description: 'A vibrant capital city with rich history, featuring landmarks like Big Ben, Buckingham Palace, and the Tower of London.'
  },
  'New York': { 
    coordinates: [-74.0060, 40.7128], 
    country: 'United States',
    description: 'The city that never sleeps, famous for Times Square, Central Park, and the Statue of Liberty.'
  },
  'Tokyo': { 
    coordinates: [139.6503, 35.6762], 
    country: 'Japan',
    description: 'A vibrant metropolis where traditional culture meets cutting-edge technology, featuring ancient temples and modern skyscrapers.'
  },
  'Sydney': { 
    coordinates: [151.2093, -33.8688], 
    country: 'Australia',
    description: 'Australia\'s largest city, known for its stunning harbor, iconic Opera House, and beautiful beaches like Bondi. A perfect blend of urban life and natural beauty with a vibrant cultural scene.'
  },
  'Dubai': { 
    coordinates: [55.2708, 25.2048], 
    country: 'United Arab Emirates',
    description: 'A modern metropolis in the desert, famous for its luxury shopping, ultramodern architecture, and lively nightlife scene.'
  },
  'Rome': { 
    coordinates: [12.4964, 41.9028], 
    country: 'Italy',
    description: 'The Eternal City, home to ancient ruins like the Colosseum and Roman Forum, as well as Vatican City and its famous art.'
  },
  'Barcelona': { 
    coordinates: [2.1734, 41.3851], 
    country: 'Spain',
    description: 'A vibrant city known for its unique architecture by Antoni Gaudí, beautiful beaches, and lively cultural scene.'
  },
  'Amsterdam': { 
    coordinates: [4.9041, 52.3676], 
    country: 'Netherlands',
    description: 'A charming city of canals, historic houses, and world-class museums like the Van Gogh Museum and Rijksmuseum.'
  },
  'Berlin': { 
    coordinates: [13.4050, 52.5200], 
    country: 'Germany',
    description: 'Germany\'s capital, known for its art scene, modern landmarks like the Berlin Wall, and vibrant nightlife.'
  }
};

const destinationController = {
  // Get all destinations
  getDestinations: async (req, res) => {
    try {
      const destinations = await Destination.find({});
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
  },

  // Add new destination
  addDestination: async (req, res) => {
    try {
      const { name, description, country, coordinates } = req.body;

      // Check if it's an example city
      const cityInfo = exampleCities[name];
      if (cityInfo) {
        // Use example city data
        const weatherData = await getCurrentWeather(cityInfo.coordinates);
        
        const destination = new Destination({
          name,
          description: description || `Beautiful destination in ${cityInfo.country}`,
          country: cityInfo.country,
          location: {
            type: 'Point',
            coordinates: cityInfo.coordinates
          },
          weather: {
            temp: weatherData.temp,
            humidity: weatherData.humidity,
            condition: weatherData.condition,
            icon: weatherData.icon,
            lastUpdated: new Date()
          }
        });

        await destination.save();
        return res.status(201).json(destination);
      }

      // For custom destinations
      if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        return res.status(400).json({ 
          message: 'Please provide valid coordinates [longitude, latitude] or use an example city name' 
        });
      }

      const weatherData = await getCurrentWeather(coordinates);
      
      const destination = new Destination({
        name,
        description,
        country,
        location: {
          type: 'Point',
          coordinates
        },
        weather: {
          temp: weatherData.temp,
          humidity: weatherData.humidity,
          condition: weatherData.condition,
          icon: weatherData.icon,
          lastUpdated: new Date()
        }
      });

      await destination.save();
      res.status(201).json(destination);
    } catch (error) {
      console.error('Error adding destination:', error);
      res.status(500).json({ message: 'Error adding destination', error: error.message });
    }
  },

  // Delete a destination
  deleteDestination: async (req, res) => {
    try {
      const destination = await Destination.findByIdAndDelete(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' });
      }
      res.json({ message: 'Destination deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting destination', error: error.message });
    }
  },

  // Get weather for destination
  getWeather: async (req, res) => {
    try {
      const destination = await Destination.findById(req.params.id);
      if (!destination) {
        return res.status(404).json({ message: 'Destination not found' });
      }

      // Check if weather data needs to be updated (older than 30 minutes)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (!destination.weather.lastUpdated || destination.weather.lastUpdated < thirtyMinutesAgo) {
        const weatherData = await getCurrentWeather(destination.location.coordinates);
        
        destination.weather = {
          temp: weatherData.temp,
          humidity: weatherData.humidity,
          condition: weatherData.condition,
          icon: weatherData.icon,
          lastUpdated: new Date()
        };
        
        await destination.save();
      }

      res.json(destination.weather);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching weather', error: error.message });
    }
  },

  // Get example cities
  getExampleCities: async (req, res) => {
    try {
      res.json(Object.keys(exampleCities));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching example cities' });
    }
  }
};

module.exports = destinationController; 