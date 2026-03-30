import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import api from '../../../core/services/axiosClient';

export type ReportItemOperation = {
 id: number;
 coin_id: number;
 operation_id: number;
 account_id: number;
 coin: string;
 debit: number;
 credit: number;
 balance: number;
 state: string;
 user_name: string;
 client_name_account: string;
 operation_type: string;
 observation: string;
 nota: string;
 created: string;
 commission?: number;
 item_number?: number;
 approve_amount?: number;
};

const toNumber = (value: unknown): number => {
 const n = Number(value);
 return Number.isFinite(n) ? n : 0;
};

const normalizeItem = (item: any): ReportItemOperation => ({
 id: toNumber(item?.id),
 coin_id: toNumber(item?.coin_id),
 operation_id: toNumber(item?.operation_id),
 account_id: toNumber(item?.account_id),
 coin: String(item?.coin ?? ''),
 debit: toNumber(item?.debit),
 credit: toNumber(item?.credit),
 balance: toNumber(item?.balance),
 state: String(item?.state ?? APP_CONSTANTS.STATE_DONE),
 user_name: String(item?.user_name ?? ''),
 client_name_account: String(item?.client_name_account ?? ''),
 operation_type: String(item?.operation_type ?? ''),
 observation: String(item?.observation ?? ''),
 nota: String(item?.nota ?? ''),
 created: String(item?.created ?? ''),
 commission: item?.commission === undefined ? undefined : toNumber(item?.commission),
 item_number: item?.item_number === undefined ? undefined : toNumber(item?.item_number),
 approve_amount: item?.approve_amount === undefined ? undefined : toNumber(item?.approve_amount),
});

export async function fetchItemsOperationByCoin(
 page: number,
 coinId: number,
 accountId: number
): Promise<ReportItemOperation[]> {
 const response = await api.get('/items_operation_acces.php', {
  params: {
   method: 'getItemsByCoin',
   page,
   coin_id: coinId,
   account_id: accountId,
   type: APP_CONSTANTS.TYPE_ALL,
   user_id: APP_CONSTANTS.USER_ALL,
   state: APP_CONSTANTS.STATE_ALL,
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener movimientos por moneda');
 }

 const payload = response.data?.data ?? response.data;
 const source = Array.isArray(payload)
  ? payload
  : payload && typeof payload === 'object'
   ? Object.values(payload)
   : [];

 return source.map(normalizeItem).filter((item) => item.id !== 0);
}
