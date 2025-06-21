import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';

const MyTrips = () => {
  // This will be replaced with actual data from the backend
  const trips = [];

  return (
    <Container>
      <h2 className="text-center mb-4">My Trips</h2>
      
      {trips.length === 0 ? (
        <div className="text-center">
          <p>You haven't created any trips yet.</p>
          <p>Start planning your first trip!</p>
        </div>
      ) : (
        <Row>
          {trips.map((trip) => (
            <Col md={4} key={trip._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{trip.destination}</Card.Title>
                  <Card.Text>
                    <strong>Dates:</strong> {trip.startDate} to {trip.endDate}
                  </Card.Text>
                  <Card.Text>
                    <strong>Notes:</strong> {trip.notes}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyTrips; 