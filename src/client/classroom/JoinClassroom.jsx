import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function JoinClassroom() {
  return (
    <div>
      <Form>
        <Form.Group controlId="answer">
          <Form.Label>Classroom ID</Form.Label>
          <Form.Control type="text" placeholder="Paste classroom ID here" name="classroomId" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Join
        </Button>
      </Form>
      <p>-------------- or --------------</p>
      <LinkContainer to="/classroom/create">
        <Button>Create classroom</Button>
      </LinkContainer>
    </div>
  );
}
