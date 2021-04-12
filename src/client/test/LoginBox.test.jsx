/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import React from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';
import ReactRouter from 'react-router';
import LoginBox from '../auth/LoginBox.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';

describe('LoginBox Component', function () {
  beforeEach(function () {
    const fakeLogin = sinon.fake((email, password) => {
      if (email === 'abc@gmail.com' && password === 'password') {
        return new Promise((resolve) => {
          resolve({ success: true, response: { } });
        });
      }
      return new Promise((resolve) => {
        resolve({ success: false, response: { data: { message: 'Fake fail' } } });
      });
    });
    const fakeToast = sinon.spy();
    const fakeHistoryPush = sinon.spy();
    this.currentTest.fakeLogin = fakeLogin;
    this.currentTest.fakeToast = fakeToast;
    this.currentTest.fakeHistoryPush = fakeHistoryPush;
    sinon.replace(ApiContext, 'useApi', () => ({ login: fakeLogin }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: { rememberMe: true } }));
    sinon.replace(ReactRouter, 'useHistory', () => ({ push: fakeHistoryPush }));
  });

  afterEach(function () {
    sinon.restore();
  });

  it('Initialize remember me to match data', function () {
    render(<LoginBox />);

    expect(screen.getByLabelText(/remember me/i).checked).to.equal(true);
  });

  it('Log in with valid form input', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(this.test.fakeLogin.callCount).to.be.equal(1);
    expect(this.test.fakeLogin.lastCall.args).to.eql(['abc@gmail.com', 'password']);
    expect(this.test.fakeHistoryPush.callCount).to.be.equal(1);
    expect(this.test.fakeHistoryPush.lastCall.args).to.include('/account');
  });

  it('Log in with invalid email', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(this.test.fakeLogin.callCount).to.be.equal(0);
  });

  it('Log in with short password', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'pass');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    expect(this.test.fakeLogin.callCount).to.be.equal(0);
  });
});
