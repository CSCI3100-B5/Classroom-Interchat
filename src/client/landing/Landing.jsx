import React, { useEffect } from 'react';
import {
  Button, Row, Col, Card, Container
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { BiTimer, BiCloudLightning, BiEditAlt } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import './Landing.scoped.css';

/**
 * The home page, showing buttons to log in and sign up, and a banner
 * introducing the key features of Classroom Interchat
 */
export default function Landing() {
  const history = useHistory();

  // if opening as a PWA, skip the home page and go to Auth page directly
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('In standalone UI, routing to /auth');
      history.push('/auth');
    }
  }, []);

  // short-circuit rendering if opening as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return (
      <div className="splash-container">
        <img className="splash-icon" src="/favicon.svg" alt="Page loading" />
      </div>
    );
  }
  return (
    <div>
      <div className="landing-bg" />

      <Container>
        <Row className="mt-4">
          <Col className="d-flex flex-column justify-content-center">
            <h1 className="heading text-light">Classroom Interchat</h1>
            <p className="heading-desc text-light">Enjoy an innovative real-time interactive classroom experience!</p>
            <div className="d-flex">
              <LinkContainer to="/auth">
                <Button className="ml-3 mt-1 px-4 shadow-sm" variant="outline-light" size="lg">
                  <strong className="white-space-nowrap">Log in</strong>
                </Button>
              </LinkContainer>
              <LinkContainer to="/auth#signup">
                <Button className="ml-2 mt-1 px-4 shadow-sm" variant="light" size="lg">
                  <strong className="white-space-nowrap">Sign up</strong>
                </Button>
              </LinkContainer>
            </div>
          </Col>
          <Col sm="auto" className="d-flex flex-column justify-content-center">
            <img src="/favicon.svg" className="img-fluid" alt="Classroom Interchat icon" />
          </Col>
        </Row>
        <Card as={Row} className="my-4 shadow-sm">
          <Card.Body className="p-4 bg-light">
            <Row>
              <Col sm={4} className="d-flex flex-column align-items-center">
                <BiTimer className="large-icon" />
                <p><strong>Speedy</strong></p>
                <p className="text-center">Real-time classroom with minimal set-up and no installation</p>
              </Col>
              <Col sm={4} className="d-flex flex-column align-items-center">
                <BiCloudLightning className="large-icon" />
                <p><strong>Reliable</strong></p>
                <p className="text-center">Bad Internet? Need to switch device? Never worry about missed messages</p>
              </Col>
              <Col sm={4} className="d-flex flex-column align-items-center">
                <BiEditAlt className="large-icon" />
                <p><strong>Flexible</strong></p>
                <p className="text-center">Send text, code, equations, tables, quizzes, questions and more</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
