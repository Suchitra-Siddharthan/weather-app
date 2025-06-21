import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, ListGroup } from 'react-bootstrap';
import api from '../utils/api';

// Predefined destinations with coordinates
const predefinedDestinations = [
  {
    name: 'Sydney',
    country: 'Australia',
    description: 'Australia\'s largest city, known for its stunning harbor, iconic Opera House, and beautiful beaches like Bondi.',
    location: {
      type: 'Point',
      coordinates: [151.2093, -33.8688]
    }
  },
  {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, known for its romantic atmosphere, iconic Eiffel Tower, and world-class museums like the Louvre.',
    location: {
      type: 'Point',
      coordinates: [2.3522, 48.8566]
    }
  },
  {
    name: 'London',
    country: 'United Kingdom',
    description: 'A vibrant capital city with rich history, featuring landmarks like Big Ben, Buckingham Palace, and the Tower of London.',
    location: {
      type: 'Point',
      coordinates: [-0.1278, 51.5074]
    }
  },
  {
    name: 'New York',
    country: 'United States',
    description: 'The city that never sleeps, famous for Times Square, Central Park, and the Statue of Liberty.',
    location: {
      type: 'Point',
      coordinates: [-74.0060, 40.7128]
    }
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    description: 'A vibrant metropolis where traditional culture meets cutting-edge technology, featuring ancient temples and modern skyscrapers.',
    location: {
      type: 'Point',
      coordinates: [139.6503, 35.6762]
    }
  },
  {
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: 'A modern metropolis in the desert, famous for its luxury shopping, ultramodern architecture, and lively nightlife scene.',
    location: {
      type: 'Point',
      coordinates: [55.2708, 25.2048]
    }
  },
  {
    name: 'Rome',
    country: 'Italy',
    description: 'The Eternal City, home to ancient ruins like the Colosseum and Roman Forum, as well as Vatican City and its famous art.',
    location: {
      type: 'Point',
      coordinates: [12.4964, 41.9028]
    }
  },
  {
    name: 'Barcelona',
    country: 'Spain',
    description: 'A vibrant city known for its unique architecture by Antoni Gaudí, beautiful beaches, and lively cultural scene.',
    location: {
      type: 'Point',
      coordinates: [2.1734, 41.3851]
    }
  },
  {
    name: 'Amsterdam',
    country: 'Netherlands',
    description: 'A charming city of canals, historic houses, and world-class museums like the Van Gogh Museum and Rijksmuseum.',
    location: {
      type: 'Point',
      coordinates: [4.9041, 52.3676]
    }
  },
  {
    name: 'Berlin',
    country: 'Germany',
    description: 'Germany\'s capital, known for its art scene, modern landmarks like the Berlin Wall, and vibrant nightlife.',
    location: {
      type: 'Point',
      coordinates: [13.4050, 52.5200]
    }
  }
];

const AdminDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newDestination, setNewDestination] = useState({
    name: '',
    description: '',
    country: '',
    location: {
      type: 'Point',
      coordinates: ['', '']
    }
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations');
      setDestinations(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching destinations');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('coordinates')) {
      const index = parseInt(name.split('-')[1]);
      setNewDestination(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: prev.location.coordinates.map((coord, i) => i === index ? parseFloat(value) : coord)
        }
      }));
    } else {
      setNewDestination(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/destinations', newDestination);
      setSuccess('Destination added successfully!');
      setNewDestination({
        name: '',
        description: '',
        country: '',
        location: {
          type: 'Point',
          coordinates: ['', '']
        }
      });
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding destination');
    }
  };

  const handleQuickAdd = async (destination) => {
    try {
      await api.post('/destinations', destination);
      setSuccess(`${destination.name} added successfully!`);
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || `Error adding ${destination.name}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/destinations/${id}`);
      setSuccess('Destination deleted successfully!');
      fetchDestinations();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting destination');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Manage Destinations</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="mb-4">
        <Col md={8}>
          <Card className="p-4">
            <h3>Add New Destination</h3>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newDestination.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      type="text"
                      name="country"
                      value={newDestination.country}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={newDestination.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name="coordinates-0"
                      value={newDestination.location.coordinates[0]}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 151.2093 for Sydney"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name="coordinates-1"
                      value={newDestination.location.coordinates[1]}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., -33.8688 for Sydney"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="primary">Add Destination</Button>
            </Form>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Quick Add Popular Destinations</Card.Header>
            <ListGroup variant="flush">
              {predefinedDestinations.map((dest, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{dest.name}</strong>
                    <div className="small text-muted">{dest.country}</div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuickAdd(dest)}
                  >
                    Add
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      <Row>
        {destinations.map(destination => (
          <Col md={4} key={destination._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{destination.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{destination.country}</Card.Subtitle>
                <Card.Text>{destination.description}</Card.Text>
                {destination.weather && (
                  <div className="mb-2">
                    <p className="mb-1">
                      <strong>Weather:</strong> {destination.weather.condition}
                    </p>
                    <p className="mb-1">
                      <strong>Temperature:</strong> {destination.weather.temp}°C
                    </p>
                    <p className="mb-1">
                      <strong>Humidity:</strong> {destination.weather.humidity}%
                    </p>
                    {destination.weather.icon && (
                      <img
                        src={`http://openweathermap.org/img/w/${destination.weather.icon}.png`}
                        alt="Weather icon"
                      />
                    )}
                  </div>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(destination._id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDestinations; 