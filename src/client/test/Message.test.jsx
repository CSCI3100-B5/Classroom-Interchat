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

import { usefakeData, sinonDefaultReturn } from './fakeEnv.jsx';

// import our component to be tested
import Message from '../classroom/session/chatbox/message/Message.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as TextMessage from '../classroom/session/chatbox/message/TextMessage.jsx';
import * as QuestionMessage from '../classroom/session/chatbox/message/QuestionMessage.jsx';
import * as QuizMessage from '../classroom/session/chatbox/message/quiz/QuizMessage.jsx';
import * as StatusMessage from '../classroom/session/chatbox/message/StatusMessage.jsx';
import * as ReplyMessage from '../classroom/session/chatbox/message/ReplyMessage.jsx';

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';


// all tests related to Message
describe('Message Component', function () {
  let fakeTextMessage;
  let fakeQuestionMessage;
  let fakeQuizMessage;
  let fakeStatusMessage;
  let fakeReplyMessage;

  beforeEach(function () {
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));

    fakeTextMessage = sinonDefaultReturn(TextMessage, 'fake TextMessage content');
    // fakeTextMessage = sinon.stub(TextMessage, 'default').returns(<div>fake TextMessage content</div>);
    fakeQuestionMessage = sinon.stub(QuestionMessage, 'default').returns(<div>fake QuestionMessage content</div>);
    fakeQuizMessage = sinon.stub(QuizMessage, 'default').returns(<div>fake QuizMessage content</div>);
    fakeStatusMessage = sinon.stub(StatusMessage, 'default').returns(<div>fake StatusMessage content</div>);
    fakeReplyMessage = sinon.stub(ReplyMessage, 'default').returns(<div>fake ReplyMessage content</div>);
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  // test that it render text message
  it('Renders text message', function () {
    const message = {
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'text',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeTextMessage);
    sinon.assert.calledWith(fakeTextMessage, { message });
    expect(screen.queryByText('fake TextMessage content')).to.not.be.equal(null);
  });

  // test that it render status message
  it('Renders status message', function () {
    const message = {
      createdAt: 123,
      type: 'text',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeStatusMessage);
    sinon.assert.calledWith(fakeStatusMessage, { message });
    expect(screen.queryByText('fake StatusMessage content')).to.not.be.equal(null);
  });

  // test that it render mcq message
  it('Renders mcq message', function () {
    const message = {
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'mcq',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeQuizMessage);
    sinon.assert.calledWith(fakeQuizMessage, { message });
    expect(screen.queryByText('fake QuizMessage content')).to.not.be.equal(null);
  });

  // test that it render saq message
  it('Renders saq message', function () {
    const message = {
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'saq',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeQuizMessage);
    sinon.assert.calledWith(fakeQuizMessage, { message });
    expect(screen.queryByText('fake QuizMessage content')).to.not.be.equal(null);
  });

  // test that it render question message
  it('Renders question message', function () {
    const message = {
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'question',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeQuestionMessage);
    sinon.assert.calledWith(fakeQuestionMessage, { message });
    expect(screen.queryByText('fake QuestionMessage content')).to.not.be.equal(null);
  });

  // test that it render reply message
  it('Renders reply message', function () {
    const message = {
      sender: {
        name: 'sender name is this'
      },
      createdAt: 123,
      type: 'reply',
      content: 'sth like content'
    };
    render(<Message message={message} />);

    sinon.assert.calledOnce(fakeReplyMessage);
    sinon.assert.calledWith(fakeReplyMessage, { message });
    expect(screen.queryByText('fake ReplyMessage content')).to.not.be.equal(null);
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

    expect(screen.queryByText('Unknown message type: this is unknow type')).to.not.be.equal(null);
  });
});
