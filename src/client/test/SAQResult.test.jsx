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
import SAQResult from '../classroom/session/chatbox/message/quiz/SAQResult.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('SAQResult Component', function () {
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
    }
  };


  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeToast = sinon.spy();
    fakeansSAQuiz = sinon.spy();

    SAQResult.__Rewire__('useDataStore', function useDataStore() {
      return { data: fakeData };
    });
    SAQResult.__Rewire__('TokenAwarder', function fakeTokenAwarder({ userIds }) {
      return <div>tokenAwarder</div>;
    });
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    SAQResult.__ResetDependency__('useDataStore');
    SAQResult.__ResetDependency__('TokenAwarder');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders SAQResult', function () {
    render(<SAQResult message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null,
        correct: ['choice 1'],
        results: [{ content: 'abc' }]
      }
    }}
    />);

    expect(screen.queryByText('SAQ Quiz Results')).to.not.be.equal(null);
  });
});
