/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// import testing libraries
import React, { useRef } from 'react';
import { expect } from 'chai';
import { render, screen } from '@testing-library/react';
// sinon creates fake functions
import sinon from 'sinon';
import {
  describe, it, beforeEach, afterEach
} from 'mocha';

import { usefakeData, sinonDefaultReturn } from './fakeEnv.jsx';
// import our component to be tested
import MessageList from '../classroom/session/chatbox/MessageList.jsx';
import * as DataStoreContext from '../contexts/DataStoreProvider.jsx';
import * as Message from '../classroom/session/chatbox/message/Message.jsx';

// did not find a way to deal with combination of
// useRef(), useEffect() and messageBtm.current.scrollIntoView()

describe('MessageList Component', function () {
  let fakeMessage;

  beforeEach(function () {
    fakeMessage = sinonDefaultReturn(Message, 'Message return');
    sinon.replace(DataStoreContext, 'useDataStore', () => ({ data: usefakeData() }));
  });

  // after each test is executed, do clean up actions
  afterEach(function () {
    sinon.restore();
  });

  it('Renders MessageList', function () {
    const messageBtm = {
      id: 'messageId is this',
      sender: {
        name: 'sender name is this'
      },
      type: 'Question',
      content: {
        isResolved: false,
        content: 'sth like message content'
      }
    };

    render(
      <div>
        <MessageList ref={messageBtm} />
      </div>
    );

    expect(screen.queryByText('messageId is this')).to.not.be.equal(null);
  });
});
