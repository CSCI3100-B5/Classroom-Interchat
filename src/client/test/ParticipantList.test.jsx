/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// user-event allows us to fake inputs like typing and clicking buttons
import userEvent from '@testing-library/user-event';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

import { usefakeData, sinonDefaultReturn } from './fakeEnv.jsx';

// import our component to be tested
import ParticipantList from '../classroom/session/info/ParticipantList.jsx';

// unsuccessful import for ParticipantList, because of unknown reason


import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';
import * as TokenAwarder from '../classroom/session/TokenAwarder.jsx';


describe('ParticipantList Component', function () {
  // fake functions for the tests to measure
  let fakeToast;
  let fakeData;
  let fakegetSelfParticipant;
  let fakeTokenAwarder;

  let fakerequestPermission;
  let fakecancelRequestPermission;
  let fakepromoteParticipant;
  let fakedemoteParticipant;
  let fakekickParticipant;
  let faketoggleMuteParticipant;
  let faketoggleGlobalMute;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakegetSelfParticipant = sinon.stub().returns(null);
    fakeData = usefakeData();
    fakeToast = sinon.spy();

    fakerequestPermission = sinon.stub().returns(new Promise(resolve => resolve()));
    fakecancelRequestPermission = sinon.stub().returns(new Promise(resolve => resolve()));
    fakepromoteParticipant = sinon.stub().returns(new Promise(resolve => resolve()));
    fakedemoteParticipant = sinon.stub().returns(new Promise(resolve => resolve()));
    fakekickParticipant = sinon.stub().returns(new Promise(resolve => resolve()));
    faketoggleMuteParticipant = sinon.stub().returns(new Promise(resolve => resolve()));
    faketoggleGlobalMute = sinon.stub().returns(new Promise(resolve => resolve()));

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      requestPermission: fakerequestPermission,
      cancelRequestPermission: fakecancelRequestPermission,
      promoteParticipant: fakepromoteParticipant,
      demoteParticipant: fakedemoteParticipant,
      kickParticipant: fakekickParticipant,
      toggleMuteParticipant: faketoggleMuteParticipant,
      toggleGlobalMute: faketoggleGlobalMute
    }));

    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData,
      getSelfParticipant: fakegetSelfParticipant
    }));
    fakeTokenAwarder = sinonDefaultReturn(TokenAwarder, 'TokenAwarder return');
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ParticipantList', async function () {
    render(<ParticipantList onCloseParticipantList={sinon.spy()} />);

    expect(screen.queryByText('Copy invite link')).to.not.be.equal(null);
    expect(await screen.findByText('Link copied!')).to.not.be.equal(null);
  });
});
