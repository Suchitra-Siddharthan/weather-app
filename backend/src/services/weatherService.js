const axios = require('axios');

const getCurrentWeather = async (coordinates) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('OpenWeather API key is not configured');
    }

    const [lon, lat] = coordinates;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(url);
    const data = response.data;

    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].description,
      icon: data.weather[0].icon
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch current weather data');
  }
};

const getForecast = async (coordinates) => {
  try {
    const [lon, lat] = coordinates;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

const getHistoricalWeather = async (coordinates, date) => {
  try {
    const [lon, lat] = coordinates;
    const timestamp = Math.floor(date.getTime() / 1000);
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${apiKey}&units=metric`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    throw error;
  }
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getHistoricalWeather
}; 