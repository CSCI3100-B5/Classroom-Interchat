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
import ChangePassword from '../account/ChangePassword,jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

// all tests related to ChangePassword
describe('ChangePassword Component', function (){
  let fakeToast;
  let fakeChangePassword;
  
  // before each test, set up the fake contexts
  beforeEach(function() {
    fakeChangePassword = sinon.fake((oldPassword, newPassword, confirmPassword) => {
      if (oldPassword === 'password1' && newPassword === 'password2' && newPassword === confirmPassword) {
        return new Promise((resolve) => {
        resolve({ sucess: true, response: {} });
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

    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)
    // the useApi function lives in ApiContext, we are replacing it with a fake
    // one that returns our fake login function
    sinon.replace(ApiContext, 'useApi', () => ({ login: fakeLogin }));
    // same for useToast
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    // replace the useDataStore function to return fake data
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: { rememberMe: true } }));
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
  it('Change password with valid form input', async function() {
    renderWithRouter(<ChangePassword />, { route: '/account' });

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'password1');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'password2');

    // simulate clicking the button
    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.calledOnce(fakeChangePassword);
    sinon.assert.calledWith(fakeChangePassword, 'password1', 'password2', 'password2');
  });

  // testing invalid inputs: invalid old password
  it('Change password with invalid old password', async function () {
    render(<ChangePassword />);
    
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'pass');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });

  // test invalid old password
  it('Change password with invalid old password', async function () {
    render(<ChangePassword />);
    
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'pass');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });
  
  // test invalid new password
  it('Change password with invalid old password', async function () {
    render(<ChangePassword />);
    
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'password1');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'pass');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'pass');

    userEvent.click(screen.getByRole('button', { name: /save changes/i }));

    await new Promise(resolve => setTimeout(resolve, 500));

    sinon.assert.notCalled(fakeChangePassword);
  });

  // test valid but incorrect old password
  it('Change password with valid but incorrect old password', async function () {
    render(<ChangePassword />);
    
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'password');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'password2');

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
  it('Change password with valid but unequal new password', async function () {
    render(<ChangePassword />);
    
    userEvent.type(screen.getByLabelText(/oldPassword/i), 'password1');
    userEvent.type(screen.getByLabelText(/newPassword/i), 'password2');
    userEvent.type(screen.getByLabelText(/confirmPassword/i), 'password3');

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
