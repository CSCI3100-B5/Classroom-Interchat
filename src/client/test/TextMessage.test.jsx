/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */

// import testing libraries

// chai verifies test results
import { expect } from 'chai';
// react testing library provides a fake environment for our component to
// live in and observe its behavior
import { render, screen } from '@testing-library/react';
// mocha is our test library
import { describe, it } from 'mocha';
// always import react when we are writing JSX
import React from 'react';

// import the component that we want to test
import TextMessage from '../classroom/session/chatbox/message/TextMessage.jsx';

// this describe block contains all tests related to the TextMessage component
describe('TextMessage Component', () => {
  // give a plain text message, expects TextMessage to render it properly
  it('Renders a plain text message', () => {
    // tell react testing library to render our TextMessage component
    // provide sample message data for the component to render with
    render(<TextMessage message={{ content: 'hello world' }} />);

    // we expect the "hello world" text to pop up on the screen
    // tell react testing library to find the text "hello world", if it
    // returns null, then the text doesn't exist. Or else, our test
    // is successful
    expect(screen.queryByText('hello world')).to.not.be.equal(null);
  });
});
