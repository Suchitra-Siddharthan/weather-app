import axios from 'axios';

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherService = {
  // Get current weather
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },

  // Get 5-day forecast
  getForecast: async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw error;
    }
  },

  // Get historical weather data
  getHistoricalWeather: async (city, date) => {
    try {
      const response = await axios.get(`${BASE_URL}/onecall/timemachine`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          dt: Math.floor(date.getTime() / 1000),
          appid: API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      throw error;
    }
  },

  // Get weather alerts
  getWeatherAlerts: async (city) => {
    try {
      const response = await axios.get(`${BASE_URL}/onecall`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          exclude: 'current,minutely,hourly,daily',
          appid: API_KEY
        }
      });
      return response.data.alerts || [];
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      throw error;
    }
  },

  // Get city coordinates
  getCityCoordinates: async (cityName) => {
    try {
      const response = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: cityName,
          limit: 1,
          appid: API_KEY
        }
      });
      return response.data[0];
    } catch (error) {
      console.error('Error fetching city coordinates:', error);
      throw error;
    }
  }
};

export default weatherService; 