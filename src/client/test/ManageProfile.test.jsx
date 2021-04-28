/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// user-event allows us to fake inputs like typing and clicking buttons
import userEvent from '@testing-library/user-event';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

// import our component to be tested
import ManageProfile from '../account/ManageProfile.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

import { usefakeData } from './fakeEnv.jsx';

// all tests related to ManageProfile
describe('ManageProfile Component', function () {
  let fakeManageProfile;
  let fakeToast;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // the manageProfile function normally sends a request to backend
    // here we write a fake one to return hard-coded values for testing
    fakeManageProfile = sinon.fake((name, email) => {
      if (name === 'abcdef' && email === 'abc@gmail.com') {
        return new Promise((resolve) => {
          resolve({ success: true, response: { } });
        });
      }
      return new Promise((resolve) => {
        resolve({ success: false, response: { data: { message: 'Fake fail' } } });
      });
    });
    // the toast function normally display a notification on the screen
    // here we replace it with a "spy" function that does nothing but
    // records the values that it is called with
    fakeToast = sinon.spy();
    
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
    // restore the fake functions to their original
    sinon.restore();
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  // fill in the form with valid details and submit
  it('Log in with valid form input', async function () {
    render(<ManageProfile />);

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/name/i), 'abcdef');
    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');

    // simulate clicking the button
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakeManageProfile);
    sinon.assert.calledWith(fakeManageProfile, 'abcdef', 'abc@gmail.com');
  });

  // test invalid name
  it('Log in with valid form input', async function () {
    render(<ManageProfile />);

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/name/i), 'abc');
    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');

    // simulate clicking the button
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeManageProfile);
  });

  // test invalid email
  it('Log in with valid form input', async function () {
    render(<ManageProfile />);

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/name/i), 'abcdef');
    userEvent.type(screen.getByLabelText(/email/i), 'abc');

    // simulate clicking the button
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeManageProfile);
  });
  
  it('Renders ManageProfile', function () {
    render(<ManageProfile />);
    expect(screen.findByText('Name')).to.not.be.equal(null);
    expect(screen.findByText('Email')).to.not.be.equal(null);
  });

  // test valid email but already in use
});
