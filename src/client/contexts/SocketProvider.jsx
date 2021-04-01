import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();

  useEffect(() => {
    const newSocket = io(
      env.apiBase,
      {
        auth: {
          token: accessToken // TODO: set as access token
        }
      }
    );
    setSocket(newSocket);
    newSocket.on('connect_error', (err) => {
      console.log(err);
      // TODO: what error exactly? Assuming no authorization for now
      history.push('/auth');
    });

    return () => newSocket.close();
  }, [userId]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
