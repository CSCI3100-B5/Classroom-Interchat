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
import QuizMessage from '../classroom/session/chatbox/message/quiz/QuizMessage.jsx';

import * as SAQPrompt from '../classroom/session/chatbox/message/quiz/SAQPrompt.jsx';
import * as SAQResult from '../classroom/session/chatbox/message/quiz/SAQResult.jsx';
import * as MCQPrompt from '../classroom/session/chatbox/message/quiz/MCQPrompt.jsx';
import * as MCQResult from '../classroom/session/chatbox/message/quiz/MCQResult.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('QuizMessage Component', function () {
  let fakeSAQPrompt;
  let fakeSAQResult;
  let fakeMCQPrompt;
  let fakeMCQResult;

  let fakeToast;
  let fakeendQuiz;
  let fakereleaseResults;


  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeSAQPrompt = sinonDefaultReturn(SAQPrompt, 'SAQPrompt return');
    fakeSAQResult = sinonDefaultReturn(SAQResult, 'SAQResult return');
    fakeMCQPrompt = sinonDefaultReturn(MCQPrompt, 'MCQPrompt return');
    fakeMCQResult = sinonDefaultReturn(MCQResult, 'MCQResult return');

    fakeToast = sinon.spy();
    fakeendQuiz = sinon.spy();
    fakereleaseResults = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      endQuiz: fakeendQuiz,
      releaseResults: fakereleaseResults
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
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
