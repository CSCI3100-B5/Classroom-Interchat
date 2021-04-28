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
import TokenAwarder from '../classroom/session/TokenAwarder.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';
import * as RealtimeContext from '../contexts/RealtimeProvider.jsx';

describe('TokenAwarder Component', function () {
  let fakeToast;
  let fakeawardToken;

  beforeEach(function () {
    fakeToast = sinon.spy();
    fakeawardToken = sinon.spy();

    sinon.replace(RealtimeContext, 'useRealtime', () => ({
      awardToken: fakeawardToken
    }));
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders TokenAwarder', function () {
    const fakeonClose = sinon.spy();
    render(<TokenAwarder userIds="this is user id" onClose={fakeonClose} />);

    expect(screen.queryByText('Token Award')).to.not.be.equal(null);
  });

  it('Pop error: no user to award', function () {
    const fakeonClose = sinon.spy();
    render(<TokenAwarder userIds="this is user id" onClose={fakeonClose} />);

    expect(screen.queryByText('Token Award')).to.not.be.equal(null);
  });
});
