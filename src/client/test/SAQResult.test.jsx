/* eslint-disable no-underscore-dangle */
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

import { usefakeData, sinonDefaultReturn } from './fakeEnv.jsx';

// import our component to be tested
import SAQResult from '../classroom/session/chatbox/message/quiz/SAQResult.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as TokenAwarder from '../classroom/session/TokenAwarder.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

describe('SAQResult Component', function () {
  let fakeTokenAwarder;

  // before each test, set up the fake contexts
  beforeEach(function () {
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
    fakeTokenAwarder = sinonDefaultReturn(TokenAwarder, 'TokenAwarder return');
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders SAQResult', function () {
    render(<SAQResult message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null,
        correct: ['choice 1'],
        results: [{ content: 'abc' }]
      }
    }}
    />);

    expect(screen.queryByText('SAQ Quiz Results')).to.not.be.equal(null);
  });
});
