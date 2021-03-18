import React from 'react';
import { Form, Button } from 'react-bootstrap';

// A form to create a quiz. This is a component belonging to the dashboard.

export default function QuizCreate() {
  return (
    <div>
      <h4>Create a quiz</h4>
      <Form>
        <Form.Group controlId="answer">
          <Form.Label>Question</Form.Label>
          <Form.Control type="text" placeholder="Type the question of the quiz" name="answer" />

          <Form.Text className="text-muted">
            Assess students&apos; understanding with interactive quizzes
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="token">
          <Form.Check
            name="token"
            label="Offer a token for this quiz"
            id="token"
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Send quiz to everyone
        </Button>
      </Form>
    </div>
  );
}
