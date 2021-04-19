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
import ChatBox from '../classroom/session/chatbox/ChatBox.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('ChatBox Component', function () {
  let fakeToast;
  let fakeData;
  let fakeansSAQuiz;

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

  const fakeDivMessageList = function QuestionMessage() {
    return (
      <div>
        fakeDivMessageList
      </div>
    );
  };
  const fakeDivMessageCompose = function QuestionMessage() {
    return (
      <div>
        fakeDivMessageCompose
      </div>
    );
  };
  const fakeDivCreateQuiz = function QuestionMessage() {
    return (
      <div>
        fakeDivCreateQuiz
      </div>
    );
  };

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeToast = sinon.spy();

    ChatBox.__Rewire__('useDataStore', function useDataStore() {
      return { data: fakeData };
    });
    ChatBox.__Rewire__('MessageList', fakeDivMessageList);
    ChatBox.__Rewire__('MessageCompose', fakeDivMessageCompose);
    ChatBox.__Rewire__('CreateQuiz', fakeDivCreateQuiz);
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    ChatBox.__ResetDependency__('useDataStore');
    ChatBox.__ResetDependency__('MessageList');
    ChatBox.__ResetDependency__('MessageCompose');
    ChatBox.__ResetDependency__('CreateQuiz');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders ChatBox', function () {
    render(<ChatBox />);

    expect(screen.queryByText('fakeDivMessageList')).to.not.be.equal(null);
  });
});
