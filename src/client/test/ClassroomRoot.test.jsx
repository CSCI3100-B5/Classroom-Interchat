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

// TODO: how to fake the useRouteMatch function in react-router-dom
import * as ReactRouter from 'react-router-dom';
import { usefakeData, sinonDefaultReturn } from './fakeEnv.jsx';

// import our component to be tested
import ClassroomRoot from '../classroom/index.jsx';

import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';
import * as SocketContext from '../contexts/SocketProvider.jsx';

import * as CreateClassroom from '../classroom/CreateClassroom.jsx';
import * as JoinClassroom from '../classroom/JoinClassroom.jsx';
import * as ClassroomSession from '../classroom/session/ClassroomSession.jsx';

import { renderWithRouter } from './test-utils.js';

describe('ClassroomRoot Component', function () {
  let fakeCreateClassroom;
  let fakeJoinClassroom;
  let fakeClassroomSession;
  let fakeRealtimeContext;
  let fakeSocketContext;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeCreateClassroom = sinonDefaultReturn(CreateClassroom, 'fake CreateClassroom content');
    fakeJoinClassroom = sinonDefaultReturn(JoinClassroom, 'fake JoinClassroom content');
    fakeClassroomSession = sinonDefaultReturn(ClassroomSession, 'fake ClassroomSession content');
    fakeRealtimeContext = function RealtimeProvider({ children }) {
      return (<div>{children}</div>);
    };
    fakeSocketContext = function SocketProvider({ children }) {
      return (<div>{children}</div>);
    };

    sinon.replace(RealtimeContext, 'RealtimeProvider', fakeRealtimeContext);
    sinon.replace(SocketContext, 'SocketProvider', fakeSocketContext);
    sinon.stub(ReactRouter, 'useRouteMatch').callsFake(function () { return { url: '/classroom', path: '/classroom' }; });
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ClassroomRoot', async function () {
    renderWithRouter(<ClassroomRoot />, { route: '/classroom' });
    expect(await screen.findByText('fake JoinClassroom content')).to.not.be.equal(null);
  });
});
