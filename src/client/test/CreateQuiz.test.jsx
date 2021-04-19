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
import CreateQuiz from '../classroom/session/chatbox/CreateQuiz.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('CreateQuiz Component', function () {
  let fakeToast;
  let fakeData;
  let fakesendQuiz;

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
    fakesendQuiz = sinon.spy();

    CreateQuiz.__Rewire__('useDataStore', () => ({ data: fakeData }));
    CreateQuiz.__Rewire__('useRealtime', () => ({ sendQuiz: fakesendQuiz }));
    CreateQuiz.__Rewire__('useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    CreateQuiz.__ResetDependency__('useDataStore');
    CreateQuiz.__ResetDependency__('useRealtime');
    CreateQuiz.__ResetDependency__('useToast');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders CreateQuiz', function () {
    render(<CreateQuiz />);

    expect(screen.queryByText('Send Quiz')).to.not.be.equal(null);
  });
});
