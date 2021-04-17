import React, { useContext } from 'react';
import { useAxios } from './AxiosProvider.jsx';
import { useDataStore } from './DataStoreProvider.jsx';

const ApiContext = React.createContext();

export function useApi() {
  return useContext(ApiContext);
}

export function ApiProvider({ children }) {
  const {
    data,
    accessTokenHeader,
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
    if (result.success) data.accessToken = result.response.data.accessToken;
    return result;
  }

  // GUIDE: API calls should be put here

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
      data.accessToken = result.response.data.accessToken;
      data.refreshToken = result.response.data.refreshToken;
      data.user = result.response.data.user;
    }
    return result;
  }

  /**
   * Send email request
   * @returns response body
   */
  async function sendEmail() {
    const result = await request({
      method: 'POST',
      url: '/auth/email',
      headers: accessTokenHeader()
    });
    return result;
  }

  /**
   * Logout
   * @returns response body
   */
  async function logout() {
    const result = await request({
      method: 'DELETE',
      url: '/auth/logout',
      headers: refreshTokenHeader()
    });
    if (result.success) {
      data.rememberMe = true;
      data.accessToken = null;
      data.refreshToken = null;
      data.user = null;
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
      url: `/user/${userId}`,
      headers: accessTokenHeader()
    });
    if (result.success) {
      data.user = result.response.data;
    }
    return result;
  }

  /**
   * Update user profile and change password
   * @param {String} userId userId
   * @param {Object} profile new profile data
   * @returns response body
   */
  async function updateUserProfile(userId, profile) {
    const result = await request({
      method: 'PATCH',
      url: `/user/${userId}`,
      headers: accessTokenHeader(),
      data: profile
    });
    if (result.success) {
      data.user = result.response.data;
    }
    return result;
  }

  /**
   * Get all tokens of a given user id
   * @param {String} userId userId
   * @returns response body
   */
  async function getUserTokens(userId) {
    const result = await request({
      method: 'GET',
      url: `/token/${userId}`,
      headers: accessTokenHeader()
    });
    return result;
  }

  /**
   * Sets isValid of a token to false
   * @param {String} tokenId tokenId
   * @returns response
   */
  async function setTokenFalse(tokenId) {
    const result = await request({
      method: 'PATCH',
      url: `/token/${tokenId}/invalidate`,
      headers: accessTokenHeader()
    });
    return result;
  }

  return (
    <ApiContext.Provider value={{
      refreshAccessToken,
      login,
      signup,
      sendEmail,
      logout,
      getUserProfile,
      updateUserProfile,
      getUserTokens,
      setTokenFalse
    }}
    >
      {children}
    </ApiContext.Provider>
  );
}
