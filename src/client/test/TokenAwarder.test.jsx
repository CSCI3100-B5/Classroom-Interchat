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

// import our component to be tested
import TokenAwarder from '../classroom/session/TokenAwarder.jsx';

import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('TokenAwarder Component', function () {
  let fakeToast;
  let fakeawardToken;

  beforeEach(function () {
    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    fakeawardToken = sinon.fake(() => new Promise((resolve) => {
      resolve({ success: true, response: { } });
    }));
    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      awardToken: fakeawardToken
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Cancel token award', function () {
    const fakeonClose = sinon.spy();
    render(<TokenAwarder userIds={['id 1', 'id 2']} onClose={fakeonClose} />);

    userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    sinon.assert.calledOnce(fakeonClose);
    sinon.assert.notCalled(fakeawardToken);
  });

  it('Award Token to users', async function () {
    const fakeonClose = sinon.spy();
    render(<TokenAwarder userIds={['id 1', 'id 2']} onClose={fakeonClose} />);

    userEvent.click(screen.getByRole('button', { name: /Award Token/i }));
    await new Promise(resolve => setTimeout(resolve, 10));

    sinon.assert.calledOnce(fakeawardToken);
    sinon.assert.calledWith(fakeawardToken, ['id 1', 'id 2']);
    sinon.assert.calledOnce(fakeonClose);
  });
});
