/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import Message from '../classroom/session/chatbox/message/Message.jsx';

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

// all tests related to Message
describe('Message Component', function () {
  // before each test, set up the fake contexts
  const fakeDivQuestionMessage = function QuestionMessage({ message }) {
    return (
      <div>
        Question:
        {message.content}
      </div>
    );
  };
  const fakeDivTextMessage = function QuestionMessage({ message }) {
    return (
      <div>
        Text:
        {message.content}
      </div>
    );
  };
  const fakeDivQuizMessage = function QuestionMessage({ message }) {
    return (
      <div>
        Quiz:
        {message.content}
      </div>
    );
  };
  const fakeDivStatusMessage = function QuestionMessage({ message }) {
    return (
      <div>
        Status:
        {message.content}
      </div>
    );
  };
  const fakeDivReplyMessage = function QuestionMessage({ message }) {
    return (
      <div>
        Reply:
        {message.content}
      </div>
    );
  };
  beforeEach(function () {
    // sinon.replace(object, property, newFunction)
    // fake child component
    Message.__Rewire__('QuestionMessage', fakeDivQuestionMessage);
    Message.__Rewire__('TextMessage', fakeDivTextMessage);
    Message.__Rewire__('QuizMessage', fakeDivQuizMessage);
    Message.__Rewire__('StatusMessage', fakeDivStatusMessage);
    Message.__Rewire__('ReplyMessage', fakeDivReplyMessage);
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    Message.__ResetDependency__('QuestionMessage');
    Message.__ResetDependency__('TextMessage');
    Message.__ResetDependency__('QuizMessage');
    Message.__ResetDependency__('StatusMessage');
    Message.__ResetDependency__('ReplyMessage');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  // test that it render text message
  it('Renders text message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'text',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Text:sth like content')).to.not.be.equal(null);
  });

  // test that it render status message
  it('Renders status message', function () {
    render(<Message message={{
      createdAt: 123,
      type: 'text',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Status:sth like content')).to.not.be.equal(null);
  });

  // test that it render mcq message
  it('Renders mcq message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'mcq',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Quiz:sth like content')).to.not.be.equal(null);
  });

  // test that it render saq message
  it('Renders saq message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'saq',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Quiz:sth like content')).to.not.be.equal(null);
  });

  // test that it render question message
  it('Renders question message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'question',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Question:sth like content')).to.not.be.equal(null);
  });

  // test that it render reply message
  it('Renders reply message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'reply',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Reply:sth like content')).to.not.be.equal(null);
  });

  // test that it render unknown type message
  it('Renders unknown type message', function () {
    render(<Message message={{
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'this is unknow type',
      content: 'sth like content'
    }}
    />);

    expect(screen.queryByText('sender name is this')).to.not.be.equal(null);
    expect(screen.queryByText('123')).to.not.be.equal(null);
    expect(screen.queryByText('Unknown message type: this is unknow type')).to.not.be.equal(null);
  });
});
