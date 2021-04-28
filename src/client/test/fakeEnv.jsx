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
        content: 'sth like message content'
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
  ],
  participants: [],

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
function usefakeData() {
  return { ...fakeData };
}

function sinonDefaultReturn(component, returnMessage) {
  return sinon.stub(component, 'default').returns(<div>{returnMessage}</div>);
}

export { usefakeData, sinonDefaultReturn };
