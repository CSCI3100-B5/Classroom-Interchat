import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


export default function LaunchApp() {
  return (
    <LinkContainer to="/classroom">
      <Button>Launch app</Button>
    </LinkContainer>
  );
}
