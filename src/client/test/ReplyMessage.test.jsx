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
import ReplyMessage from '../classroom/session/chatbox/message/ReplyMessage.jsx';

// import the contexts that our component uses
// every useXXX call (besides react built-in ones, like useState, useEffect, useRef)
// comes from a context, and we need to fake these contexts for the component
// to work properly in our tests
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';

// not needed as no history changes
// import { renderWithRouter } from './test-utils.js';

// all tests related to ReplyMessage
describe('ReplyMessage Component', function () {
  // before each test, set up the fake contexts
  beforeEach(function () {
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  // test that it render reply message
  it('Renders reply message', function () {
    render(<ReplyMessage message={{
      id: 'reply Id 1',
      sender: 'sender Id 1',
      content: {
        isResolved: false,
        content: 'sth like reply content',
        replyTo: 'messageId is this'
      }
    }}
    />);

    expect(screen.queryByText('Replying to sender name is this\'s Question')).to.not.be.equal(null);
    expect(screen.queryByText('sth like question message content')).to.not.be.equal(null);
    expect(screen.queryByText('sth like reply content')).to.not.be.equal(null);
  });
});
