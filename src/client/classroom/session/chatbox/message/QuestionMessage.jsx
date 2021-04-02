import React from 'react';
import { Button, Form } from 'react-bootstrap';


export default function QuestionMessage() {
  return (
    <div>
      <p>Question text</p>
      <Form>
        <Form.Group controlId="reply">
          <Form.Label>Reply</Form.Label>
          <Form.Control type="text" placeholder="Type your reply" name="reply" />

          <Form.Text className="text-muted">
            Help other students out by replying
          </Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Send
        </Button>
      </Form>
    </div>
  );
}
