import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import weatherService from '../services/weatherService';

const HistoricalWeather = () => {
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Fetching coordinates for city:', city);
      const cityData = await weatherService.getCityCoordinates(city);
      console.log('City coordinates:', cityData);
      
      if (!cityData) {
        throw new Error('City not found');
      }

      console.log('Fetching historical weather for date:', date);
      const historicalData = await weatherService.getHistoricalWeather(
        { lat: cityData.lat, lon: cityData.lon },
        new Date(date)
      );
      console.log('Historical weather data:', historicalData);
      
      setWeatherData(historicalData);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'Failed to fetch historical weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Historical Weather Data</h2>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Get Weather'}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {weatherData && (
        <Card>
          <Card.Body>
            <h3>Weather Data for {city} on {new Date(date).toLocaleDateString()}</h3>
            <Row>
              {weatherData.hourly.map((hour, index) => (
                <Col key={index} md={4} className="mb-3">
                  <Card>
                    <Card.Body>
                      <h5>{new Date(hour.dt * 1000).toLocaleTimeString()}</h5>
                      <p>Temperature: {hour.temp}°C</p>
                      <p>Feels like: {hour.feels_like}°C</p>
                      <p>Humidity: {hour.humidity}%</p>
                      <p>Wind Speed: {hour.wind_speed} m/s</p>
                      <p>Weather: {hour.weather[0].description}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default HistoricalWeather; 