import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <h1 className="text-center">Welcome to Weather Trip Planner</h1>
          <p className="text-center">Plan your perfect trip based on weather conditions</p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Plan Your Trip</Card.Title>
              <Card.Text>
                Create a new trip plan with weather-based recommendations.
              </Card.Text>
              <Link to="/trip-planner" className="btn btn-primary">
                Start Planning
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>View Your Trips</Card.Title>
              <Card.Text>
                Access and manage your saved trip plans.
              </Card.Text>
              <Link to="/my-trips" className="btn btn-primary">
                My Trips
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Weather Forecast</Card.Title>
              <Card.Text>
                Check weather conditions for your destinations.
              </Card.Text>
              <Link to="/weather-forecast" className="btn btn-primary">
                Check Weather
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 