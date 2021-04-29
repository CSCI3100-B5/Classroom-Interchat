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
import ClassroomSession from '../classroom/session/ClassroomSession.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ClassroomInfo from '../classroom/session/info/ClassroomInfo.jsx';
import * as ChatBox from '../classroom/session/chatbox/ChatBox.jsx';
import * as ParticipantList from '../classroom/session/info/ParticipantList.jsx';
import { renderWithRouter } from './test-utils.js';

describe('ClassroomSession Component', function () {
  let fakeData;
  let fakeClassroomInfo;
  let fakeChatBox;
  let fakeParticipantList;

  let onShowParticipantListHandle;
  let onCloseParticipantListHandle;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeData = usefakeData();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData
    }));

    sinon.stub(ClassroomInfo, 'default').callsFake(({ onShowParticipantList }) => {
      onShowParticipantListHandle = onShowParticipantList;
      return <div>ClassroomInfo return</div>;
    });
    fakeChatBox = sinonDefaultReturn(ChatBox, 'ChatBox return');
    sinon.stub(ParticipantList, 'default').callsFake(({ onCloseParticipantList }) => {
      onCloseParticipantListHandle = onCloseParticipantList;
      return <div>ParticipantList return</div>;
    });
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('show chatBox', async function () {
    fakeData.refreshToken = 'some refresh token';

    renderWithRouter(<ClassroomSession />, { route: '/somePath' });
    expect(await screen.findByText('ClassroomInfo return')).to.not.be.equal(null);
    expect(await screen.findByText('ChatBox return')).to.not.be.equal(null);
  });

  it('show ParticipantList and close it', async function () {
    fakeData.refreshToken = 'some refresh token';

    renderWithRouter(<ClassroomSession />, { route: '/somePath' });

    onShowParticipantListHandle();
    expect(await screen.findByText('ParticipantList return')).to.not.be.equal(null);

    onCloseParticipantListHandle();
    expect(await screen.findByText('ChatBox return')).to.not.be.equal(null);
  });
});
