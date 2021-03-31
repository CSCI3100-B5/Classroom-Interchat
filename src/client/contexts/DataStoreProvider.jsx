import React, { useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const DataStoreContext = React.createContext();

export function useDataStore() {
  return useContext(DataStoreContext);
}

export function DataStoreProvider({ children }) {
  const [savedAccessToken, saveAccessToken] = useLocalStorage('accessToken', null);
  const [savedRefreshToken, saveRefreshToken] = useLocalStorage('refreshToken', null);

  const [accessToken, pSetAccessToken] = useState(() => savedAccessToken);
  const [refreshToken, pSetRefreshToken] = useState(() => savedRefreshToken);
  const [rememberMe, setRememberMe] = useState(true);

  function setAccessToken(token) {
    pSetAccessToken(token);
    if (rememberMe) saveAccessToken(token);
  }

  function setRefreshToken(token) {
    pSetRefreshToken(token);
    if (rememberMe) saveRefreshToken(token);
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

      // computed
      accessTokenHeader,
      refreshTokenHeader,
    }}
    >
      {children}
    </DataStoreContext.Provider>
  );
}
