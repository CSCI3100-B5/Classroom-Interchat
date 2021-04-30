import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import './NotFound.scoped.css';

/**
 * A catch-all 404 page, either go back or go to home page
 */
export default function NotFound() {
  const history = useHistory();
  return (
    <div className="not-found-container">
      <h1>Page not found</h1>
      <div className="d-flex justify-content-center align-items-center">
        <LinkContainer to="/">
          <Button className="m-2">Go to home page</Button>
        </LinkContainer>
        <Button onClick={history.goBack} className="m-2">Go back</Button>
      </div>
    </div>
  );
}
