import React, { useContext, useEffect } from 'react';
import { useSocket } from './SocketProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';

const RealtimeContext = React.createContext();

export function useRealtime() {
  return useContext(RealtimeContext);
}

export function RealtimeProvider({ children }) {
  const {
    data,
    refreshTokenHeader,
  } = useDataStore();
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.onAny((...args) => console.log(args));

      // TODO: GUIDE: write all realtime event receiver here
      // instead of writing the receivers in components and update UI directly,
      // write receivers here and update data, then design the components so
      // that they react to data changes (e.g. using useEffect)

      socket.on('catch up', (payload) => {
        const { participants, messages, ...meta } = payload;
        data.classroomMeta = meta;
        data.participants = participants;
        data.messages = messages;
      });

      socket.on('peek update', (payload) => {
        data.peekClassroomMeta = payload;
      });

      socket.on('kick', (payload) => {
        const { reason } = payload;
        // TODO: a UI to show the reason
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
      });

      socket.on('new message', (payload) => {
        const idx = data.messages.findIndex(x => x.id === payload.id);
        if (idx >= 0) {
          const messages = [...data.messages];
          messages[idx] = payload;
          data.messages = messages;
        } else {
          data.messages = [...data.messages, payload];
        }
      });

      socket.on('participant changed', (payload) => {
        const idx = data.participants.findIndex(x => x.user.id === payload.user.id);
        if (idx >= 0) {
          const participants = [...data.participants];
          participants[idx] = payload;
          data.participants = participants;
        } else {
          data.participants = [...data.participants, payload];
        }
      });

      socket.on('participant deleted', (payload) => {
        data.participants = data.participants.filter(x => x.user.id !== payload.userId);
      });

      socket.on('meta changed', (payload) => {
        data.classroomMeta = payload;
      });

      socket.on('question resolved', (payload) => {
        const idx = data.messages.findIndex(x => x.id === payload.id);
        if (idx >= 0) {
          const messages = [...data.messages];
          messages[idx] = payload;
          data.messages = messages;
          if (data.replyToMessageId === payload.id) {
            data.replyToMessageId = null;
            console.log('cleared replyToMessageId');
          }
        } else {
          console.log('on question resolved: id not found: ', payload);
        }
      });
    }
  }, [socket]);

  // TODO: GUIDE: write all realtime event emitter here

  function createClassroom(classroomName) {
    return new Promise((resolve, reject) => {
      socket.emit('create classroom', { name: classroomName }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function peekClassroom(classroomId) {
    return new Promise((resolve, reject) => {
      socket.emit('peek classroom', { classroomId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function joinClassroom(classroomId) {
    return new Promise((resolve, reject) => {
      socket.emit('join classroom', { classroomId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function leaveClassroom() {
    return new Promise((resolve, reject) => {
      socket.emit('leave classroom', {}, (response) => {
        if (response.error) reject(response);
        data.classroomMeta = null;
        data.messages = [];
        data.participants = [];
        resolve(response);
      });
    });
  }

  function sendMessage(messageContent, messageInf) {
    return new Promise((resolve, reject) => {
      socket.emit('send message', { message: messageContent, information: messageInf }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function resolveQuestion(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('resolve question', { messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function requestPermission() {
    return new Promise((resolve, reject) => {
      socket.emit('request permission', {}, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function cancelRequestPermission(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('cancel request permission', {}, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function promoteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('promote participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function demoteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('demote participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function kickParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('kick participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }
  return (
    <RealtimeContext.Provider value={{
      // TODO: GUIDE: export functions to send socket messages to server
      createClassroom,
      joinClassroom,
      peekClassroom,
      leaveClassroom,
      sendMessage,
      resolveQuestion,
      requestPermission,
      cancelRequestPermission,
      promoteParticipant,
      demoteParticipant,
      kickParticipant
    }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
