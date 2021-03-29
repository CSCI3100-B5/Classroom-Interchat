import React from 'react';
import {
  Button, Form, Col, Row
} from 'react-bootstrap';

// This Page enables the user to edit his/her account information.

export default function EditAccountInfo() {
  return (
    <div>
      <Form>
        <Form.Group as={Row} controlId="name">
          <Form.Label column sm={2}>Name</Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="name"
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="Password">
          <Form.Label column sm={2}>Password</Form.Label>
          <Col sm={5}>
            <Form.Control
              type="password"
              placeholder="New Password"
            />
          </Col>
          <Col sm={5}>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
            />
          </Col>
        </Form.Group>

        <Button type="submit">Save</Button>

      </Form>
    </div>
  );
}
