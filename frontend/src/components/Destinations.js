import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import destinationService from '../services/destinationService';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [weatherLoading, setWeatherLoading] = useState({});
  const { isAdmin } = useAuth();

  // Fetch all destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationService.getAllDestinations();
        setDestinations(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch destinations');
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Add new destination
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/destinations', { name: newDestination });
      setDestinations([...destinations, response.data]);
      setNewDestination('');
      setSuccess('Destination added successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add destination');
      setSuccess('');
    }
  };

  // Delete destination
  const handleDelete = async (id) => {
    try {
      await api.delete(`/destinations/${id}`);
      setDestinations(destinations.filter(dest => dest._id !== id));
      setSuccess('Destination deleted successfully!');
      setError('');
    } catch (err) {
      setError('Failed to delete destination');
      setSuccess('');
    }
  };

  // Fetch weather for a destination
  const fetchWeather = async (destinationId, destinationName) => {
    try {
      setWeatherLoading(prev => ({ ...prev, [destinationId]: true }));
      const response = await api.get(`/destinations/${destinationId}/weather`);
      setDestinations(destinations.map(dest => 
        dest._id === destinationId ? { ...dest, weather: response.data } : dest
      ));
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setWeatherLoading(prev => ({ ...prev, [destinationId]: false }));
    }
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) {
    return (
      <Container className="text-center mt-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Popular Destinations</h2>
      <Row>
        {destinations.map((destination) => (
          <Col key={destination._id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{destination.name}, {destination.country}</Card.Title>
                <Card.Text>{destination.description}</Card.Text>
                
                {destination.weatherData && (
                  <div className="weather-info">
                    <h5>Current Weather</h5>
                    <p>Temperature: {destination.weatherData.current.temperature}°C</p>
                    <p>Feels like: {destination.weatherData.current.feelsLike}°C</p>
                    <p>Humidity: {destination.weatherData.current.humidity}%</p>
                    <p>Wind: {destination.weatherData.current.windSpeed} m/s</p>
                    <p>Description: {destination.weatherData.current.description}</p>
                  </div>
                )}

                <div className="mt-3">
                  <h6>Best Time to Visit:</h6>
                  <p>{destination.bestTimeToVisit}</p>
                  
                  <h6>Activities:</h6>
                  <ul>
                    {destination.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Destinations; 