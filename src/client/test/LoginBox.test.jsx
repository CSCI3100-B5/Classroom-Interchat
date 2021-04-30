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
import LoginBox from '../auth/LoginBox.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
// This is to fake the react router context
// which makes the component believe it is living in the /auth page
// and allows the component to browse to another page
import { renderWithRouter } from './test-utils.js';

// all tests related to LoginBox
describe('LoginBox Component', function () {
  // fake functions for the tests to measure
  let fakeLogin;
  let fakeToast;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // the login function normally sends a request to backend
    // here we write a fake one to return hard-coded values for testing
    fakeLogin = sinon.fake((email, password) => {
      if (email === 'abc@gmail.com' && password === 'password') {
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

  // test that the remember me checkbox respond to data change
  it('Initialize remember me to match data', function () {
    // draw the login box
    render(<LoginBox />);

    // since our fake useDataStore returns rememberMe to be true
    // we expect the checkbox to be checked
    // screen.getByLabelText finds an element by the text it displays on screen
    expect(screen.getByLabelText(/remember me/i).checked).to.equal(true);
  });

  // fill in the form with valid details and submit
  it('Log in with valid form input', async function () {
    // draw the login box with router to makes it believe it is in /auth page
    // (in reality its in a blank page)
    renderWithRouter(<LoginBox />, { route: '/auth' });

    // simulate user typing into text boxes
    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    // simulate clicking the log in button
    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    // wait a while for the form to validate user input
    await new Promise(resolve => setTimeout(resolve, 10));

    // sinon's fake functions remember how many times they have been called
    // here we make sure that login is called once with the correct parameters
    // i.e. the data we have just typed into the text boxes
    sinon.assert.calledOnce(fakeLogin);
    sinon.assert.calledWith(fakeLogin, 'abc@gmail.com', 'password');

    // and we also expect the login box to navigate us the the account page
    // after successful login
    expect(window.location.pathname).to.be.equal('/account');
  });

  // testing invalid inputs
  it('Log in with invalid email', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 10));

    // if the email is totally invalid, we expect the login box to not send a
    // request to backend at all
    sinon.assert.notCalled(fakeLogin);
  });

  // test another type of invalid input
  it('Log in with short password', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'pass');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 10));
    sinon.assert.notCalled(fakeLogin);
  });

  // test valid input but login failed
  it('Log in failure with valid input', async function () {
    renderWithRouter(<LoginBox />, { route: '/auth' });

    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password2');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakeLogin);
    sinon.assert.calledWith(fakeLogin, 'abc@gmail.com', 'password2');

    // since the log in failed, we expect LoginBox to display the error
    // to user by calling toast
    sinon.assert.calledOnce(fakeToast);
    // we expect toast to be called with the first parameter being 'error'
    // which shows the X error icon in the notification
    sinon.assert.calledWith(fakeToast, 'error');

    // we expect to stay on /auth page because log in failed
    expect(window.location.pathname).to.be.equal('/auth');
  });
});
