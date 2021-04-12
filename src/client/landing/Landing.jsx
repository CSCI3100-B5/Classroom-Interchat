import React from 'react';
import './Landing.scoped.css';
import { Button, Navbar, Row, Col, Card, Container  } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useHistory, useLocation } from 'react-router-dom';

// redirect to either / or account page


export default function App() {
  return (
    <div>
      <Navbar bg="primary" className="shadow-sm">
        <Navbar.Brand>
          <Link to="/">
            <span  className="text-white font-weight-bold align-middle ml-2">
              Classroom Interchat
            </span>
          </Link>
        </Navbar.Brand>
      </Navbar>
      
      <Container>
        <Row>
          <Col />
          <Col sm={10}>
          <Card className="my-4 shadow-sm">
            <Card.Body className="p-4 bg-light">
              <Row>
              <Col>
                <p className="font-italic py-5 px-3 mt-4" style={{fontSize:'2.1vw'}}>Enjoy an innovative real-time interactive classroom experience!</p>
                <LinkContainer to="/auth">
                  <Button className="ml-3 mt-1 px-4 shadow-sm" size="lg">
                    <strong>Login</strong>
                  </Button>
                </LinkContainer>
                <LinkContainer to="/auth#signup">
                  <Button className="ml-2 mt-1 px-4 shadow-sm" size="lg">
                    <strong>Sign up</strong>
                  </Button>
                </LinkContainer>
              </Col>
              <Col>
                <img src="/favicon.svg" className="img-fluid" alt="Classroom Interchat icon" />
              </Col>
              </Row>
              </Card.Body>
          </Card>
          </Col>
          <Col />
        </Row>
      </Container>
    </div>
  );
}
