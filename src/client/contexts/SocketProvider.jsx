import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { data } = useDataStore();

  const history = useHistory();

  useEffect(() => {
    const newSocket = io(
      env.hostUrl,
      {
        extraHeaders: {
          Authorization: `Bearer ${data.accessToken}`
        }
      }
    );
    console.log(`Socket connecting to ${env.hostUrl}`);
    setSocket(newSocket);
    newSocket.on('connect', (...args) => console.log('Socket connect', args));
    newSocket.io.on('reconnect', (...args) => console.log('io reconnect', args));
    newSocket.io.on('reconnect_error', (...args) => console.log('io reconnect error', args));
    newSocket.on('disconnect', (...args) => console.log('Socket disconnect', args));
    newSocket.on('connect_error', (...args) => {
      console.log('Socket connection error ', args);
      // TODO: refresh token
      // TODO: DEBUG history.push('/auth');
    });

    return () => newSocket.close();
  }, [data.user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
