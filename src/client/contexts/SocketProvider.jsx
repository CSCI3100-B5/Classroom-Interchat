import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useHistory } from 'react-router-dom';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';
import { useApi } from './ApiProvider.jsx';

const SocketContext = React.createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState();
  const { data } = useDataStore();
  const [socketAccessToken, setSocketAccessToken] = useState();

  const history = useHistory();
  const { refreshAccessToken } = useApi();

  useEffect(() => {
    setSocketAccessToken(data.accessToken);
  }, []);

  useEffect(() => {
    const newSocket = io(
      env.hostUrl,
      {
        extraHeaders: {
          Authorization: `Bearer ${socketAccessToken}`
        }
      }
    );
    console.log(`Socket connecting to ${env.hostUrl}`);
    setSocket(newSocket);
    newSocket.on('connect', (...args) => console.log('Socket connect', args));
    // TODO: auto-join classroom if previously disconnected without leaving
    newSocket.io.on('reconnect', (...args) => console.log('io reconnect', args));
    newSocket.io.on('reconnect_error', (...args) => console.log('io reconnect error', args));
    newSocket.on('disconnect', (...args) => console.log('Socket disconnect', args));
    newSocket.on('connect_error', async (error) => {
      console.log('Socket connection error ', error);
      if (error.message === 'jwt expired') {
        console.log('Refreshing jwt token for socket connection');
        setSocketAccessToken((await refreshAccessToken()).response.data.accessToken);
      }
      // TODO: DEBUG history.push('/auth');
    });

    return () => newSocket.close();
  }, [data.user, socketAccessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
