import api from '../../../core/services/axiosClient';

export type Coin = {
 id: number;
 name: string;
 short_name: string;
 enabled_to_edith?: boolean;
 created?: string;
};

function normalizeCoinsPayload(raw: any): Coin[] {
 const source = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];

 return source
  .map((item: any) => ({
   id: Number(item?.id),
   name: String(item?.name ?? ''),
   short_name: String(item?.short_name ?? item?.shortName ?? '').trim(),
   enabled_to_edith:
    item?.enabled_to_edith === undefined ? undefined : String(item?.enabled_to_edith) === 'true',
   created: item?.created ? String(item.created) : undefined,
  }))
  .filter((item: Coin) => Number.isFinite(item.id) && !!item.short_name);
}

export async function fetchCoins(): Promise<Coin[]> {
 try {
  const response = await api.get('/coins.php');
  if (response.data?.result === 'success' || response.data?.result === undefined) {
   return normalizeCoinsPayload(response.data?.data ?? response.data);
  }

  throw new Error(response.data?.message || 'Error al obtener monedas');
 } catch (error: any) {
  const status = error?.response?.status;
  const rawMessage = error?.response?.data?.message;
  const rawData = error?.response?.data;
  const fallback = error?.message || 'Error al obtener monedas';
  const serverData =
   rawData && typeof rawData === 'object' ? JSON.stringify(rawData) : String(rawData ?? '');

  const message = rawMessage
   ? String(rawMessage)
   : status
    ? `Error ${status} al obtener monedas`
    : fallback;

  console.log('COINS ERROR:', { status, rawData, message });
  throw new Error(serverData && !rawMessage && status ? `${message} - ${serverData}` : message);
 }
}
