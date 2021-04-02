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
    setRefreshToken,
    refreshTokenHeader,
    setUser
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

  // TODO: API calls should be put here

  /**
   * Login with email and password
   * @param {String} email email
   * @param {String} password password
   * @returns response body
   */
  async function login(email, password) {
    const result = await request({
      method: 'POST',
      url: '/auth/login',
      data: { email, password }
    });
    if (result.success) {
      setAccessToken(result.response.data.accessToken);
      setRefreshToken(result.response.data.refreshToken);
      setUser(result.response.data.user);
    }
    return result;
  }

  /**
   * Sign up with name, email and password
   * @param {String} name user's name
   * @param {String} email email
   * @param {String} password password
   * @returns response body
   */
  async function signup(name, email, password) {
    const result = await request({
      method: 'POST',
      url: '/auth/signup',
      data: { name, email, password }
    });
    return result;
  }

  /**
   * Get user profile
   * @param {String} userId userId
   * @returns response body
   */
  async function getUserProfile(userId) {
    const result = await request({
      method: 'GET',
      url: `/user/${userId}`
    });
    if (result.success) {
      setUser(result.response.data);
    }
    return result;
  }

  return (
    <ApiContext.Provider value={{
      refreshAccessToken,
      login,
      signup,
      getUserProfile
    }}
    >
      {children}
    </ApiContext.Provider>
  );
}
