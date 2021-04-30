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
  let onCreateQuizHandle;
  let onBackHandle;

  // before each test, set up the fake contexts
  beforeEach(() => {
    fakeMessageList = sinonDefaultReturn(MessageList, 'MessageList return');
    sinon.stub(MessageCompose, 'default').callsFake(({ onCreateQuiz }) => {
      onCreateQuizHandle = onCreateQuiz;
      return <div>MessageCompose return</div>;
    });
    sinon.stub(CreateQuiz, 'default').callsFake(({ onBack }) => {
      onBackHandle = onBack;
      return <div>CreateQuiz return</div>;
    });
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(() => {
    sinon.restore();
  });

  it('Show MessageList and MessageCompose', () => {
    render(<ChatBox />);

    expect(screen.queryByText('MessageList return')).to.not.be.equal(null);
    expect(screen.queryByText('MessageCompose return')).to.not.be.equal(null);
  });

  it('Show Create Quiz', async () => {
    render(<ChatBox />);
    onCreateQuizHandle();

    expect(screen.queryByText('CreateQuiz return')).to.not.be.equal(null);

    onBackHandle();
    expect(screen.queryByText('MessageList return')).to.not.be.equal(null);
    expect(screen.queryByText('MessageCompose return')).to.not.be.equal(null);
  });
});
