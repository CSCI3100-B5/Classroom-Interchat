/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  let fakeData;
  let fakecreateClassroom;
  let fakeToast;
  let fakelogout;

  // before each test, set up the fake contexts
  beforeEach(function () {
    const fakeresult = {
      success: true
    };

    fakecreateClassroom = sinon.fake.returns(fakeresult);
    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      createClassroom: fakecreateClassroom
    }));

    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    fakeData = usefakeData();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData
    }));

    fakelogout = sinon.fake.returns(fakeresult);
    sinon.replace(ApiContext, 'useApi', () => ({
      logout: fakelogout
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Show CreateClassroom page', async function () {
    fakeData.refreshToken = 'some refresh token';
    renderWithRouter(<CreateClassroom />, { route: '/somePath' });
    expect(await screen.findAllByText('Classroom Interchat')).to.not.be.equal(null);
    expect(await screen.findByText('Log out')).to.not.be.equal(null);
    expect(await screen.findAllByText('Create Classroom')).to.not.be.equal(null);
    expect(await screen.findByText('Want to join a classroom instead?')).to.not.be.equal(null);
    expect(await screen.findByText('Join Classroom')).to.not.be.equal(null);
  });

  it('click logout', async function () {
    fakeData.refreshToken = 'some refresh token';
    renderWithRouter(<CreateClassroom />, { route: '/somePath' });

    userEvent.click(screen.getByRole('button', { name: /Log out/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakelogout);
  });

  it('Create new classroom', async function () {
    fakeData.refreshToken = 'some refresh token';
    renderWithRouter(<CreateClassroom />, { route: '/somePath' });

    userEvent.type(screen.getByLabelText(/Classroom Name/i), 'this is input classroom name');
    userEvent.click(screen.getByRole('button', { name: /Create Classroom/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakecreateClassroom);
    sinon.assert.calledWith(fakecreateClassroom, 'this is input classroom name');
  });

  it('Redirect to join classroom', async function () {
    fakeData.refreshToken = 'some refresh token';
    fakeData.classroomMeta = null;
    renderWithRouter(<CreateClassroom />, { route: '/classroom' });

    userEvent.click(screen.getByRole('link', { name: /Join Classroom/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(window.location.pathname).to.be.equal('/classroom/join');
  });
});
