import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';

export type ReportOperation = {
 operation_id: number;
 type: string;
 exchange: number;
 account_name: string;
 account_id?: number | string;
 nota?: string;
 operation_created: string;

 item_in: {
  id?: number | string;
  coin_id?: number | string;
  operation_id?: number | string;
  account_id?: number | string;
  coin: string;
  debit?: number;
  credit: number;
  balance?: number;
  state: string;
  user_name?: string;
  client_name_account: string;
  operation_type?: string;
  observation?: string;
  nota?: string;
  created?: string;
  commission?: number;
  item_number?: number;
  approve_amount?: number;
 };

 item_out: {
  id?: number | string;
  coin_id?: number | string;
  operation_id?: number | string;
  account_id?: number | string;
  coin: string;
  debit: number;
  credit?: number;
  balance?: number;
  state: string;
  user_name?: string;
  client_name_account: string;
  operation_type?: string;
  observation?: string;
  nota?: string;
  created?: string;
  commission?: number;
  item_number?: number;
  approve_amount?: number;
 };
};

export type OperationFilters = {
 type: string;
 coin: number;
 user: number;
 state: string;
};

const DEFAULT_OPERATION_FILTERS: OperationFilters = {
 type: APP_CONSTANTS.TYPE_ALL,
 coin: APP_CONSTANTS.COIN_ALL,
 user: APP_CONSTANTS.USER_ALL,
 state: APP_CONSTANTS.STATE_ALL,
};

export async function fetchOperations(
 page: number,
 filters: Partial<OperationFilters> = {}
): Promise<ReportOperation[]> {
 const resolved = { ...DEFAULT_OPERATION_FILTERS, ...filters };

 const response = await api.get('/operations.php', {
  params: {
   method: APP_CONSTANTS.METHODS.GET_REPORTS_OPERATION,
   page,
   type: resolved.type,
   coin: resolved.coin,
   user: resolved.user,
   state: resolved.state,
  },
 });
 if (response.data.result === 'success') {
  return response.data.data ?? [];
 } else {
  throw new Error(response.data.message || 'Error al obtener operaciones');
 }
}
