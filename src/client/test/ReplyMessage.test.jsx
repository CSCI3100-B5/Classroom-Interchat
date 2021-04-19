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
import ReplyMessage from '../classroom/session/chatbox/message/ReplyMessage.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

// all tests related to QuestionMessage
describe('QuestionMessage Component', function () {
  // assumption : data.messages always contain message to be send to QuestionMessage.jsx
  const fakeData = {
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
    }
  };

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)
    ReplyMessage.__Rewire__('useDataStore', function useDataStore() {
      return { data: fakeData };
    });
    // sinon.stub(DataStoreContext, 'useDataStore').returns(fakeData);
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    ReplyMessage.__ResetDependency__('useDataStore');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  // test that it render reply message
  it('Renders reply message', function () {
    render(<ReplyMessage message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        isResolved: false,
        content: 'sth like reply content',
        replyTo: 'messageId is this'
      }
    }}
    />);

    expect(screen.queryByText('Replying to sender name is this\'s Question')).to.not.be.equal(null);
    expect(screen.queryByText('sth like message content')).to.not.be.equal(null);
    expect(screen.queryByText('sth like reply content')).to.not.be.equal(null);
  });
});
