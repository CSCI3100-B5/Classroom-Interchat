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

      socket.on('new incoming message', (payload) => {
        console.log('realtime Provider new incoming message payload ').concat(data.message);
        console.log(payload);
        const { message } = payload;
        data.messages.push(message);
      });
    }
  }, [socket]);

  // TODO: GUIDE: write all realtime event emitter here

  function createClassroom(classroomName) {
    socket.emit('create classroom', { name: classroomName });
  }

  function sendMessage(messageContent) {
    socket.emit('send message', { message: messageContent, classroomID: data.classroomMeta.id, });
  }

  return (
    <RealtimeContext.Provider value={{
      // TODO: GUIDE: export functions to send socket messages to server
      createClassroom,
      sendMessage
    }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
