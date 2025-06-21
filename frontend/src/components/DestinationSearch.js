import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const DestinationSearch = () => {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/destinations');
      console.log('Fetched destinations:', response.data); // Debug log
      
      if (!response?.data) {
        throw new Error('No data received from server');
      }

      const destinationsData = Array.isArray(response.data) 
        ? response.data.filter(dest => {
            console.log('Checking destination:', dest); // Debug log
            return dest && 
                   typeof dest === 'object' && 
                   dest._id && 
                   typeof dest.name === 'string' && 
                   typeof dest.country === 'string';
          })
        : [];

      console.log('Filtered destinations:', destinationsData); // Debug log
      setDestinations(destinationsData);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      setError('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (destinationId) => {
    if (!destinationId) return;
    
    try {
      setWeatherLoading(true);
      const response = await api.get(`/destinations/${destinationId}/weather`);
      const weatherData = response.data;
      
      setDestinations(prevDestinations => 
        prevDestinations.map(dest => 
          dest._id === destinationId 
            ? { ...dest, weather: weatherData }
            : dest
        )
      );
    } catch (error) {
      console.error(`Error fetching weather for destination ${destinationId}:`, error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e?.target?.value || '';
    setSearchTerm(value);
  };

  const filterDestinations = (destinations, term) => {
    if (!term || term.trim() === '') {
      return destinations;
    }

    const searchTerm = term.toLowerCase().trim();
    return destinations.filter(destination => {
      if (!destination || !destination.name || !destination.country) {
        return false;
      }
      const name = destination.name.toLowerCase();
      const country = destination.country.toLowerCase();
      return name.includes(searchTerm) || country.includes(searchTerm);
    });
  };

  const handlePlanTrip = (destination) => {
    if (!destination) return;
    
    navigate('/create-trip', { 
      state: { 
        destination,
        message: `Planning your trip to ${destination.name}`
      } 
    });
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <Button 
            variant="link" 
            className="d-block mt-2"
            onClick={fetchDestinations}
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  const filteredDestinations = filterDestinations(destinations, searchTerm);
  console.log('Current destinations:', destinations); // Debug log
  console.log('Filtered destinations:', filteredDestinations); // Debug log

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Search Destinations</h2>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Search by City or Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city or country name"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {filteredDestinations.length > 0 ? (
            <Card>
              <Card.Body>
                <h4>Available Destinations ({filteredDestinations.length})</h4>
                <ListGroup>
                  {filteredDestinations.map((destination) => (
                    <ListGroup.Item
                      key={destination._id}
                      action
                      onClick={() => {
                        setSelectedDestination(destination);
                        if (!destination.weather) {
                          fetchWeather(destination._id);
                        }
                      }}
                      active={selectedDestination?._id === destination._id}
                    >
                      {destination.name}, {destination.country}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body>
                <Alert variant="info">
                  {searchTerm 
                    ? 'No destinations found matching your search.' 
                    : 'No destinations available.'}
                </Alert>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col md={8}>
          {selectedDestination ? (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h3>{selectedDestination.name}, {selectedDestination.country}</h3>
                <Button 
                  variant="primary"
                  onClick={() => handlePlanTrip(selectedDestination)}
                >
                  Plan Trip
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    {selectedDestination.image && (
                      <Card.Img 
                        src={selectedDestination.image} 
                        alt={selectedDestination.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Text className="mt-3">
                      <strong>Description:</strong> {selectedDestination.description || 'No description available.'}
                    </Card.Text>
                  </Col>
                  <Col md={6}>
                    <h5>Current Weather</h5>
                    {weatherLoading ? (
                      <div className="text-center">
                        <Spinner animation="border" size="sm" />
                        <p>Loading weather data...</p>
                      </div>
                    ) : selectedDestination.weather ? (
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          {selectedDestination.weather.icon && (
                            <img 
                              src={`http://openweathermap.org/img/wn/${selectedDestination.weather.icon}@2x.png`}
                              alt="Weather icon"
                              style={{ width: '50px' }}
                            />
                          )}
                          <strong>{Math.round(selectedDestination.weather.temp)}°C</strong>
                        </div>
                        <div>
                          <span className="badge bg-info">{selectedDestination.weather.condition}</span>
                          <div className="small text-muted">
                            Humidity: {selectedDestination.weather.humidity}%
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert variant="info">
                        Weather data not available. Click on the destination to fetch weather information.
                      </Alert>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Body>
                <Alert variant="info">
                  Select a destination to view details and weather information.
                </Alert>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DestinationSearch; 