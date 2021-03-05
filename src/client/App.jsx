import React, { Component } from 'react';
import './App.scoped.css';
import Button from 'react-bootstrap/Button';
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
        <Button onClick={() => alert('clicked')}>Test</Button>
        <img src={ReactImage} alt="react" />
      </div>
    );
  }
}
