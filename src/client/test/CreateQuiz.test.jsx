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

import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('CreateQuiz Component', function () {
  let fakeToast;
  let fakesendQuiz;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

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

  it('Renders CreateQuiz', function () {
    render(<CreateQuiz onBack={sinon.spy()} />);

    expect(screen.queryByText('Send Quiz')).to.not.be.equal(null);
  });
});
