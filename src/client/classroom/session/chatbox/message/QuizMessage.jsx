import React from 'react';
import { Form, Button } from 'react-bootstrap';

// A type of message with interactive prompt.

export default function QuizMessage() {
  return (
    <div>
      <p>Quuestion to be answered</p>
      <Form>
        <Form.Group controlId="answer">
          <Form.Label>Answer</Form.Label>
          <Form.Control type="text" placeholder="Type your answer" name="answer" />

          <Button variant="primary" type="submit">
            Submit answer
          </Button>

          <Form.Text className="text-muted">
            Answer question and win tokens!
          </Form.Text>
        </Form.Group>
      </Form>
    </div>
  );
}
