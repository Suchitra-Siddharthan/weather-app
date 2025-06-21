import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Body>
              <h1>Welcome to Weather Trip Planner</h1>
              <p className="lead">
                Plan your perfect trip based on weather conditions
              </p>
              
              {isAuthenticated ? (
                <>
                  <p>Welcome back, {user?.name}!</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/destinations')}
                    className="me-2"
                  >
                    Browse Destinations
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => navigate('/my-trips')}
                  >
                    My Trips
                  </Button>
                </>
              ) : (
                <>
                  <p>Please log in to start planning your trips</p>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/login')}
                    className="me-2"
                  >
                    Login
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 