import React from 'react';
import { Accordion, Button, Card } from 'react-bootstrap';
import QuizCreate from './QuizCreate.jsx';

// A list of actions for instructors. The layout of this component is
// undecided. It may be a separate page, a pop-up in the classroom
// session page, or part of the session page.

export default function Dashboard() {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="0">
            Create a Quiz
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body><QuizCreate /></Card.Body>
        </Accordion.Collapse>
      </Card>
      <Card>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey="1">
            Another action
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse eventKey="1">
          <Card.Body>Another function goes here</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
