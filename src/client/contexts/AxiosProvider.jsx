import React, { useContext, useEffect, useState } from 'react';
import axiosStatic from 'axios';
import env from '../environment.js';
import { useDataStore } from './DataStoreProvider.jsx';

const AxiosContext = React.createContext();

export function useAxios() {
  return useContext(AxiosContext);
}

export function AxiosProvider({ children }) {
  const {
    data,
    refreshTokenHeader,
  } = useDataStore();
  const [axios] = useState(() => axiosStatic.create({
    baseURL: env.apiBase
  }));
  useEffect(() => {
    console.log(`Requesting to ${env.apiBase}`);
    createAxiosResponseInterceptor(); // eslint-disable-line no-use-before-define
  }, []);

  /**
   * Make a request and handle axios errors automatically
   * @param {import('axios').AxiosRequestConfig} options axios request options
   * @returns {{success: Boolean, response: import('axios').AxiosResponse}} request result
   */
  async function request(options) {
    try {
      const response = await axios.request(options);
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

  function createAxiosResponseInterceptor() {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
          return Promise.reject(error);
        }

        /*
        * When response code is 401, try to refresh the token.
        * Eject the interceptor so it doesn't loop in case
        * token refresh causes the 401 response
        */
        axios.interceptors.response.eject(interceptor);

        return refreshAccessToken()
          .then((result) => {
            if (result.success) {
              error.response.config.headers.Authorization = `Bearer ${result.response.data.accessToken}`; // eslint-disable-line no-param-reassign
              createAxiosResponseInterceptor();
              return axios(error.response.config);
            }

            data.accessToken = null;
            data.refreshToken = null;
            // TODO: should route to /login
            return Promise.reject(error);
          }).catch((e) => {
            data.accessToken = null;
            data.refreshToken = null;
            // TODO: should route to /login
            return Promise.reject(e);
          })
          .finally(createAxiosResponseInterceptor);
      }
    );
  }

  return (
    <AxiosContext.Provider value={request}>
      {children}
    </AxiosContext.Provider>
  );
}
