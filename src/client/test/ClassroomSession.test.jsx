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
  let fakeClassroomInfo;
  let fakeChatBox;
  let fakeParticipantList;

  // before each test, set up the fake contexts
  beforeEach(function () {
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));
    fakeClassroomInfo = sinonDefaultReturn(ClassroomInfo, 'ClassroomInfo return');
    fakeChatBox = sinonDefaultReturn(ChatBox, 'ChatBox return');
    fakeParticipantList = sinonDefaultReturn(ParticipantList, 'ParticipantList return');
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ClassroomSession', async function () {
    renderWithRouter(<ClassroomSession />, { route: '/somePath' });
    expect(await screen.findByText('ClassroomInfo return')).to.not.be.equal(null);
    expect(await screen.findByText('ParticipantList return')).to.not.be.equal(null);
  });
});
