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
    newSocket.io.on('reconnect', (retryCount) => {
      console.log('io reconnect', retryCount);
      if (data.classroomMeta) {
        newSocket.emit(
          'join classroom',
          { classroomId: data.classroomMeta.id },
          (response) => {
            if (response.error) {
              console.log(response);
              data.classroomMeta = null;
              data.participants = [];
              data.messages = [];
              history.push('/classroom');
            }
          }
        );
        console.log('Attempting to reconnect to classroom');
      }
    });
    // TODO: show internet warning
    newSocket.io.on('reconnect_error', (...args) => console.log('io reconnect error', args));
    newSocket.on('disconnect', (...args) => console.log('Socket disconnect', args));
    newSocket.on('connect_error', async (error) => {
      console.log('Socket connection error ', error);
      if (error.message === 'jwt expired') {
        console.log('Refreshing jwt token for socket connection');
        const response = await refreshAccessToken();
        if (response.success) return setSocketAccessToken(response.response.data.accessToken);
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        data.rememberMe = true;
        data.refreshToken = null;
        data.accessToken = null;
        data.user = null;
        return history.push('/auth');
      }
      if (error.message === 'jwt malformed') {
        data.classroomMeta = null;
        data.participants = [];
        data.messages = [];
        data.rememberMe = true;
        data.refreshToken = null;
        data.accessToken = null;
        data.user = null;
        return history.push('/auth');
      }
    });

    return () => newSocket.close();
  }, [data.user, socketAccessToken]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
