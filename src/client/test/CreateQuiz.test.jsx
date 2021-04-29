/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import CreateQuiz from '../classroom/session/chatbox/CreateQuiz.jsx';

import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('CreateQuiz Component', function () {
  let fakeToast;
  let fakesendQuiz;
  let fakeonBack;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeonBack = sinon.spy();

    fakeToast = sinon.spy();
    fakesendQuiz = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      sendQuiz: fakesendQuiz
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Create SAQ quiz', async function () {
    render(<CreateQuiz onBack={fakeonBack} />);

    userEvent.click(screen.getByRole('radio', { name: /Short Answer/i }));
    userEvent.type(screen.getByLabelText(/Prompt/i), 'This is a SAQ question?');
    userEvent.click(screen.getByRole('button', { name: /Send Quiz/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakesendQuiz);
    sinon.assert.calledWith(fakesendQuiz, {
      prompt: 'This is a SAQ question?',
      type: 'SAQ'
    });
  });

  it('Create MCQ quiz', async function () {
    render(<CreateQuiz onBack={fakeonBack} />);

    userEvent.click(screen.getByRole('radio', { name: /Multiple Choice/i }));
    userEvent.type(screen.getByLabelText(/Prompt/i), 'This is a MCQ question?');
    userEvent.type(screen.getByLabelText(/Choice 1/i), 'This is choice 1');
    userEvent.type(screen.getByLabelText(/Choice 2/i), 'This is choice 2');
    userEvent.type(screen.getByLabelText(/Choice 3/i), 'This is choice 3');
    userEvent.type(screen.getByLabelText(/Choice 4/i), 'This is choice 4');
    userEvent.click(screen.getByRole('checkbox', { name: /Checkbox for following text input/i }));
    userEvent.click(screen.getByRole('button', { name: /Send Quiz/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakesendQuiz);
    sinon.assert.calledWith(fakesendQuiz, {
      prompt: 'This is a MCQ question?',
      type: 'MCQ',
      choices: ['choice1', 'choice2', 'choice3', 'choice4'],
      correct: ['choice1correct'],
      multiSelect: false
    });
  });
});
