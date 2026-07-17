import { api } from '../lib/api';

export function fetchListings(params = {}) {
  return api.get('/api/listings', { params }).then((r) => r.data.listings);
}

export function fetchListingById(id) {
  return api.get(`/api/listings/${id}`).then((r) => r.data.listing);
}

export function createListing(payload) {
  return api.post('/api/listings', payload).then((r) => r.data.listing);
}
