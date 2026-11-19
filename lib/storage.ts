import { Request } from './types';
import { mockRequests } from './mock-data';

const STORAGE_KEY = 'nani_requests_v3';

export function getStoredRequests(): Request[] {
  if (typeof window === 'undefined') {
    return mockRequests;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRequests));
      return mockRequests;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : mockRequests;
  } catch (e) {
    console.error('Error reading nani requests from storage', e);
    return mockRequests;
  }
}

export function saveStoredRequests(requests: Request[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('nani_requests_updated'));
  } catch (e) {
    console.error('Error saving nani requests to storage', e);
  }
}

export function addStoredRequest(newReq: Request): void {
  const current = getStoredRequests();
  const updated = [newReq, ...current];
  saveStoredRequests(updated);
}

export function updateStoredRequest(id: string, updater: (prev: Request) => Request): void {
  const current = getStoredRequests();
  const updated = current.map(r => r.id === id ? updater(r) : r);
  saveStoredRequests(updated);
}

export function resetStoredRequests(): Request[] {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRequests));
    window.dispatchEvent(new Event('nani_requests_updated'));
  }
  return mockRequests;
}
