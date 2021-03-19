class DataStore {
  #refreshToken;

  #accessToken;

  constructor() {
    this.#refreshToken = localStorage.getItem('refreshToken') ?? null;
    this.#accessToken = localStorage.getItem('accessToken') ?? null;
  }

  get refreshToken() {
    return this.#refreshToken;
  }

  set refreshToken(value) {
    this.#refreshToken = value;
  }

  get accessToken() {
    return this.#accessToken;
  }

  set accessToken(value) {
    this.#accessToken = value;
  }

  saveTokensToStorage() {
    localStorage.setItem('accessToken', this.#accessToken);
    localStorage.setItem('refreshToken', this.#refreshToken);
  }
}

export default new DataStore();
