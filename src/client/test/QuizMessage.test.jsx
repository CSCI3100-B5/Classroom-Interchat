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
import QuizMessage from '../classroom/session/chatbox/message/quiz/QuizMessage.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('MCQPrompt Component', function () {
  let fakeToast;
  let fakeData;
  let fakeendQuiz;
  let fakereleaseResults;

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

  const fakeDiv = function QuestionMessage({ message }) {
    return (<div> div </div>);
  };

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeToast = sinon.spy();
    fakeendQuiz = sinon.spy();
    fakereleaseResults = sinon.spy();

    QuizMessage.__Rewire__('useRealtime', function useRealtime() {
      return { endQuiz: fakeendQuiz, releaseResults: fakereleaseResults };
    });
    QuizMessage.__Rewire__('useDataStore', function useDataStore() {
      return { data: fakeData };
    });
    QuizMessage.__Rewire__('useToast', function useDataStore() {
      return { toast: fakeToast };
    });
    QuizMessage.__Rewire__('TokenAwarder', function fakeTokenAwarder({ userIds }) {
      return <div>tokenAwarder</div>;
    });
    QuizMessage.__Rewire__('SAQPrompt', fakeDiv);
    QuizMessage.__Rewire__('SAQResult', fakeDiv);
    QuizMessage.__Rewire__('MCQPrompt', fakeDiv);
    QuizMessage.__Rewire__('MCQResult', fakeDiv);
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    // restore the fake functions to their original
    sinon.restore();
    QuizMessage.__ResetDependency__('useRealtime');
    QuizMessage.__ResetDependency__('useDataStore');
    QuizMessage.__ResetDependency__('useToast');
    QuizMessage.__ResetDependency__('TokenAwarder');
    QuizMessage.__ResetDependency__('SAQPrompt');
    QuizMessage.__ResetDependency__('SAQResult');
    QuizMessage.__ResetDependency__('MCQPrompt');
    QuizMessage.__ResetDependency__('MCQResult');
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  it('Renders QuizMessage', function () {
    render(<QuizMessage message={{
      id: 'message is this',
      sender: 'sender Id is this',
      type: 'saq',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null,
        results: null,
        correct: null,
        resultsReleased: null
      }
    }}
    />);

    expect(screen.queryByText('End quiz')).to.not.be.equal(null);
  });
});
