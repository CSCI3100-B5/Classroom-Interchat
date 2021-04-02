import React, { useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const DataStoreContext = React.createContext();

export function useDataStore() {
  return useContext(DataStoreContext);
}

export function DataStoreProvider({ children }) {
  const [savedAccessToken, saveAccessToken] = useLocalStorage('accessToken', null);
  const [savedRefreshToken, saveRefreshToken] = useLocalStorage('refreshToken', null);
  const [savedUser, saveUser] = useLocalStorage('user', null);

  const [accessToken, pSetAccessToken] = useState(() => savedAccessToken);
  const [refreshToken, pSetRefreshToken] = useState(() => savedRefreshToken);
  const [rememberMe, setRememberMe] = useState(true);

  // All info related to the classroom, except messages and participant list
  const [classroomMeta, setClassroomMeta] = useState();

  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);

  const [user, pSetUser] = useState(() => savedUser);

  function setAccessToken(token) {
    pSetAccessToken(token);
    if (rememberMe) saveAccessToken(token);
  }

  function setRefreshToken(token) {
    pSetRefreshToken(token);
    if (rememberMe) saveRefreshToken(token);
  }

  function setUser(newUser) {
    pSetUser(newUser);
    saveUser(newUser);
  }

  function refreshTokenHeader() {
    return {
      Authorization: `Bearer ${refreshToken}`
    };
  }

  function accessTokenHeader() {
    return {
      Authorization: `Bearer ${accessToken}`
    };
  }

  return (
    <DataStoreContext.Provider value={{
      accessToken,
      setAccessToken,
      refreshToken,
      setRefreshToken,
      rememberMe,
      setRememberMe,
      user,
      setUser,
      classroomMeta,
      setClassroomMeta,
      messages,
      setMessages,
      participants,
      setParticipants,

      // computed
      accessTokenHeader,
      refreshTokenHeader,
    }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
