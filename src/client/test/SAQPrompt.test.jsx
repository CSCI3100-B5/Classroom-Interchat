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

import SAQPrompt from '../classroom/session/chatbox/message/quiz/SAQPrompt.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('SAQPrompt Component', function () {
  let fakeToast;
  let fakeansSAQuiz;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeToast = sinon.spy();
    fakeansSAQuiz = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      ansSAQuiz: fakeansSAQuiz,
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders SAQPrompt', function () {
    render(<SAQPrompt message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null,
        correct: ['choice 1']
      }
    }}
    />);

    expect(screen.queryByText('this is quiz prompt')).to.not.be.equal(null);
  });
});
