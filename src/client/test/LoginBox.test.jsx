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
import LoginBox from '../auth/LoginBox.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import { renderWithRouter } from './test-utils.js';

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
    this.currentTest.fakeLogin = fakeLogin;
    this.currentTest.fakeToast = fakeToast;
    sinon.replace(ApiContext, 'useApi', () => ({ login: fakeLogin }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: { rememberMe: true } }));
  });

  afterEach(function () {
    sinon.restore();
  });

  it('Initialize remember me to match data', function () {
    render(<LoginBox />);

    expect(screen.getByLabelText(/remember me/i).checked).to.equal(true);
  });

  it('Log in with valid form input', async function () {
    renderWithRouter(<LoginBox />, { route: '/auth' });

    userEvent.type(screen.getByLabelText(/email/i), 'abc@gmail.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    sinon.assert.calledOnce(this.test.fakeLogin);
    sinon.assert.calledWith(this.test.fakeLogin, 'abc@gmail.com', 'password');
    expect(window.location.pathname).to.be.equal('/account');
  });

  it('Log in with invalid email', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'password');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    sinon.assert.notCalled(this.test.fakeLogin);
  });

  it('Log in with short password', async function () {
    render(<LoginBox />);

    userEvent.type(screen.getByLabelText(/email/i), 'abc');
    userEvent.type(screen.getByLabelText(/password/i), 'pass');

    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    await new Promise(resolve => setTimeout(resolve, 500));
    sinon.assert.notCalled(this.test.fakeLogin);
  });
});
