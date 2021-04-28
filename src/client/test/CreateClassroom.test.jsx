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
import CreateClassroom from '../classroom/CreateClassroom.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

import { renderWithRouter } from './test-utils.js';

describe('CreateClassroom Component', function () {
  let fakecreateClassroom;
  let fakeToast;
  let fakelogout;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakecreateClassroom = sinon.spy();
    fakeToast = sinon.spy();
    fakelogout = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      createClassroom: fakecreateClassroom
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData()
    }));
    sinon.replace(ApiContext, 'useApi', () => ({
      logout: fakelogout
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders CreateClassroom', function () {
    renderWithRouter(<CreateClassroom />, { route: '/somePath' });
    expect(screen.findByText('Classroom Interchat')).to.not.be.equal(null);
    expect(screen.findByText('Log out')).to.not.be.equal(null);
    expect(screen.findByText('Create Classroom')).to.not.be.equal(null);
    expect(screen.findByText('Want to join a classroom instead?')).to.not.be.equal(null);
    expect(screen.findByText('Join Classroom')).to.not.be.equal(null);
  });
});
