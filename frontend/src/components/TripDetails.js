import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    fetchTripDetails();
  }, [tripId]);

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch trip details
      const response = await api.get(`/trips/${tripId}`);
      const tripData = response.data;

      // Fetch current weather for the destination
      const weatherResponse = await api.get(`/destinations/${tripData.destination._id}/weather`);
      console.log('Weather response:', weatherResponse.data); // Debug log

      // Update the trip data with weather information
      setTrip({
        ...tripData,
        destination: {
          ...tripData.destination,
          weather: weatherResponse.data
        }
      });
    } catch (error) {
      console.error('Error fetching trip details:', error);
      setError('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshWeather = async () => {
    if (trip) {
      try {
        setWeatherLoading(true);
        const weatherResponse = await api.get(`/destinations/${trip.destination._id}/weather`);
        setTrip(prevTrip => ({
          ...prevTrip,
          destination: {
            ...prevTrip.destination,
            weather: weatherResponse.data
          }
        }));
      } catch (error) {
        console.error('Error refreshing weather:', error);
      } finally {
        setWeatherLoading(false);
      }
    }
  };

  const handleTodoToggle = async (todoIndex) => {
    try {
      const updatedTodos = [...trip.todos];
      updatedTodos[todoIndex] = {
        ...updatedTodos[todoIndex],
        completed: !updatedTodos[todoIndex].completed
      };

      await api.put(`/trips/${tripId}`, {
        ...trip,
        todos: updatedTodos
      });

      setTrip({
        ...trip,
        todos: updatedTodos
      });
    } catch (err) {
      setError('Failed to update todo');
    }
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
            onClick={() => navigate('/my-trips')}
          >
            Return to My Trips
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!trip) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          Trip not found
          <Button 
            variant="link" 
            className="d-block mt-2"
            onClick={() => navigate('/my-trips')}
          >
            Return to My Trips
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Trip to {trip.destination.name}</h2>
      
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>
              <h4>Trip Details</h4>
            </Card.Header>
            <Card.Body>
              <p><strong>Destination:</strong> {trip.destination.name}, {trip.destination.country}</p>
              <p><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}</p>
              {trip.notes && <p><strong>Notes:</strong> {trip.notes}</p>}
              
              {trip.todos && trip.todos.length > 0 && (
                <>
                  <h5 className="mt-3">Todo List</h5>
                  <div className="todo-list">
                    {trip.todos.map((todo, index) => (
                      <Form.Check
                        key={index}
                        type="checkbox"
                        id={`todo-${index}`}
                        label={
                          <span className={todo.completed ? 'text-muted' : ''}>
                            {todo.text}
                            {todo.type && <span className="ms-1 text-muted">({todo.type})</span>}
                          </span>
                        }
                        checked={todo.completed}
                        onChange={() => handleTodoToggle(index)}
                        className="mb-2"
                      />
                    ))}
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4>Current Weather</h4>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={handleRefreshWeather}
                disabled={weatherLoading}
              >
                {weatherLoading ? 'Refreshing...' : 'Refresh Weather'}
              </Button>
            </Card.Header>
            <Card.Body>
              {weatherLoading ? (
                <div className="text-center">
                  <Spinner animation="border" size="sm" />
                  <p className="mt-2 mb-0">Fetching weather data...</p>
                </div>
              ) : trip.destination.weather ? (
                <>
                  <div className="d-flex align-items-center mb-3">
                    {trip.destination.weather.icon && (
                      <img 
                        src={`http://openweathermap.org/img/wn/${trip.destination.weather.icon}@2x.png`}
                        alt="Weather icon"
                        style={{ width: '50px' }}
                      />
                    )}
                    <div>
                      <p className="mb-0"><strong>Temperature:</strong> {Math.round(trip.destination.weather.temp)}°C</p>
                      <p className="mb-0"><strong>Condition:</strong> {trip.destination.weather.condition}</p>
                      <p className="mb-0"><strong>Humidity:</strong> {trip.destination.weather.humidity}%</p>
                    </div>
                  </div>
                </>
              ) : (
                <Alert variant="warning">
                  Weather data not available. 
                  <Button 
                    variant="link" 
                    className="p-0 ms-2"
                    onClick={handleRefreshWeather}
                    disabled={weatherLoading}
                  >
                    Try again
                  </Button>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TripDetails; 