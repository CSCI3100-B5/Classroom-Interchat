import React, { Component } from 'react';
import './Landing.scoped.css';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import ReactImage from './react.png';

export default class App extends Component {
  state = { username: null };

  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    const { username } = this.state;
    return (
      <div>
        {username ? <h1 className="title">{`Hello ${username}`}</h1> : <h1 className="title">Loading.. please wait!</h1>}
        <p>Welcome to Classroom Interchat</p>
        <LinkContainer to="/login">
          <Button>Login</Button>
        </LinkContainer>
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
