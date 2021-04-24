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
import MCQResult from '../classroom/session/chatbox/message/quiz/MCQResult.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as TokenAwarder from '../classroom/session/TokenAwarder.jsx';

describe('MCQResult Component', function () {
  let fakeAnsMCQuiz;
  let fakeTokenAwarder;

  // before each test, set up the fake contexts
  beforeEach(function () {
    // replaces all the useXXX functions to return a fake context
    // sinon.replace(object, property, newFunction)

    fakeAnsMCQuiz = sinon.spy();
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
    fakeTokenAwarder = sinonDefaultReturn(TokenAwarder, 'TokenAwarder return');
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders MCQResult', function () {
    render(<MCQResult message={{
      id: 'reply Id 1',
      sender: {
        id: 'sender Id is this',
        name: 'sender name is this'
      },
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: 'some time',
        correct: ['choice 1'],
        results: []
      }
    }}
    />);

    expect(screen.queryByText('MCQ Quiz Results')).to.not.be.equal(null);
    expect(screen.queryByText('this is quiz prompt')).to.not.be.equal(null);
    expect(screen.queryByText('Award Token')).to.not.be.equal(null);
  });
});
