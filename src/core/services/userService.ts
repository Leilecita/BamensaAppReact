import api from './axiosClient';
import { APP_CONSTANTS } from '../constants/appConstants';

export type AppUser = {
 id: number;
 name: string;
 level?: string;
};

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

export async function fetchUsers(): Promise<AppUser[]> {
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

 return source.map(normalizeUser).filter(Boolean) as AppUser[];
}
