import React, { Component } from 'react';
import './Classroom.scoped.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default class App extends Component {
  state = { username: null, classroomID: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username, classroomID } = this.state;
    return (
      <div>
        {username ? (
          <h1 className="title">{`Welcome to classroom ${classroomID}! ${username}`}</h1>
        ) : (
          <h1 className="title">Loading.. please wait!</h1>
        )}
        <Button onClick={() => alert('some information shown here.')}>
          view classroom info
        </Button>
        <Form>
          <Form.Group controlId="answer">
            <Form.Label>Your question</Form.Label>
            <Form.Control type="answer" placeholder="Type Your Answer" />

            <Button variant="primary" type="submit">
              Submit answer
            </Button>

            <Form.Text className="text-muted">
              Answer question and win tokens!
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="message">
            <Form.Label>message</Form.Label>
            <Form.Control
              type="message"
              placeholder="chat with your classmates"
            />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="is a question" />
          </Form.Group>

          <Form.Text className="text-muted">
            Your classmate(s) will help you lol.
          </Form.Text>

          <Button variant="primary" type="submit">
            send message
          </Button>
        </Form>
      </div>
    );
  }
}
