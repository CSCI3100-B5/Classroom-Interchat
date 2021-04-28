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
import Logout from '../account/Logout.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';

import { renderWithRouter } from './test-utils.js';

describe('Logout Conponent', function () {
  // before each test, set up the fake contexts
  let fakeData;
  beforeEach(function () {
    fakeData = usefakeData();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: fakeData
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('click on Logout', function () {
    renderWithRouter(<Logout />, { route: '/somePath' });

    expect(screen.findByText('Logout')).to.not.be.equal(null);

    fakeData.rememberMe = false;
    fakeData.accessToken = 'some accessToken';
    fakeData.refreshToken = 'some refreshToken';
    fakeData.user = 'some user';

    userEvent.click(screen.getByRole('button', { name: /Logout/i }));

    expect(fakeData.rememberMe).equal(true);
    expect(fakeData.accessToken).equal(null);
    expect(fakeData.refreshToken).equal(null);
    expect(fakeData.user).equal(null);
  });
});
