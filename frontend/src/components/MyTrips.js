import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/trips');
      if (response.data) {
        setTrips(response.data);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Failed to fetch trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        setLoading(true);
        setError(null);
        
        await api.delete(`/trips/${tripId}`);
        
        // Remove the deleted trip from the state
        setTrips(trips.filter(trip => trip._id !== tripId));
        setSuccess('Trip deleted successfully');
      } catch (err) {
        console.error('Error deleting trip:', err);
        setError('Failed to delete trip. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getWeatherBasedRecommendations = (weatherData) => {
    const recommendations = {
      activities: [],
      accessories: []
    };

    if (!weatherData) return recommendations;

    const temp = weatherData.temp;
    const condition = weatherData.condition.toLowerCase();

    // Activity recommendations based on temperature
    if (temp > 25) {
      recommendations.activities.push('Swimming', 'Beach activities', 'Water sports');
      recommendations.accessories.push('Sunscreen', 'Sunglasses', 'Swimsuit', 'Beach towel');
    } else if (temp > 15) {
      recommendations.activities.push('Hiking', 'Sightseeing', 'Outdoor dining');
      recommendations.accessories.push('Comfortable shoes', 'Light jacket', 'Water bottle');
    } else {
      recommendations.activities.push('Museum visits', 'Indoor activities', 'Shopping');
      recommendations.accessories.push('Warm jacket', 'Umbrella', 'Scarf');
    }

    // Additional recommendations based on weather conditions
    if (condition.includes('rain')) {
      recommendations.accessories.push('Raincoat', 'Waterproof shoes');
      recommendations.activities.push('Indoor activities', 'Museum visits');
    } else if (condition.includes('snow')) {
      recommendations.accessories.push('Winter boots', 'Gloves', 'Thermal wear');
      recommendations.activities.push('Skiing', 'Snowboarding', 'Hot springs');
    }

    return recommendations;
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
            onClick={() => fetchTrips()}
            className="p-0 ms-2"
          >
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">My Trips</h2>
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
          {success}
        </Alert>
      )}

      {trips.length === 0 ? (
        <Alert variant="info">
          You haven't planned any trips yet. 
          <Button 
            variant="link" 
            onClick={() => navigate('/destinations')}
            className="p-0 ms-2"
          >
            Start planning one now!
          </Button>
        </Alert>
      ) : (
        <Row>
          {trips.map(trip => {
            const recommendations = getWeatherBasedRecommendations(trip.destination?.weatherData);
            
            return (
              <Col key={trip._id} md={4} className="mb-4">
                <Card>
                  <Card.Header>
                    <h4>{trip.destination?.name}</h4>
                    <p className="text-muted mb-0">{trip.destination?.country}</p>
                    {trip.destination?.weatherData && (
                      <div className="mt-2">
                        <Badge bg="info">
                          {Math.round(trip.destination.weatherData.temp)}°C
                        </Badge>
                        <Badge bg="secondary" className="ms-2">
                          {trip.destination.weatherData.condition}
                        </Badge>
                      </div>
                    )}
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Dates:</strong> {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                    {trip.notes && <p><strong>Notes:</strong> {trip.notes}</p>}
                    
                    {recommendations.activities.length > 0 && (
                      <div className="mt-3">
                        <h5>Recommended Activities</h5>
                        <div className="d-flex flex-wrap gap-1">
                          {recommendations.activities.map((activity, index) => (
                            <Badge key={index} bg="primary" className="me-1">
                              {activity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {recommendations.accessories.length > 0 && (
                      <div className="mt-3">
                        <h5>Recommended Accessories</h5>
                        <div className="d-flex flex-wrap gap-1">
                          {recommendations.accessories.map((item, index) => (
                            <Badge key={index} bg="secondary" className="me-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {trip.todos && trip.todos.length > 0 && (
                      <div className="mt-3">
                        <h5>Todo List</h5>
                        <ul className="mb-0">
                          {trip.todos.slice(0, 3).map((todo, index) => (
                            <li key={index} className={todo.completed ? 'text-muted' : ''}>
                              {todo.text}
                              {todo.type && <span className="ms-1 text-muted">({todo.type})</span>}
                            </li>
                          ))}
                          {trip.todos.length > 3 && <li>...</li>}
                        </ul>
                      </div>
                    )}

                    <div className="mt-3 d-flex justify-content-between">
                      <Button 
                        variant="primary" 
                        onClick={() => handleViewDetails(trip._id)}
                        className="w-50"
                      >
                        View Trip Details
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleDeleteTrip(trip._id)}
                        disabled={loading}
                        className="w-50"
                      >
                        Delete
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyTrips; 