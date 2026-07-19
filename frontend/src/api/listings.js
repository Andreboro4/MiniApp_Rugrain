import { api } from '../lib/api';

export function fetchListings(params = {}) {
  return api.get('/api/listings', { params }).then((r) => r.data.listings);
}

export function fetchMyListings() {
  return api.get('/api/listings/mine').then((r) => r.data.listings);
}

export function fetchListingById(id) {
  return api.get(`/api/listings/${id}`).then((r) => r.data.listing);
}

export function createListing(payload) {
  return api.post('/api/listings', payload).then((r) => r.data.listing);
}

export function updateListing(id, payload) {
  return api.patch(`/api/listings/${id}`, payload).then((r) => r.data.listing);
}

// Мягкое удаление — переводит объявление в статус CLOSED
export function deleteListing(id) {
  return api.delete(`/api/listings/${id}`).then((r) => r.data.listing);
}
