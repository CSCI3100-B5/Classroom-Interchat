import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * The Launch App tab, lives in the Account page and redirects to
 * Join Classroom page on click
 */
export default function LaunchApp() {
  return (
    <div>
      <img src="/favicon.svg" width="150" height="150" className="d-inline-block mr-3" alt="" />
      <LinkContainer to="/classroom">
        <Button className="btn shadow-sm ml-3 px-5" id="button-style" size="lg">
          <strong>Launch</strong>
        </Button>
      </LinkContainer>
    </div>
  );
}
