import React, { useContext, useEffect } from 'react';
import { useSocket } from './SocketProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';

const RealtimeContext = React.createContext();

export function useRealtime() {
  return useContext(RealtimeContext);
}

export function RealtimeProvider({ children }) {
  const {
    setAccessToken,
    setRefreshToken,
    refreshTokenHeader,
    setUserId
  } = useDataStore();
  const socket = useSocket();

  useEffect(() => {
    if (socket) socket.onAny((...args) => console.log(args));
  }, [socket]);

  return (
    <RealtimeContext.Provider value={{
      // functions to send socket messages to server
    }}
    >
      {children}
    </RealtimeContext.Provider>
  );
}
