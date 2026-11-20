import { api } from './api';

export const register = ({ name, email, password, role }) =>
  api.post('/auth/register', { name, email, password, role });

export const login = ({ email, password }) => api.post('/auth/login', { email, password });

export const logout = () => api.post('/auth/logout');

// Returns the logged-in user, or null when there is no session.
export async function me() {
  try {
    return await api.get('/auth/me');
  } catch (err) {
    if (err.status === 401) return null;
    throw err;
  }
}
