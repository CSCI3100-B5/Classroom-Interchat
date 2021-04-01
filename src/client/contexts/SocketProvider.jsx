import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { accessToken, userId } = useDataStore();

  useEffect(() => {
    const newSocket = io(
      env.hostUrl,
      {
        auth: {
          token: accessToken // TODO: set as access token
        }
      }
    );
    setSocket(newSocket);
    newSocket.on('connect_error', (err) => {
      console.log(err);
      // TODO: on error prompt the user to log in again
    });

    return () => newSocket.close();
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
