/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import sinon from 'sinon';

const fakeData = {
  rememberMe: true,
  peekClassroomMeta: null,

  classroomMeta: {
    host: 'this is host id',
    name: 'name in classroomMeta',
    closedAt: null,
    isMuted: false
  },
  messages: [
    {
      id: 'messageId is this',
      sender: {
        id: 'sender is is this',
        name: 'sender name is this'
      },
      type: 'question',
      content: {
        isResolved: false,
        content: 'sth like question message content'
      }
    },
    {
      id: 'reply Id 1',
      sender: {
        id: 'sender id 1',
        name: 'sender name 1'
      },
      type: 'reply',
      content: {
        replyTo: 'messageId is this'
      }
    },
    {
      id: 'reply Id 2',
      sender: {
        id: 'sender id 2',
        name: 'sender name 2'
      },
      type: 'reply',
      content: {
        replyTo: 'messageId is this'
      }
    },
    {
      id: 'reply Id 3',
      sender: {
        id: 'sender id 3',
        name: 'sender name 3'
      },
      type: 'reply',
      content: {
        replyTo: 'messageId is NOT this'
      }
    },
    {
      id: 'quiz message is this',
      sender: 'quiz sender Id is this',
      type: 'mcq',
      content: {
        choices: ['choice 1', 'choice 2'],
        multiSelect: null,
        prompt: 'this is quiz prompt',
        closedAt: null,
        results: null,
        correct: null,
        resultsReleased: null
      }
    }
  ],
  participants: [{
    user: {
      name: 'user 1',
      email: 'user1@gmail.com',
      id: 'id 1'
    },
    permission: 'student'
  },
  {
    user: {
      name: 'user 2',
      email: 'user2@gmail.com',
      id: 'id 2'
    },
    permission: 'student'
  },
  {
    user: {
      name: 'user 3',
      email: 'user3@gmail.com',
      id: 'id 3'
    },
    permission: 'student'
  },
  {
    user: {
      name: 'user 4',
      email: 'user4@gmail.com',
      id: 'id 4'
    },
    permission: 'student'
  },
  ],

  replyToMessageId: null,
  messageFilter: null,

  user: {
    name: 'user name is this',
    email: 'abc@gmail.com',
    id: 'sender Id is this'
  },

  accessToken: null,
  refreshToken: null

};
let fakeDataCopy;
function usefakeData() {
  // make a deep copy of fakeData,
  // so that each test always get the same fakeData
  // and any modification does not affect other test
  fakeDataCopy = JSON.parse(JSON.stringify(fakeData));
  return { ...fakeDataCopy };
}

function sinonDefaultReturn(component, returnMessage) {
  return sinon.stub(component, 'default').returns(<div>{returnMessage}</div>);
}

export { usefakeData, sinonDefaultReturn };
