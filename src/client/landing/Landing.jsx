import React from 'react';
import './Landing.scoped.css';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function App() {
  return (
    <div>
      <h1 className="title">Classroom Interchat</h1>
      <p>Enjoy an innovative real-time interactive classroom experience!</p>
      <LinkContainer to="/auth">
        <Button>Login</Button>
      </LinkContainer>
      <img src="/favicon.svg" alt="Classroom Interchat icon" />
    </div>
  );
}
