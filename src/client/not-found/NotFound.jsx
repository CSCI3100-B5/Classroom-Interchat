import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <LinkContainer to="/">
        <Button>Go back to home page</Button>
      </LinkContainer>
    </div>
  );
}
