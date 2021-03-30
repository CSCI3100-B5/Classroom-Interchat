import React from 'react';
import './Landing.scoped.css';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AppImage from './Icon@4x.png';

// This is the homepage of our website, shown to the user when
// they are not logged in.

export default function App() {
  return (
    <div>
      <h1 className="title">Classroom Interchat</h1>
      <p>Enjoy an innovative real-time interactive classroom experience!</p>
      <LinkContainer to="/auth">
        <Button>Login</Button>
      </LinkContainer>
      <img src={AppImage} alt="Classroom Interchat icon" />
    </div>
  );
}
