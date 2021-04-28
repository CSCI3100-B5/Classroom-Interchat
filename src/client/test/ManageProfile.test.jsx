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
import ManageProfile from '../account/ManageProfile.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';

describe('ManageProfile Component', function () {
  let fakeToast;
  let fakeupdateUserProfile;
  let fakesendEmail;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));

    const fakeupdateUserProfileresult = {
      success: true,
      response: {
        data: {
          name: 'user name is this',
          id: 'sender Id is this'
        }
      }
    };
    const fakesendEmailresult = {
      success: true
    };

    fakeupdateUserProfile = function () { return fakeupdateUserProfileresult; };

    fakesendEmail = function () { return fakesendEmailresult; };

    sinon.replace(ApiContext, 'useApi', () => ({
      updateUserProfile: fakeupdateUserProfile,
      sendEmail: fakesendEmail
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ManageProfile', function () {
    render(<ManageProfile />);
    expect(screen.findByText('Name')).to.not.be.equal(null);
    expect(screen.findByText('Email')).to.not.be.equal(null);
  });
});
