import axiosStatic from 'axios';
import dataStore from './dataStore.js';

class API {
  #axios;

  constructor() {
    this.#axios = axiosStatic.create({
      baseURL: 'https://classroom-interchat.herokuapp.com/api/' // change the base URL for local debug
    });
    this.createAxiosResponseInterceptor();
  }

  /**
   * Make a request and handle axios errors automatically
   * @param {import('axios').AxiosRequestConfig} options axios request options
   * @returns {{success: Boolean, response: import('axios').AxiosResponse}} request result
   */
  async request(options) {
    try {
      const response = await this.#axios.request(options);
      return { success: true, response };
    } catch (e) {
      if (e.response) return { success: false, response: e.response };
      return Promise.reject(e);
    }
  }

  static refreshTokenHeader() {
    return {
      Authorization: `Bearer ${dataStore.refreshToken}`
    };
  }

  static accessTokenHeader() {
    return {
      Authorization: `Bearer ${dataStore.accessToken}`
    };
  }

  /**
   * Request for a new access token.
   * The required refresh token is fetched from the data store
   * and the new access token is automatically saved.
   * @returns response body
   */
  async refreshToken() {
    const result = await this.request({
      method: 'GET',
      url: '/auth/token',
      headers: API.refreshTokenHeader()
    });
    if (result.success) dataStore.accessToken = result.response.data.accessToken;
    return result;
  }

  /**
   * Login with username and password
   * @param {String} username username
   * @param {String} password password
   * @returns response body
   */
  login(username, password) {
    return this.request({
      method: 'POST',
      url: '/auth/login',
      data: { username, password }
    });
  }

  createAxiosResponseInterceptor() {
    const interceptor = this.#axios.interceptors.response.use(
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
        this.#axios.interceptors.response.eject(interceptor);

        return this.refreshToken()
          .then((result) => {
            if (result.success) {
              error.response.config.headers.Authorization = `Bearer ${result.response.data.accessToken}`;
              this.createAxiosResponseInterceptor();
              return this.#axios(error.response.config);
            }

            dataStore.accessToken = null;
            dataStore.refreshToken = null;
            // TODO: should route to /login
            return Promise.reject(error);
          }).catch((e) => {
            dataStore.accessToken = null;
            dataStore.refreshToken = null;
            // TODO: should route to /login
            return Promise.reject(e);
          })
          .finally(this.createAxiosResponseInterceptor.call(this));
      }
    );
  }
}

export default new API();
