import { api } from '../lib/api';

export function loginMax(payload) {
  return api.post('/api/auth/max', payload).then((r) => r.data);
}

export function loginGuest() {
  return api.post('/api/auth/guest').then((r) => r.data);
}

export function fetchMe() {
  return api.get('/api/auth/me').then((r) => r.data);
}
