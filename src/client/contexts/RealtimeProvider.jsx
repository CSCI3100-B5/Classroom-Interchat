import React, { useContext, useEffect } from 'react';
import { useSocket } from './SocketProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';
import { useToast } from './ToastProvider.jsx';

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
  const { toast } = useToast();

  useEffect(() => {
    if (socket) {
      socket.onAny((...args) => console.log(args));

      // GUIDE: write all realtime event receiver here
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
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        toast('info', 'Left classroom', reason);
      });

      // All these events do the same thing
      [
        'new message',
        'new quiz',
        'end quiz',
        'update quiz'
      ].forEach((event) => {
        socket.on(event, (payload) => {
          const idx = data.messages.findIndex(x => x.id === payload.id);
          if (idx >= 0) {
            const messages = [...data.messages];
            messages[idx] = payload;
            data.messages = messages;
            if (data.messageFilter === 'quiz'
            && data.messages.filter(x => ['mcq', 'saq'].includes(x.type) && !x.content.closedAt).length === 0) {
              data.messageFilter = null;
              console.log('cleared message filter because there are no ongoing quizzes');
            }
          } else {
            data.messages = [...data.messages, payload];
          }
        });
      });

      socket.on('quiz digest', (payload) => {
        // ignore digests if this user is the quiz sender
        if (payload.sender.id === data.user.id) return;
        const idx = data.messages.findIndex(x => x.id === payload.id);
        if (idx >= 0) {
          const messages = [...data.messages];
          messages[idx] = payload;
          data.messages = messages;
        } else {
          data.messages = [...data.messages, payload];
        }
      });

      socket.on('new quiz result', (payload) => {
        const idx = data.messages.findIndex(x => x.id === payload.messageId);
        if (idx >= 0) {
          const messages = [...data.messages];
          messages[idx].content.results = messages[idx].content.results.filter(
            x => (x.user.id ?? x.user) !== (payload.result.user.id ?? payload.result.user)
          );
          messages[idx].content.results.push(payload.result);
          data.messages = messages;
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
            console.log('cleared replyToMessageId because question is resolved');
          }
          if (data.messageFilter === 'unresolved'
          && data.messages.filter(x => x.type === 'question' && !x.content.isResolved).length === 0) {
            data.messageFilter = null;
            console.log('cleared message filter because there are no unresolved questions');
          }
        } else {
          console.log('on question resolved: id not found: ', payload);
        }
      });
    }
  }, [socket]);

  // GUIDE: write all realtime event emitter here

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
        if (response.error && !data.classroomMeta.closedAt) {
          reject(response);
        }
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

  function sendQuiz(cleanedValues) {
    return new Promise((resolve, reject) => {
      socket.emit('send quiz', cleanedValues, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function endQuiz(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('end quiz', { messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function releaseResults(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('release results', { messageId }, (response) => {
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

  function ansSAQuiz(content, messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('saq answer', { content, messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function ansMCQuiz(content, messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('mcq answer', { content, messageId }, (response) => {
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

  function cancelRequestPermission() {
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

  function awardToken(userIds, value) {
    return new Promise((resolve, reject) => {
      socket.emit('award token', { userIds, value }, (response) => {
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

  function toggleMuteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('mute participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  function toggleGlobalMute() {
    return new Promise((resolve, reject) => {
      socket.emit('mute classroom', {}, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  return (
    <RealtimeContext.Provider value={{
      // GUIDE: export functions to send socket events to server
      createClassroom,
      joinClassroom,
      peekClassroom,
      leaveClassroom,
      sendMessage,
      sendQuiz,
      releaseResults,
      endQuiz,
      ansSAQuiz,
      ansMCQuiz,
      resolveQuestion,
      requestPermission,
      cancelRequestPermission,
      promoteParticipant,
      awardToken,
      demoteParticipant,
      kickParticipant,
      toggleMuteParticipant,
      toggleGlobalMute
    }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
