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
import MessageCompose from '../classroom/session/chatbox/MessageCompose.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('MessageCompose Component', function () {
  let fakeToast;
  let fakeData;
  let fakesendMessage;
  let fakegetSelfParticipant;

  fakeData = {
    messages: [
      {
        id: 'messageId is this',
        sender: {
          name: 'sender name is this'
        },
        type: 'Question',
        content: {
          isResolved: false,
          content: 'sth like message content'
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
    },
    classroomMeta: {
      closedAt: null
    }
  };

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeToast = sinon.spy();
    fakesendMessage = sinon.spy();
    fakegetSelfParticipant = sinon.spy();

    MessageCompose.__Rewire__('useDataStore', () => ({ data: fakeData, getSelfParticipant: fakegetSelfParticipant }));
    MessageCompose.__Rewire__('useRealtime', () => ({ sendMessage: fakesendMessage }));
    MessageCompose.__Rewire__('useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    MessageCompose.__ResetDependency__('useDataStore');
    MessageCompose.__ResetDependency__('useRealtime');
    MessageCompose.__ResetDependency__('useToast');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders MessageCompose', function () {
    render(<MessageCompose />);

    expect(screen.queryByText('Type your message...')).to.not.be.equal(null);
  });
});
