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
import ManageTokens from '../account/ManageTokens.jsx';

import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as ApiContext from '../contexts/ApiProvider.jsx';
import * as ToastContext from '../contexts/ToastProvider.jsx';

describe('ManageTokens Component', function () {
  let fakeToast;
  let fakegetUserTokens;
  let fakesetTokenFalse;

  // before each test, set up the fake contexts
  beforeEach(function () {
    fakeToast = sinon.spy();
    sinon.replace(ToastContext, 'useToast', () => ({ toast: fakeToast }));

    sinon.replace(DataStoreContext, 'useDataStore', () => ({
      data: usefakeData(),
    }));

    const token = {
      id: 'this is token id 1',
      value: 'this is token value 1',
      createdBy: {
        name: 'token id 1 created by: name',
        email: 'token id 1 created by: email'
      },
      receivedBy: {
        name: 'token id 1 received by: name',
        email: 'token id 1 received by: email'
      },
      classroom: {
        name: 'token id 1 classroom: name'
      },
      createdAt: 'token id 1 createdAt',
      isValid: true
    };

    const fakeresult = {
      success: true,
      response: {
        data: {
          created: [token],
          received: []
        }
      }
    };
    fakegetUserTokens = function () { return fakeresult; };

    fakesetTokenFalse = function () { return fakeresult; };

    sinon.replace(ApiContext, 'useApi', () => ({
      getUserTokens: fakegetUserTokens,
      setTokenFalse: fakesetTokenFalse
    }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders ManageTokens', async function () {
    render(<ManageTokens />);
    expect(await screen.findByText('Tokens Received')).to.not.be.equal(null);
    expect(await screen.findByText('Tokens Created')).to.not.be.equal(null);
  });
});
