/* eslint-disable no-underscore-dangle */
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
import Account from '../account/Account.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

import * as LaunchApp from '../account/LaunchApp.jsx';
import * as ManageProfile from '../account/ManageProfile.jsx';
import * as ChangePassword from '../account/ChangePassword.jsx';
import * as ManageTokens from '../account/ManageTokens.jsx';

import { renderWithRouter } from './test-utils.js';


// all tests related to
describe('Account Component', function () {
  let fakeData;
  let fakeToast;
  let fakegetUserProfile;
  let fakegetUserProfileresult;
  let fakelogout;
  let fakeuplogoutresult;

  let fakeLaunchApp;
  let fakeManageProfile;
  let fakeChangePassword;
  let fakeManageTokens;

  beforeEach(function () {
    fakeData = usefakeData();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: fakeData }));

    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    fakegetUserProfileresult = {
      success: true,
      response: {
        data: {
          name: 'user name is this',
          email: 'abc@gmail.com',
          id: 'sender Id is this'
        }
      }
    };
    fakegetUserProfile = sinon.fake.returns(fakegetUserProfileresult);
    fakeuplogoutresult = {
      success: true,
    };
    fakelogout = sinon.fake(() => {
      // side effect of logout api
      fakeData.rememberMe = true;
      fakeData.accessToken = null;
      fakeData.refreshToken = null;
      fakeData.user = null;
      return fakeuplogoutresult;
    });
    sinon.replace(ApiContext, 'useApi', () => ({
      logout: fakelogout,
      getUserProfile: fakegetUserProfile
    }));

    fakeLaunchApp = sinonDefaultReturn(LaunchApp, 'fake LaunchApp content');
    fakeManageProfile = sinonDefaultReturn(ManageProfile, 'fake ManageProfile content');
    fakeChangePassword = sinonDefaultReturn(ChangePassword, 'fake ChangePassword content');
    fakeManageTokens = sinonDefaultReturn(ManageTokens, 'fake ManageTokens content');

    fakeData.accessToken = 'some accessToken';
    fakeData.refreshToken = 'some refreshToken';
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  // test that it render Account
  it('Renders Account', async function () {
    renderWithRouter(<Account />, { route: '/account' });
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(await screen.queryByText('Classroom Interchat')).to.not.be.equal(null);
    expect(await screen.queryByText('Log out')).to.not.be.equal(null);
    expect(await screen.queryAllByText('Launch App')).to.not.be.equal(null);
    expect(await screen.queryAllByText('Manage Profile')).to.not.be.equal(null);
    expect(await screen.queryAllByText('Change Password')).to.not.be.equal(null);
    expect(await screen.queryAllByText('Manage tokens')).to.not.be.equal(null);
  });

  it('Click on 4 tab', async function () {
    renderWithRouter(<Account />, { route: '/account' });

    userEvent.click(screen.getByRole('tab', { name: /Launch App/i }));
    expect(await screen.queryByText('fake LaunchApp content')).to.not.be.equal(null);
    userEvent.click(screen.getByRole('tab', { name: /Manage Profile/i }));
    expect(await screen.queryByText('fake ManageProfile content')).to.not.be.equal(null);
    userEvent.click(screen.getByRole('tab', { name: /Change Password/i }));
    expect(await screen.queryByText('fake ChangePassword content')).to.not.be.equal(null);
    userEvent.click(screen.getByRole('tab', { name: /Manage tokens/i }));
    expect(await screen.queryByText('fake ManageTokens content')).to.not.be.equal(null);
  });

  it('Click on logout', async function () {
    renderWithRouter(<Account />, { route: '/account' });
    await new Promise(resolve => setTimeout(resolve, 10));

    userEvent.click(screen.getByRole('button', { name: /Log out/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakelogout);
    expect(window.location.pathname).to.be.equal('/auth');
  });

  it('Load Account without user', async function () {
    fakeData.user = null;
    renderWithRouter(<Account />, { route: '/account' });

    expect(window.location.pathname).to.be.equal('/auth');
    sinon.assert.notCalled(fakegetUserProfile);
  });
});
