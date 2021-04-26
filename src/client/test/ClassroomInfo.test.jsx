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

import { usefakeData } from './fakeEnv.jsx';

// import our component to be tested
import ClassroomInfo from '../classroom/session/info/ClassroomInfo.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('ClassroomInfo Component', function () {
  // fake functions for the tests to measure
  let fakeToast;
  let fakeData;
  let fakegetSelfParticipant;
  let fakeleaveClassroom;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakegetSelfParticipant = sinon.stub().returns(null);
    fakeData = usefakeData();
    fakeleaveClassroom = sinon.stub().returns(new Promise(resolve => resolve()));
    fakeToast = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({ leaveClassroom: fakeleaveClassroom }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData,
      getSelfParticipant: fakegetSelfParticipant
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ClassroomInfo', function () {
    render(<ClassroomInfo onShowParticipantList={sinon.spy()} />);

    expect(screen.queryByText('name in classroomMeta')).to.not.be.equal(null);
    expect(screen.queryByText('user name is this')).to.not.be.equal(null);
  });
});
