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
import MCQPrompt from '../classroom/session/chatbox/message/quiz/MCQPrompt.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('MCQPrompt Component', function () {
  let fakeToast;
  let fakeData;
  let fakeAnsMCQuiz;

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

    fakeAnsMCQuiz = sinon.fake((classroomId) => {
      if (classroomId === '606eaf55a406552de05d996a') {
        return new Promise((resolve) => {
          resolve({
            id: '606eaf55a406552de05d996a'
          });
        });
      }
      return new Promise((resolve, reject) => {
        reject({ error: 'test error' });
      });
    });

    fakeToast = sinon.spy();

    MCQPrompt.__Rewire__('useRealtime', function useRealtime() {
      return { ansMCQuiz: fakeAnsMCQuiz };
    });
    MCQPrompt.__Rewire__('useDataStore', function useDataStore() {
      return { data: fakeData };
    });
    MCQPrompt.__Rewire__('useToast', function useDataStore() {
      return { toast: fakeToast };
    });
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    MCQPrompt.__ResetDependency__('useRealtime');
    MCQPrompt.__ResetDependency__('useDataStore');
    MCQPrompt.__ResetDependency__('useToast');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders MCQPrompt', function () {
    render(<MCQPrompt message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null
      }
    }}
    />);

    expect(screen.queryByText('Submit answer')).to.not.be.equal(null);
  });
});
