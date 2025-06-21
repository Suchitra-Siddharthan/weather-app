import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, ListGroup, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const CreateTrip = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [tripDetails, setTripDetails] = useState({
    destination: location.state?.destination || null,
    startDate: '',
    endDate: '',
    todos: []
  });
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [createdTrip, setCreatedTrip] = useState(null);
  const [recommendations, setRecommendations] = useState({
    activities: [],
    accessories: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!tripDetails.destination) {
      navigate('/destinations');
    } else {
      generateRecommendations();
    }
  }, [tripDetails.destination, navigate, isAuthenticated]);

  const generateRecommendations = async () => {
    try {
      // Get current weather for the destination
      const weatherResponse = await api.get(`/destinations/${tripDetails.destination._id}/weather`);
      const weatherData = weatherResponse.data;

      const temp = weatherData.temp;
      const condition = weatherData.condition.toLowerCase();
      
      // Generate activity recommendations
      let activities = [];
      if (condition.includes('snow') || temp < 0) {
        activities = ['Skiing', 'Snowboarding', 'Ice skating', 'Hot springs visit', 'Winter photography'];
      } else if (condition.includes('rain')) {
        activities = ['Museum visits', 'Indoor activities', 'Shopping', 'Café hopping', 'Art galleries'];
      } else if (temp > 25) {
        activities = ['Beach activities', 'Swimming', 'Water sports', 'Outdoor dining', 'Park visits'];
      } else if (temp > 15) {
        activities = ['Hiking', 'City tours', 'Outdoor sports', 'Picnics', 'Cycling'];
      } else {
        activities = ['Sightseeing', 'Cultural experiences', 'Local cuisine', 'Shopping', 'Historical sites'];
      }

      // Generate packing recommendations
      let accessories = ['Passport', 'Travel documents', 'Phone charger', 'First aid kit'];
      if (condition.includes('snow') || temp < 0) {
        accessories.push('Winter coat', 'Thermal wear', 'Gloves', 'Scarf', 'Snow boots');
      } else if (condition.includes('rain')) {
        accessories.push('Raincoat', 'Umbrella', 'Waterproof shoes', 'Quick-dry clothes');
      } else if (temp > 25) {
        accessories.push('Sunscreen', 'Sunglasses', 'Swimsuit', 'Light clothing', 'Hat');
      } else if (temp > 15) {
        accessories.push('Light jacket', 'Comfortable shoes', 'Layered clothing');
      } else {
        accessories.push('Warm jacket', 'Sweaters', 'Comfortable shoes');
      }

      setRecommendations({
        activities,
        accessories
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTripDetails(prev => ({
        ...prev,
        todos: [...prev.todos, { 
          text: newTodo.trim(), 
          completed: false, 
          type: 'custom' // Must be one of: 'activities', 'accessories', 'custom'
        }]
      }));
      setNewTodo('');
    }
  };

  const handleAddRecommendation = (type, item) => {
    // Check if the item is already in the todos list
    const isAlreadyAdded = tripDetails.todos.some(todo => 
      todo.text === item && todo.type === type
    );

    if (!isAlreadyAdded) {
      // Convert type to match model enum
      const todoType = type === 'activity' ? 'activities' : 
                      type === 'accessory' ? 'accessories' : 'custom';

      setTripDetails(prev => ({
        ...prev,
        todos: [...prev.todos, { 
          text: item, 
          completed: false, 
          type: todoType
        }]
      }));
    }
  };

  const handleUpdateTodo = (index, updatedTodo) => {
    setTripDetails(prev => ({
      ...prev,
      todos: prev.todos.map((todo, i) => 
        i === index ? { ...todo, ...updatedTodo } : todo
      )
    }));
  };

  const handleDeleteTodo = (index) => {
    setTripDetails(prev => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate authentication
      if (!isAuthenticated) {
        setError('Please log in to create a trip');
        return;
      }

      // Validate destination
      if (!tripDetails.destination || !tripDetails.destination._id) {
        setError('Please select a destination');
        return;
      }

      // Validate dates
      if (!tripDetails.startDate) {
        setError('Please select a start date');
        return;
      }
      if (!tripDetails.endDate) {
        setError('Please select an end date');
        return;
      }

      // Convert dates to Date objects for comparison
      const startDate = new Date(tripDetails.startDate);
      const endDate = new Date(tripDetails.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Validate date range
      if (startDate < today) {
        setError('Start date cannot be in the past');
        return;
      }

      if (endDate < startDate) {
        setError('End date must be after start date');
        return;
      }

      // Prepare trip data
      const tripData = {
        destination: tripDetails.destination._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        todos: tripDetails.todos.map(todo => ({
          text: todo.text,
          completed: todo.completed,
          type: todo.type
        }))
      };

      console.log('Submitting trip data:', tripData);

      // Save trip to database
      const response = await api.post('/trips', tripData);
      
      if (response.data) {
        setCreatedTrip(response.data);
        setSuccess('Trip planned successfully! Redirecting to My Trips...');
        
        // Reset form
        setTripDetails({
          destination: null,
          startDate: '',
          endDate: '',
          todos: []
        });

        // Redirect to My Trips after a short delay
        setTimeout(() => {
          navigate('/my-trips');
        }, 2000);
      }
    } catch (err) {
      console.error('Error creating trip:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors from backend
        const errorMessages = err.response.data.errors
          .map(error => error.message)
          .join(', ');
        setError(`Validation failed: ${errorMessages}`);
      } else {
        setError('Failed to create trip. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success && createdTrip) {
    return (
      <Container className="mt-4">
        <Alert variant="success">
          <h4>Trip Created Successfully!</h4>
          <p>Redirecting to My Trips...</p>
        </Alert>
        <Card>
          <Card.Header>
            <h3>Your Planned Trip</h3>
          </Card.Header>
          <Card.Body>
            <h4>{tripDetails.destination?.name}</h4>
            <p><strong>Dates:</strong> {new Date(tripDetails.startDate).toLocaleDateString()} to {new Date(tripDetails.endDate).toLocaleDateString()}</p>
            
            <h5 className="mt-3">Activities & Todos:</h5>
            <ListGroup>
              {tripDetails.todos.map((todo, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      className="me-2"
                    />
                    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                      {todo.text}
                    </span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Plan Trip to {tripDetails.destination?.name}</h2>
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={tripDetails.startDate}
                onChange={(e) => setTripDetails(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={tripDetails.endDate}
                onChange={(e) => setTripDetails(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Weather-Based Recommendations</h5>
            {tripDetails.destination?.weatherData && (
              <div className="mt-2">
                <Badge bg="info" className="me-2">
                  {Math.round(tripDetails.destination.weatherData.temp)}°C
                </Badge>
                <Badge bg="secondary">
                  {tripDetails.destination.weatherData.condition}
                </Badge>
              </div>
            )}
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h6>Recommended Activities</h6>
              <div className="d-flex flex-wrap gap-2">
                {recommendations.activities.map((activity, index) => {
                  const isAdded = tripDetails.todos.some(todo => 
                    todo.text === activity && todo.type === 'activity'
                  );
                  return (
                    <Button
                      key={index}
                      variant={isAdded ? "success" : "outline-primary"}
                      size="sm"
                      onClick={() => !isAdded && handleAddRecommendation('activity', activity)}
                      disabled={isAdded}
                    >
                      {activity} {isAdded && '✓'}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <h6>Recommended Travel Accessories</h6>
              <div className="d-flex flex-wrap gap-2">
                {recommendations.accessories.map((item, index) => {
                  const isAdded = tripDetails.todos.some(todo => 
                    todo.text === item && todo.type === 'accessory'
                  );
                  return (
                    <Button
                      key={index}
                      variant={isAdded ? "success" : "outline-secondary"}
                      size="sm"
                      onClick={() => !isAdded && handleAddRecommendation('accessory', item)}
                      disabled={isAdded}
                    >
                      {item} {isAdded && '✓'}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Todo List</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Add Custom Todo</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Enter todo"
                />
                <Button variant="primary" onClick={handleAddTodo} className="ms-2">
                  Add
                </Button>
              </div>
            </Form.Group>

            <ListGroup>
              {tripDetails.todos.map((todo, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Form.Check
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleUpdateTodo(index, { completed: !todo.completed })}
                      className="me-2"
                    />
                    <span className={todo.completed ? 'text-muted text-decoration-line-through' : ''}>
                      {todo.text}
                    </span>
                    {todo.type && (
                      <Badge bg={todo.type === 'activity' ? 'primary' : 'secondary'} className="ms-2">
                        {todo.type}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteTodo(index)}
                  >
                    ×
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-100"
        >
          {loading ? 'Creating Trip...' : 'Create Trip'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateTrip; 