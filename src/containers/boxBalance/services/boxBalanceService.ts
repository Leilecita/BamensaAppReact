import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import api from '../../../core/services/axiosClient';
import type { ReportItemOperation } from '../../accounts/services/accountItemsOperationService';

export type BoxQuickFilter =
 | 'all'
 | 'buy'
 | 'sale'
 | 'dep'
 | 'ret'
 | 'pend'
 | 'usr';

export type BoxMovementFilters = {
 type: string;
 userId: number;
 state: string;
};

export type ReportBoxCoin = {
 coin_id: number;
 coin_short_name: string;
 balance: number;
 pendients: number;
};

export type ReportBalanceDetailTotalBox = {
 coin_id: number;
 coin_name: string;
 coin_short_name: string;
 item_created: string;
 balance: number;
 res_caja_general: number;
 res_caja_general_pendients: number;
 sum_gasto: number;
 sum_extr: number;
};

const getListFromPayload = <T = any>(payload: any): T[] => {
 if (Array.isArray(payload?.data)) return payload.data;
 if (Array.isArray(payload)) return payload;
 if (payload?.data && typeof payload.data === 'object') return Object.values(payload.data);
 if (payload && typeof payload === 'object') return Object.values(payload);
 return [];
};

export async function fetchTotalBoxCoins(): Promise<ReportBoxCoin[]> {
 const response = await api.get('/items_operation.php', {
  params: {
   method: 'getAmountGroupByCoin',
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener saldos de caja');
 }

 return getListFromPayload<ReportBoxCoin>(response.data);
}

export async function fetchBoxItemsByCoin(
 page: number,
 coinId: number,
 filters: Partial<BoxMovementFilters> = {},
): Promise<ReportItemOperation[]> {
 const response = await api.get('/items_operation_acces.php', {
  params: {
   method: 'getItemsByCoin',
   page,
   coin_id: coinId,
   account_id: APP_CONSTANTS.COIN_ALL,
   type: filters.type ?? APP_CONSTANTS.TYPE_ALL,
   user_id: filters.userId ?? APP_CONSTANTS.USER_ALL,
   state: filters.state ?? APP_CONSTANTS.STATE_ALL,
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener movimientos de caja');
 }

 return getListFromPayload<ReportItemOperation>(response.data);
}

export async function fetchBalanceDetailByCoinTotalBox(
 coinId: number,
 groupby: 'day' | 'month' = 'day',
): Promise<ReportBalanceDetailTotalBox[]> {
 const response = await api.get('/items_operation.php', {
  params: {
   method: 'getBalanceDetailByCoinTotalBox',
   coin_id: coinId,
   groupby,
  },
  timeout: 30000,
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener resumen por moneda');
 }

 return getListFromPayload<ReportBalanceDetailTotalBox>(response.data);
}
