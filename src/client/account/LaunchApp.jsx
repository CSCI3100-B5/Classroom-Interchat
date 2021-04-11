import React from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import AppImage from './Icon@4x.png';

export default function LaunchApp() {
  return (
    <div>
      <img src={AppImage} width="150" height="150" className="d-inline-block mr-3" alt="" />
      <LinkContainer to="/classroom">
        <Button className="btn btn-secondary shadow-sm ml-3 px-5" id="button-style" size="lg">
          <strong>Launch</strong>
        </Button>
      </LinkContainer>
    </div>
  );
}
