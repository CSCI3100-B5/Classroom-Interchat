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

import { usefakeData } from './fakeEnv.jsx';

// import our component to be tested
import SignupBox from '../auth/SignupBox.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';

import { renderWithRouter } from './test-utils.js';

describe('SignupBox Component', function () {
  let fakeToast;
  let fakelogin;
  let fakesignup;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeToast = sinon.spy();
    const fakeresult = {
      success: true
    };
    fakelogin = function () { return fakeresult; };
    fakesignup = function () { return fakeresult; };

    sinon.replace(ApiContext, 'useApi', () => ({
      login: fakelogin,
      signup: fakesignup
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders SignupBox', async function () {
    renderWithRouter(<SignupBox />, { route: '/somePath' });
    expect(await screen.findByText('Name')).to.not.be.equal(null);
    expect(await screen.findByText('Email')).to.not.be.equal(null);
    expect(await screen.findByText('Password')).to.not.be.equal(null);
    expect(await screen.findByText('Confirm Password')).to.not.be.equal(null);
  });
});
