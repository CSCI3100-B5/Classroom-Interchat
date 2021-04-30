import React, { useContext, useEffect } from 'react';
import { useStates } from 'use-states';
import useLocalStorage from '../hooks/useLocalStorage.js';

const DataStoreContext = React.createContext();

/**
 * The hook used by children to access this context
 */
export function useDataStore() {
  return useContext(DataStoreContext);
}

/**
 * A React context component storing all application-wide states
 * This eliminates a lot of the props passing between parents and children
 */
export function DataStoreProvider({ children }) {
  const [savedAccessToken, saveAccessToken] = useLocalStorage('accessToken', null);
  const [savedRefreshToken, saveRefreshToken] = useLocalStorage('refreshToken', null);
  const [savedUser, saveUser] = useLocalStorage('user', null);


  // GUIDE: All app-wide states should be defined here
  const data = useStates({
    accessToken: savedAccessToken,
    refreshToken: savedRefreshToken,
    rememberMe: true,

    peekClassroomMeta: null,

    // All info related to the classroom, except messages and participant list
    classroomMeta: null,

    messages: [],
    participants: [],

    replyToMessageId: null,

    // null for no filter
    // a message id of a question to show that thread
    // 'unresolved' to show all unresolved questions
    messageFilter: null,

    user: savedUser,

    toasts: []
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

  // GUIDE: put computed states here as functions

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

  function getSelfParticipant() {
    return data.participants.find(x => x.user.id === data.user.id);
  }

  return (
    <DataStoreContext.Provider value={{
      data,

      // computed
      accessTokenHeader,
      refreshTokenHeader,
      getSelfParticipant
    }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
