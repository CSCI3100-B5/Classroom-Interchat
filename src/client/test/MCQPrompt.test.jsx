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

import { usefakeData } from './fakeEnv.jsx';

// import our component to be tested
import MCQPrompt from '../classroom/session/chatbox/message/quiz/MCQPrompt.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('MCQPrompt Component', function () {
  let fakeToast;
  let fakeAnsMCQuiz;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeAnsMCQuiz = sinon.spy();
    fakeToast = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      AnsMCQuiz: fakeAnsMCQuiz
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
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
