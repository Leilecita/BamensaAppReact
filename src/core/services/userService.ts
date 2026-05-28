import api from './axiosClient';
import { APP_CONSTANTS } from '../constants/appConstants';

export type AppUser = {
 id: number;
 name: string;
 level?: string;
};

let cachedUsers: AppUser[] = [];
let usersRequestPromise: Promise<AppUser[]> | null = null;

const normalizeUser = (raw: any): AppUser | null => {
 const id = Number(raw?.id ?? raw?.user_id ?? 0);
 const name = String(raw?.name ?? raw?.user_name ?? raw?.username ?? '').trim();

 if (!id || !name) return null;

 return {
  id,
  name,
  level: raw?.level ? String(raw.level) : undefined,
 };
};

export async function fetchUsers(forceRefresh = false): Promise<AppUser[]> {
 if (!forceRefresh && cachedUsers.length > 0) {
  return cachedUsers;
 }

 if (!forceRefresh && usersRequestPromise) {
  return usersRequestPromise;
 }

 usersRequestPromise = (async () => {
  const response = await api.get('/login.php', {
   params: {
    method: APP_CONSTANTS.METHODS.GET_ALL_USERS,
   },
  });

  const payload = response.data;
  const source = Array.isArray(payload?.data)
   ? payload.data
   : Array.isArray(payload)
    ? payload
    : [];

  const users = source.map(normalizeUser).filter(Boolean) as AppUser[];
  cachedUsers = users;
  return users;
 })();

 try {
  return await usersRequestPromise;
 } finally {
  usersRequestPromise = null;
 }
}
