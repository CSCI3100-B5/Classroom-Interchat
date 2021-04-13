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
import StatusMessage from '../classroom/session/chatbox/message/StatusMessage.jsx';

// tests related to the StatusMessage component
describe('StatusMessage Component', () => {
  // give a Status message, expects StatusMessage to render it properly
  it('Renders a status message', () => {
    // tell react testing library to render our StatusMessage component
    // provide sample message data for the component to render with
    render(<StatusMessage message={{ content: 'test status message' }} />);

    // expect the 'test status message' text to pop up on the screen
    expect(screen.queryByText('test status message')).to.not.be.equal(null);
  });
});
