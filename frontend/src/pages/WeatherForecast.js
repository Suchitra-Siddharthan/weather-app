import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

const WeatherForecast = () => {
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement weather API call
    console.log('Fetching weather for:', location);
  };

  return (
    <Container>
      <h2 className="text-center mb-4">Weather Forecast</h2>
      
      <Form onSubmit={handleSubmit} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Button variant="primary" type="submit" className="w-100">
              Get Forecast
            </Button>
          </Col>
        </Row>
      </Form>

      {forecast && (
        <Card>
          <Card.Body>
            <Card.Title>Weather for {location}</Card.Title>
            {/* Weather data will be displayed here */}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default WeatherForecast; 