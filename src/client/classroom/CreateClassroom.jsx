import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export default function CreateClassroom() {
  return (
    <div>
      <Form>
        <Form.Group controlId="answer">
          <Form.Label>Classroom name</Form.Label>
          <Form.Control type="text" placeholder="Type the name of classroom" name="classroomName" />

          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form.Group>
      </Form>
      <p>-------------- or --------------</p>
      <LinkContainer to="/classroom/join">
        <Button>Join a classroom</Button>
      </LinkContainer>
    </div>
  );
}
