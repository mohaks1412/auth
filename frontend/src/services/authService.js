import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

class AuthService {
  #user = null; 

  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    this.#user = response.data.user;
    return this.#user;
  }

  async register(name, email, password, confirmPassword) {
    const response = await apiClient.post('/auth/register', { name, email, password, confirmPassword });
    this.#user = response.data.user;
    return this.#user;
  }

  async logout() {
    await apiClient.post('/auth/logout');
    this.#user = null;
  }

  get name() { return this.#user?.name || null; }
  get email() { return this.#user?.email || null; }
  get id() { return this.#user?.id || null; }
  
  getUser() { return this.#user; }
  isAuthenticated() { return !!this.#user; }
  
  async init() {
    try {
      const response = await apiClient.get('/auth/me');
      this.#user = response.data;
    } catch {
      this.#user = null;
    }
  }
}

export default new AuthService();
