import React, { useContext } from 'react';
import { useAxios } from './AxiosProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';

const ApiContext = React.createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const {
    setAccessToken,
    refreshTokenHeader,
  } = useDataStore();
  const request = useAxios();

  /**
   * Request for a new access token.
   * The required refresh token is fetched from the data store
   * and the new access token is automatically saved.
   * @returns response body
   */
  async function refreshAccessToken() {
    const result = await request({
      method: 'GET',
      url: '/auth/token',
      headers: refreshTokenHeader()
    });
    if (result.success) setAccessToken(result.response.data.accessToken);
    return result;
  }

  /**
   * Login with email and password
   * @param {String} email email
   * @param {String} password password
   * @returns response body
   */
  function login(email, password) {
    return request({
      method: 'POST',
      url: '/auth/login',
      data: { email, password }
    });
  }

  return (
    <ApiContext.Provider value={{
      refreshAccessToken,
      login,
    }}
    >
      {children}
    </ApiContext.Provider>
  );
}
