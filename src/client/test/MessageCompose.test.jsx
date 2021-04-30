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
import MessageCompose from '../classroom/session/chatbox/MessageCompose.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('MessageCompose Component', function () {
  let fakeToast;
  let fakesendMessage;
  let fakegetSelfParticipant;
  let fakeonCreateQuiz;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeToast = sinon.spy();
    fakesendMessage = sinon.fake(
      (messageContent, messageInf) => new Promise(resolve => resolve())
    );
    fakegetSelfParticipant = sinon.stub().returns(null);
    fakeonCreateQuiz = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      sendMessage: fakesendMessage
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
      getSelfParticipant: fakegetSelfParticipant
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders MessageCompose', async function () {
    render(<MessageCompose onCreateQuiz={fakeonCreateQuiz} />);
    expect(await screen.findByPlaceholderText('Type your message...')).to.not.be.equal(null);
  });
});
