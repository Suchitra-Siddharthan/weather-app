import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import api from '../utils/api';

const AdminDashboard = () => {
  const [newDestination, setNewDestination] = useState({
    name: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [destinations, setDestinations] = useState([]);

  // Example destinations to help users
  const exampleDestinations = [
    {
      name: 'Paris',
      description: 'The City of Light, known for its romantic atmosphere and iconic landmarks like the Eiffel Tower.'
    },
    {
      name: 'Tokyo',
      description: 'A vibrant metropolis where traditional culture meets cutting-edge technology.'
    },
    {
      name: 'New York',
      description: 'The city that never sleeps, famous for Times Square and Central Park.'
    }
  ];

  // Fetch destinations on component mount
  React.useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations');
      setDestinations(response.data);
    } catch (err) {
      setError('Failed to fetch destinations');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/destinations', newDestination);
      setMessage('Destination added successfully!');
      setNewDestination({ name: '', description: '' });
      fetchDestinations(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding destination');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/destinations/${id}`);
      setMessage('Destination deleted successfully!');
      fetchDestinations(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Error deleting destination');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Manage Destinations</h2>
      
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Card className="p-4 mb-4">
            <h3>Add New Destination</h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Destination Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Paris, Tokyo, New York"
                  value={newDestination.name}
                  onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                  required
                />
                <Form.Text className="text-muted">
                  Try: {exampleDestinations.map(d => d.name).join(', ')}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a brief description of the destination"
                  value={newDestination.description}
                  onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                  required
                />
                <Form.Text className="text-muted">
                  Example: {exampleDestinations[0].description}
                </Form.Text>
              </Form.Group>

              <Button variant="primary" type="submit">
                Add Destination
              </Button>
            </Form>
          </Card>
        </Col>

        <Col md={6}>
          <h3>Current Destinations</h3>
          {destinations.map(destination => (
            <Card key={destination._id} className="mb-3">
              <Card.Body>
                <Card.Title>{destination.name}</Card.Title>
                <Card.Text>{destination.description}</Card.Text>
                {destination.weather && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h5>Current Weather</h5>
                    <div className="d-flex justify-content-between">
                      <div>
                        <p><strong>Temperature:</strong> {destination.weather.temp}°C</p>
                        <p><strong>Humidity:</strong> {destination.weather.humidity}%</p>
                      </div>
                      <div>
                        <p><strong>Condition:</strong> {destination.weather.condition}</p>
                        {destination.weather.icon && (
                          <img 
                            src={`http://openweathermap.org/img/wn/${destination.weather.icon}@2x.png`} 
                            alt="Weather icon"
                            style={{ width: '50px' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDelete(destination._id)}
                  className="mt-2"
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 