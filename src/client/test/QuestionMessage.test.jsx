/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// user-event allows us to fake inputs like typing and clicking buttons
import userEvent from '@testing-library/user-event';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import QuestionMessage from '../classroom/session/chatbox/message/QuestionMessage.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

// all tests related to QuestionMessage
describe('QuestionMessage Component', function () {
  // fake functions for the tests to measure
  let fakeResolveQuestion;
  let fakeToast;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeResolveQuestion = sinon.fake((messageId) => {
      if (messageId === 'messageId is this') {
        // simulate successful resolve by setting the message isResolved
        // data.messages.find((msg) => (msg.id === 'messageId is this'));

        return new Promise((resolve) => {
          resolve({ success: true, response: { } });
        });
      }
      // throw error to similate cannot resolve question because server error
      const ex = { error: 'fake error' };
      throw ex;
    });
    // the toast function normally display a notification on the screen
    // here we replace it with a "spy" function that does nothing but
    // records the values that it is called with
    fakeToast = sinon.spy();

    // assumption : data.messages always contain message to be send to QuestionMessage.jsx
    const fakeData = {
      messages: [
        {
          id: 'messageId is this',
          sender: 'sender Id is this',
          type: 'Question',
          content: {
            isResolved: false,
            content: 'sth like question content'
          }
        },
        {
          id: 'reply Id 1',
          sender: 'sender Id 1',
          type: 'reply',
          content: {
            replyTo: 'messageId is this'
          }
        },
        {
          id: 'reply Id 2',
          sender: 'sender Id 2',
          type: 'reply',
          content: {
            replyTo: 'messageId is this'
          }
        },
        {
          id: 'reply Id 3',
          sender: 'sender Id 3',
          type: 'reply',
          content: {
            replyTo: 'messageId is NOT this'
          }
        },
      ],
      messageFilter: null,
      replyToMessageId: null,
      user: {
        id: 'sender Id is this'
      }
    };

    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)
    sinon.replace(RealtimeContext, 'useRealtime', () => ({ resolveQuestion: fakeResolveQuestion }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: fakeData }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  // test that it render not resolved question (sender)
  it('Renders unresolved Questions (sender)', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'sender Id is this',
      content: {
        isResolved: false,
        content: 'sth like question content'
      }
    }}
    />);

    expect(screen.queryByText('QUESTION')).to.not.be.equal(null);
    expect(screen.getByRole('button', { name: /Resolve Question/i })).to.not.be.equal(null);
    expect(screen.getByRole('button', { name: /Reply/i })).to.not.be.equal(null);
    expect(screen.queryByText('sth like question content')).to.not.be.equal(null);
    expect(screen.getByRole('checkbox', { name: /2 replies/i })).to.not.be.equal(null);
  });

  // test that it render not resolved question (sender)
  it('Renders resolved Questions (sender)', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'sender Id is this',
      content: {
        isResolved: true,
        content: 'sth like question content'
      }
    }}
    />);

    expect(screen.queryByText('RESOLVED')).to.not.be.equal(null);
    expect(screen.queryByText('sth like question content')).to.not.be.equal(null);
    expect(screen.getByRole('checkbox', { name: /2 replies/i })).to.not.be.equal(null);
  });

  // test that it render not resolved question (other)
  it('Renders unresolved Questions (other)', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'other sender',
      content: {
        isResolved: false,
        content: 'sth like question content'
      }
    }}
    />);

    expect(screen.queryByText('QUESTION')).to.not.be.equal(null);
    expect(screen.getByRole('button', { name: /Reply/i })).to.not.be.equal(null);
    expect(screen.queryByText('sth like question content')).to.not.be.equal(null);
    expect(screen.getByRole('checkbox', { name: /2 replies/i })).to.not.be.equal(null);
  });

  // test that it render Resolved question (other)
  it('Renders resolved Questions (other)', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'other sender',
      content: {
        isResolved: true,
        content: 'sth like question content'
      }
    }}
    />);

    expect(screen.queryByText('RESOLVED')).to.not.be.equal(null);
    expect(screen.queryByText('sth like question content')).to.not.be.equal(null);
    expect(screen.getByRole('checkbox', { name: /2 replies/i })).to.not.be.equal(null);
  });

  // test that user resolves question successfully
  it('resolve question', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'sender Id is this',
      content: {
        isResolved: false,
        content: 'sth like question content'
      }
    }}
    />);

    // simulate clicking the resolve button
    userEvent.click(screen.getByRole('button', { name: /Resolve Question/i }));

    // sinon's fake functions remember how many times they have been called
    sinon.assert.calledOnce(fakeResolveQuestion);
    sinon.assert.calledWith(fakeResolveQuestion, 'messageId is this');
  });

  // test that user resolves question with error in server
  it('resolve question but throwed', function () {
    render(<QuestionMessage message={{
      id: 'incorrect messageId',
      sender: 'sender Id is this',
      content: {
        isResolved: false,
        content: 'sth like question content'
      }
    }}
    />);

    // simulate clicking the resolve button
    userEvent.click(screen.getByRole('button', { name: /Resolve Question/i }));

    // sinon's fake functions remember how many times they have been called
    sinon.assert.calledOnce(fakeResolveQuestion);
    sinon.assert.calledWith(fakeResolveQuestion, 'incorrect messageId');

    // expect toast to be called with error
    sinon.assert.calledOnce(fakeToast);
    sinon.assert.calledWith(fakeToast, 'error');
  });

  // test that it could setup reply
  it('setup reply', function () {
    render(<QuestionMessage message={{
      id: 'messageId is this',
      sender: 'sender Id is this',
      content: {
        isResolved: false,
        content: 'sth like question content'
      }
    }}
    />);

    // simulate clicking the resolve button
    userEvent.click(screen.getByRole('button', { name: /Reply/i }));

    // kind of meaningless with blackbox testing, where vaiable inside is not tested
    // at least the user can click it
  });
});
