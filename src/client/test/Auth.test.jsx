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
  let fakeLoginBox;
  let fakeSignupBox;
  let fakegetUserProfile;

  // before each test, set up the fake contexts
  beforeEach(function () {
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));

    const fakeresult = {
      success: true
    };
    fakegetUserProfile = function () { return fakeresult; };

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

  it('Renders Auth', async function () {
    renderWithRouter(<Auth />, { route: '/somePath' });
    expect(await screen.findByText('fake LoginBox return')).to.not.be.equal(null);
    expect(await screen.findByText('fake SignupBox return')).to.not.be.equal(null);
  });
});
