import React, { useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { useStates } from '../hooks/useStates.js';

const DataStoreContext = React.createContext();

export function useDataStore() {
  return useContext(DataStoreContext);
}

export function DataStoreProvider({ children }) {
  const [savedAccessToken, saveAccessToken] = useLocalStorage('accessToken', null);
  const [savedRefreshToken, saveRefreshToken] = useLocalStorage('refreshToken', null);
  const [savedUser, saveUser] = useLocalStorage('user', null);


  // TODO: GUIDE: All app-wide states should be defined here
  const data = useStates({
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    rememberMe: true,

    // All info related to the classroom, except messages and participant list
    classroomMeta: null,
    messages: [],
    participants: [],

    user: savedUser
  });

  // if accessToken/refreshToken/user changes, save them to localStorage
  useEffect(() => {
    if (data.rememberMe) saveAccessToken(data.accessToken);
  }, [data.rememberMe, data.accessToken]);

  useEffect(() => {
    if (data.rememberMe) saveRefreshToken(data.refreshToken);
  }, [data.rememberMe, data.refreshToken]);

  useEffect(() => {
    saveUser(data.user);
  }, [data.user]);

  // TODO: GUIDE: put computed states here as functions

  function refreshTokenHeader() {
    return {
      Authorization: `Bearer ${data.refreshToken}`
    };
  }

  function accessTokenHeader() {
    return {
      Authorization: `Bearer ${data.accessToken}`
    };
  }

  return (
    <DataStoreContext.Provider value={{
      data,

      // computed
      accessTokenHeader,
      refreshTokenHeader,
    }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
