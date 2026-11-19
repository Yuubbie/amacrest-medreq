import { Request } from './types';
import { mockRequests } from './mock-data';

const STORAGE_KEY = 'nani_requests_v4';
const USER_STORAGE_KEY = 'nani_current_user_v1';

export interface AuthUser {
  id: string;
  name: string;
  roleTitle: string;
  department: string;
  unit: string;
  roleType: 'staff' | 'supervisor' | 'finance' | 'coordinator' | 'store';
  avatar?: string;
  badge?: string;
}

export const defaultUser: AuthUser = {
  id: 'staff-nurse',
  name: 'Nurse Hauwa Bello',
  roleTitle: 'Staff Nurse (Post-Op Ward)',
  department: 'Clinicals',
  unit: 'Nursing',
  roleType: 'staff',
  avatar: 'HB',
  badge: 'Frontline Clinical Staff',
};

export function getStoredUser(): AuthUser {
  if (typeof window === 'undefined') return defaultUser;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return defaultUser;
    return JSON.parse(raw);
  } catch {
    return defaultUser;
  }
}

export function saveStoredUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('nani_user_updated'));
  } catch (e) {
    console.error('Error saving user to storage', e);
  }
}

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
