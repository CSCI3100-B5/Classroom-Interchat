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
import Auth from '../auth/Auth.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

import * as LoginBox from '../auth/LoginBox.jsx';
import * as SignupBox from '../auth/SignupBox.jsx';

import { renderWithRouter } from './test-utils.js';

describe('Auth Component', function () {
  let fakeData;
  let fakeLoginBox;
  let fakeSignupBox;
  let fakegetUserProfile;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeData = usefakeData();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData
    }));

    const fakeresult = {
      success: true
    };
    fakegetUserProfile = sinon.fake.returns(fakeresult);

    sinon.replace(ApiContext, 'useApi', () => ({
      getUserProfile: fakegetUserProfile
    }));

    fakeLoginBox = sinonDefaultReturn(LoginBox, 'fake LoginBox return');
    fakeSignupBox = sinonDefaultReturn(SignupBox, 'fake SignupBox return');
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders Auth without refresh token', async function () {
    renderWithRouter(<Auth />, { route: '/somePath' });
    expect(await screen.findByText('fake LoginBox return')).to.not.be.equal(null);
    expect(await screen.findByText('fake SignupBox return')).to.not.be.equal(null);
  });

  it('Renders Auth and jump to account page', async function () {
    fakeData.refreshToken = 'some refresh token';
    fakeData.user.id = 'tem id';
    renderWithRouter(<Auth />, { route: '/somePath' });
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakegetUserProfile);
    sinon.assert.calledWith(fakegetUserProfile, 'tem id');
    expect(window.location.pathname).to.be.equal('/account');
  });
});
