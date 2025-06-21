import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import api from '../services/api';
import { format } from 'date-fns';

const TripPlanner = () => {
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [newTrip, setNewTrip] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    activities: [],
    notes: ''
  });

  useEffect(() => {
    fetchDestinations();
    fetchTrips();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await api.get('/destinations');
      setDestinations(response.data);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips');
      setTrips(response.data);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const destination = destinations.find(d => d._id === newTrip.destination);
      const response = await api.post('/trips', {
        ...newTrip,
        weatherForecast: destination.weatherData,
        activities: getActivityRecommendations(destination.weatherData),
        packingList: getPackingRecommendations(destination.weatherData)
      });
      setTrips([...trips, response.data]);
      setShowModal(false);
      setNewTrip({
        destination: '',
        startDate: '',
        endDate: '',
        activities: [],
        notes: ''
      });
    } catch (err) {
      console.error('Failed to create trip:', err);
    }
  };

  const getActivityRecommendations = (weather) => {
    const temp = weather.current.temperature;
    const description = weather.current.description.toLowerCase();
    
    let activities = [];
    
    if (description.includes('snow') || temp < 0) {
      activities = ['Skiing', 'Snowboarding', 'Ice skating', 'Hot springs visit'];
    } else if (description.includes('rain')) {
      activities = ['Museum visits', 'Indoor activities', 'Shopping', 'Café hopping'];
    } else if (temp > 25) {
      activities = ['Beach activities', 'Swimming', 'Water sports', 'Outdoor dining'];
    } else if (temp > 15) {
      activities = ['Hiking', 'City tours', 'Outdoor sports', 'Picnics'];
    } else {
      activities = ['Sightseeing', 'Cultural experiences', 'Local cuisine', 'Shopping'];
    }
    
    return activities;
  };

  const getPackingRecommendations = (weather) => {
    const temp = weather.current.temperature;
    const description = weather.current.description.toLowerCase();
    
    let items = ['Passport', 'Travel documents', 'Phone charger', 'First aid kit'];
    
    if (description.includes('snow') || temp < 0) {
      items.push('Winter coat', 'Thermal wear', 'Gloves', 'Scarf', 'Snow boots');
    } else if (description.includes('rain')) {
      items.push('Raincoat', 'Umbrella', 'Waterproof shoes', 'Quick-dry clothes');
    } else if (temp > 25) {
      items.push('Sunscreen', 'Sunglasses', 'Swimsuit', 'Light clothing', 'Hat');
    } else if (temp > 15) {
      items.push('Light jacket', 'Comfortable shoes', 'Layered clothing');
    } else {
      items.push('Warm jacket', 'Sweaters', 'Comfortable shoes');
    }
    
    return items;
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create New Trip
          </Button>
        </Col>
      </Row>

      <Row>
        {trips.map((trip) => (
          <Col md={6} lg={4} key={trip._id} className="mb-4">
            <Card>
              <Card.Header>
                <h5>{trip.destination.name}</h5>
                <small>
                  {format(new Date(trip.startDate), 'MMM dd, yyyy')} -{' '}
                  {format(new Date(trip.endDate), 'MMM dd, yyyy')}
                </small>
              </Card.Header>
              <Card.Body>
                <Card.Title>Weather Forecast</Card.Title>
                <Card.Text>
                  Temperature: {Math.round(trip.weatherForecast.current.temperature)}°C
                  <br />
                  Conditions: {trip.weatherForecast.current.description}
                </Card.Text>

                <Card.Title>Activities</Card.Title>
                <ListGroup variant="flush">
                  {trip.activities.map((activity, index) => (
                    <ListGroup.Item key={index}>
                      <Form.Check type="checkbox" label={activity} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <Card.Title className="mt-3">Packing List</Card.Title>
                <ListGroup variant="flush">
                  {trip.packingList.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Form.Check type="checkbox" label={item} />
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                {trip.notes && (
                  <>
                    <Card.Title className="mt-3">Notes</Card.Title>
                    <Card.Text>{trip.notes}</Card.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Trip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateTrip}>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Select
                value={newTrip.destination}
                onChange={(e) => {
                  setNewTrip({ ...newTrip, destination: e.target.value });
                  setSelectedDestination(destinations.find(d => d._id === e.target.value));
                }}
                required
              >
                <option value="">Select a destination</option>
                {destinations.map((dest) => (
                  <option key={dest._id} value={dest._id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Create Trip
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default TripPlanner; 