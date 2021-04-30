import React, { useContext, useEffect } from 'react';
import { useSocket } from './SocketProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';
import { useToast } from './ToastProvider.jsx';

const RealtimeContext = React.createContext();

/**
 * The hook used by children to access this context
 */
export function useRealtime() {
  return useContext(RealtimeContext);
}

/**
 * A React context component wrapping all socket.io communications
 */
export function RealtimeProvider({ children }) {
  const {
    data,
    refreshTokenHeader,
  } = useDataStore();
  const socket = useSocket();
  const { toast } = useToast();

  // Register all event listeners when a socket is ready
  // All socket.io events sent by server are handled here
  useEffect(() => {
    if (socket) {
      socket.onAny((...args) => console.log(args));

      // GUIDE: write all realtime event receiver here
      // instead of writing the receivers in components and update UI directly,
      // write receivers here and update data, then design the components so
      // that they react to data changes (e.g. using useEffect)

      // This event includes data for the entire classroom, including its
      // message history and participant list
      socket.on('catch up', (payload) => {
        const { participants, messages, ...meta } = payload;
        data.classroomMeta = meta;
        data.participants = participants;
        data.messages = messages;
      });

      // Updates to the Join Classroom classroom preview
      socket.on('peek update', (payload) => {
        data.peekClassroomMeta = payload;
      });

      // This client is getting kicked
      // Delete classroom session data and toast the reason for kicking
      socket.on('kick', (payload) => {
        const { reason } = payload;
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        toast('info', 'Left classroom', reason);
      });

      // Events related to a message being changed
      // The server always send the entire message even if only a small part
      // of it changes, since a message object is mostly small
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

            // clear message filter if the last ongoing quiz ends, or else the
            // UI will be deadlocked
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

      // Similar to above, this is also an update to a message
      // But this event needs to be ignored if this client is the quiz sender
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

      // Someone else answered the quiz
      // Their answer is sent with this event
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

      // Any kind of changes to a participant
      // Replaces the entire participant object
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

      // Remove a participant from the list
      socket.on('participant deleted', (payload) => {
        data.participants = data.participants.filter(x => x.user.id !== payload.userId);
      });

      // Metadata of the classroom changed
      // Changes to the message list do not trigger this event
      socket.on('meta changed', (payload) => {
        data.classroomMeta = payload;
      });

      // A question is resolved
      socket.on('question resolved', (payload) => {
        const idx = data.messages.findIndex(x => x.id === payload.id);
        if (idx >= 0) {
          const messages = [...data.messages];
          messages[idx] = payload;
          data.messages = messages;
          // Clear reply status and message filters to avoid UI deadlocks
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

  /**
   * Request to create a new classroom
   * @param {string} classroomName name of the classroom
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function createClassroom(classroomName) {
    return new Promise((resolve, reject) => {
      socket.emit('create classroom', { name: classroomName }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to get the preview of a classroom
   * @param {string} classroomId id of the classroom
   * @returns {Promise<object>} server response, a classroom metadata object
   */
  function peekClassroom(classroomId) {
    return new Promise((resolve, reject) => {
      socket.emit('peek classroom', { classroomId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to join a classroom
   * @param {string} classroomId id of the classroom
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function joinClassroom(classroomId) {
    return new Promise((resolve, reject) => {
      socket.emit('join classroom', { classroomId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to leave a classroom
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
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

  /**
   * Request to send a message (text, question or reply)
   * @param {string} messageContent the text content of the message
   * @param {{type:"text"|"question"|"reply", qMessageId?:string}} messageInf type of the message and the message id of the question message for a reply
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function sendMessage(messageContent, messageInf) {
    return new Promise((resolve, reject) => {
      socket.emit('send message', { message: messageContent, information: messageInf }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to send a quiz
   * @param {object} cleanedValues data of the quiz
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function sendQuiz(cleanedValues) {
    return new Promise((resolve, reject) => {
      socket.emit('send quiz', cleanedValues, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to end a quiz
   * @param {string} messageId id of the quiz message
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function endQuiz(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('end quiz', { messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to release quiz results
   * @param {string} messageId id of the quiz message
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function releaseResults(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('release results', { messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to resolve a question
   * @param {string} messageId id of the question message
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function resolveQuestion(messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('resolve question', { messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to answer an SAQ
   * @param {string} content the text answer
   * @param {string} messageId id of the question message
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function ansSAQuiz(content, messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('saq answer', { content, messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to answer an MCQ
   * @param {number[]} content the answer choices
   * @param {string} messageId id of the question message
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function ansMCQuiz(content, messageId) {
    return new Promise((resolve, reject) => {
      socket.emit('mcq answer', { content, messageId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request instructor permission
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function requestPermission() {
    return new Promise((resolve, reject) => {
      socket.emit('request permission', {}, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Cancel instructor permission request
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function cancelRequestPermission() {
    return new Promise((resolve, reject) => {
      socket.emit('cancel request permission', {}, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to promote a participant
   * @param {string} userId id of user to promote
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function promoteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('promote participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to award tokens to users
   * @param {string[]} userIds ids of users to award a token to
   * @param {string} value the textual note to add to the token
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function awardToken(userIds, value) {
    return new Promise((resolve, reject) => {
      socket.emit('award token', { userIds, value }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to demote a participant
   * @param {string} userId id of user to demote
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function demoteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('demote participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to kick a participant
   * @param {string} userId id of user to kick
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function kickParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('kick participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to mute or unmute a participant
   * @param {string} userId id of user to mute/unmute
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
  function toggleMuteParticipant(userId) {
    return new Promise((resolve, reject) => {
      socket.emit('mute participant', { userId }, (response) => {
        if (response.error) reject(response);
        resolve(response);
      });
    });
  }

  /**
   * Request to mute or unmute the classroom
   * @returns {Promise<{}|{error:string}>} server response, normally empty
   */
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
