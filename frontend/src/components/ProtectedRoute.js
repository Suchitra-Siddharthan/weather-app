import React from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Login Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You need to be logged in to access this feature.</p>
            <p>Please login or register to continue.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              navigate('/');
            }}>
              Close
            </Button>
            <Button variant="primary" onClick={() => {
              setShowModal(false);
              navigate('/login', { state: { from: location.pathname } });
            }}>
              Go to Login
            </Button>
            <Button variant="outline-primary" onClick={() => {
              setShowModal(false);
              navigate('/register', { state: { from: location.pathname } });
            }}>
              Register
            </Button>
          </Modal.Footer>
        </Modal>
        <Navigate to="/" replace />
      </>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Access Denied</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>You do not have permission to access this page.</p>
            <p>Only administrators can access this feature.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              setShowModal(false);
              navigate('/');
            }}>
              Go to Home
            </Button>
          </Modal.Footer>
        </Modal>
        <Navigate to="/" replace />
      </>
    );
  }

  return children;
};

export default ProtectedRoute; 