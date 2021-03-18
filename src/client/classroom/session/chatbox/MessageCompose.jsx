import React from 'react';
import { Form, Button } from 'react-bootstrap';

// The text box allowing users to send messages/questions.
// This is a separate component because of its complexity.

export default function MessageCompose() {
  return (
    <Form>
      <Form.Group controlId="message">
        <Form.Label>message</Form.Label>
        <Form.Control
          type="text"
          placeholder="chat with your classmates"
          name="message"
        />
      </Form.Group>
      <Form.Group controlId="isQuestion">
        <Form.Check type="checkbox" label="is a question" name="isQuestion" />
      </Form.Group>

      <Form.Text className="text-muted">
        Your classmate(s) will help you lol.
      </Form.Text>

      <Button variant="primary" type="submit">
        send message
      </Button>
    </Form>
  );
}
