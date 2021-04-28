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
import { renderWithRouter } from './test-utils.js';

// import our component to be tested
import ChangePassword from '../account/ChangePassword.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import { sinonDefaultReturn, usefakeData } from './fakeEnv.jsx';

// all tests related to ChangePassword
describe('ChangePassword Component', () => {
  let fakeToast;
  let fakeChangePassword;
  let fakeupdateUserProfile;

  // before each test, set up the fake contexts
  beforeEach(() => {
    fakeToast = sinon.spy();

    const fakeupdateUserProfileresult = {
      success: true,
      response: {
        data: {
          name: 'user name is this',
          email: 'abc@gmail.com',
          id: 'sender Id is this'
        }
      }
    };

    // TODO: want a spy that also returns a value here
    fakeupdateUserProfile = sinon.stub().returns(fakeupdateUserProfileresult);

    sinon.replace(ApiContext, 'useApi', () => ({
      updateUserProfile: fakeupdateUserProfile,
    }));

    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));

    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(() => {
    // restore the fake functions to their original
    sinon.restore();
    // this needs to be done because faked function can't be replaced with
    // faked function, therefore we need to remove the fake before the next test
    // fake it again
  });

  // fill in the form with valid details and submit
  it('Change password with valid form input', async () => {
    renderWithRouter(<ChangePassword />, { route: '/account' });

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/old password/i), 'password1');
    userEvent.type(screen.getByLabelText(/new password/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password2');

    // simulate clicking the button
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakeChangePassword);
    sinon.assert.calledWith(fakeChangePassword, 'password1', 'password2', 'password2');
  });

  // testing invalid inputs: invalid old password
  it('Change password with invalid old password', async () => {
    render(<ChangePassword />);

    userEvent.type(screen.getByLabelText(/old password/i), 'pass');
    userEvent.type(screen.getByLabelText(/new password/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });

  // test invalid old password
  it('Change password with invalid old password', async () => {
    render(<ChangePassword />);

    userEvent.type(screen.getByLabelText(/old password/i), 'pass');
    userEvent.type(screen.getByLabelText(/new password/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });

  // test invalid new password
  it('Change password with invalid old password', async () => {
    render(<ChangePassword />);

    userEvent.type(screen.getByLabelText(/old password/i), 'password1');
    userEvent.type(screen.getByLabelText(/new password/i), 'pass');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'pass');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });

  // test valid but incorrect old password
  it('Change password with valid but incorrect old password', async () => {
    render(<ChangePassword />);

    userEvent.type(screen.getByLabelText(/old password/i), 'password');
    userEvent.type(screen.getByLabelText(/new password/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakeChangePassword);
    sinon.assert.calledWith(fakeChangePassword, 'password', 'password2', 'password2');

    // since fakeChangePassword returns a failure, we expect ChangePassword to display the error
    // to user by calling toast
    sinon.assert.calledOnce(fakeToast);
    // we expect toast to be called with the first parameter being 'error'
    // which shows the X error icon in the notification
    sinon.assert.calledWith(fakeToast, 'error');
  });

  // test valid but unequal new password
  it('Change password with valid but unequal new password', async () => {
    render(<ChangePassword />);

    userEvent.type(screen.getByLabelText(/old password/i), 'password1');
    userEvent.type(screen.getByLabelText(/new password/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password3');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakeChangePassword);
    sinon.assert.calledWith(fakeChangePassword, 'password1', 'password2', 'password3');

    // since fakeChangePassword returns a failure, we expect ChangePassword to display the error
    // to user by calling toast
    sinon.assert.calledOnce(fakeToast);
    // we expect toast to be called with the first parameter being 'error'
    // which shows the X error icon in the notification
    sinon.assert.calledWith(fakeToast, 'error');
  });
});
