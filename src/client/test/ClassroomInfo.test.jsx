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
  let fakegetSelfParticipantresult;
  let fakeleaveClassroom;
  let onShowParticipantList;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakegetSelfParticipantresult = {
      name: 'Self name',
      email: 'self@gmail.com',
      id: 'self Id',
      permission: 'student'
    };
    fakeData = usefakeData();
    fakegetSelfParticipant = sinon.stub().returns(fakegetSelfParticipantresult);
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData,
      getSelfParticipant: fakegetSelfParticipant
    }));

    fakeleaveClassroom = sinon.stub().returns(new Promise(resolve => resolve()));
    sinon.replace(RealtimeContext, 'useRealtime', () => ({ leaveClassroom: fakeleaveClassroom }));

    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    onShowParticipantList = sinon.spy();

    fakeData.classroomMeta.name = 'this is a new classroom name';
    fakeData.user.name = 'this is a new user name';
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Show ClassroomInfo', function () {
    render(<ClassroomInfo onShowParticipantList={onShowParticipantList} />);

    const participantsLength = fakeData.participants.length;
    expect(screen.queryByText('this is a new classroom name')).to.not.be.equal(null);
    expect(screen.queryByText('this is a new user name')).to.not.be.equal(null);
    expect(screen.queryByText(participantsLength.toString().concat(' participants'))).to.not.be.equal(null);

    userEvent.click(screen.getByRole('button', { name: /participant/i }, { exact: false }));

    sinon.assert.calledOnce(onShowParticipantList);
  });

  it('Requesting permission', function () {
    fakegetSelfParticipantresult.permission = 'requesting';
    render(<ClassroomInfo onShowParticipantList={onShowParticipantList} />);

    expect(screen.findByText('requesting for instructor permission')).to.not.be.equal(null);
  });

  it('show unresolved question and set filer', function () {
    render(<ClassroomInfo onShowParticipantList={onShowParticipantList} />);

    const unresolvedQuestionsLength = fakeData.messages.filter(x => x.type === 'question' && !x.content.isResolved).length;
    const queryText = unresolvedQuestionsLength.toString().concat(' unresolved questions');
    expect(screen.findByText(queryText)).to.not.be.equal(null);
  });

  it('show ongoing quiz and set filer', function () {
    render(<ClassroomInfo onShowParticipantList={onShowParticipantList} />);

    const ongoingQuizzesLength = fakeData.messages.filter(x => ['mcq', 'saq'].includes(x.type) && !x.content.closedAt).length;
    expect(screen.findByText(ongoingQuizzesLength.toString().concat(' ongoing quizzes'))).to.not.be.equal(null);
  });

  it('view specific thread', function () {
    fakeData.messageFilter = 'messageId is this';
    render(<ClassroomInfo onShowParticipantList={onShowParticipantList} />);

    expect(screen.findByText('Viewing sender name is this &apos;s thread')).to.not.be.equal(null);
  });
});
