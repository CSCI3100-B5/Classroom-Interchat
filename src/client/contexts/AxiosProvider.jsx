import React, { useContext, useEffect, useState } from 'react';
import axiosStatic from 'axios';
import { useStates } from 'use-states';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';

const AxiosContext = React.createContext();

/**
 * The hook used by children to access this context
 */
export function useAxios() {
  return useContext(AxiosContext);
}

/**
 * A React context component used for providing an initialized Axios client
 * to all children
 */
export function AxiosProvider({ children }) {
  const {
    data,
    refreshTokenHeader,
  } = useDataStore();
  const localData = useStates({
    axios: () => {
      const axios = axiosStatic.create({
        baseURL: env.apiBase
      });
      (function createInterceptor() {
        const interceptor = axios.interceptors.response.use(
          response => response,
          async (error) => {
            console.log('error interceptor', { ...error });
            // Reject promise if usual error
            if (error.response.status !== 401) {
              return Promise.reject(error);
            }

            /*
          * When response code is 401, try to refresh the token.
          * Eject the interceptor so it doesn't loop in case
          * token refresh causes the 401 response
          */
            console.log('Access token expired, auto-refreshing...');
            axios.interceptors.response.eject(interceptor);
            return refreshAccessToken() // eslint-disable-line no-use-before-define
              .then((result) => {
                if (result.success) {
                  error.response.config.headers.Authorization = `Bearer ${result.response.data.accessToken}`;
                  return axios.request(error.config);
                }

                data.accessToken = null;
                data.refreshToken = null;
                data.user = null;

                // pages detect changes in the refresh token and automatically
                // re-routes to /auth
                // therefore there's no need to reroute to /auth here

                return Promise.reject(error);
              }).catch((e) => {
                data.accessToken = null;
                data.refreshToken = null;
                data.user = null;

                // same situation as above

                return Promise.reject(e);
              }).finally(() => createInterceptor());
          }
        );
      }());
      console.log(`Requesting to ${env.apiBase}`);
      return axios;
    }
  });

  /**
   * Make a request and handle axios errors automatically
   * @param {import('axios').AxiosRequestConfig} options axios request options
   * @returns {{success: Boolean, response: import('axios').AxiosResponse}} request result
   */
  async function request(options) {
    try {
      const response = await localData.axios.request(options);
      return { success: true, response };
    } catch (e) {
      if (e.response) return { success: false, response: e.response };
      return Promise.reject(e);
    }
  }

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

  return (
    <AxiosContext.Provider value={request}>
      {children}
    </AxiosContext.Provider>
  );
}
