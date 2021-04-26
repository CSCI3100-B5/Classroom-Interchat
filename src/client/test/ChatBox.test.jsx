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
import ChatBox from '../classroom/session/chatbox/ChatBox.jsx';

import * as MessageList from '../classroom/session/chatbox/MessageList.jsx';
import * as MessageCompose from '../classroom/session/chatbox/MessageCompose.jsx';
import * as CreateQuiz from '../classroom/session/chatbox/CreateQuiz.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';

describe('ChatBox Component', () => {
  let fakeMessageList;
  let fakeMessageCompose;
  let fakeCreateQuiz;

  // before each test, set up the fake contexts
  beforeEach(() => {
    fakeMessageList = sinonDefaultReturn(MessageList, 'MessageList return');
    fakeMessageCompose = sinonDefaultReturn(MessageCompose, 'MessageCompose return');
    fakeCreateQuiz = sinonDefaultReturn(CreateQuiz, 'CreateQuiz return');
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(() => {
    sinon.restore();
  });

  it('Renders ChatBox', () => {
    render(<ChatBox />);

    sinon.assert.calledOnce(fakeMessageList);
    sinon.assert.calledOnce(fakeMessageCompose);
    expect(screen.queryByText('MessageList return')).to.not.be.equal(null);
    expect(screen.queryByText('MessageCompose return')).to.not.be.equal(null);
  });
});
