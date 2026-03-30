import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { ReportOperation } from '../../operations/services/operationService';

export type AccountOperationFilters = {
 type: string;
 coin: number;
 user: number;
 state: string;
};

const DEFAULT_ACCOUNT_OPERATION_FILTERS: AccountOperationFilters = {
 type: APP_CONSTANTS.TYPE_ALL,
 coin: APP_CONSTANTS.COIN_ALL,
 user: APP_CONSTANTS.USER_ALL,
 state: APP_CONSTANTS.STATE_ALL,
};

export async function fetchOperationsByAccount(
 page: number,
 accountId: number,
 filters: Partial<AccountOperationFilters> = {}
): Promise<ReportOperation[]> {
 const resolved = { ...DEFAULT_ACCOUNT_OPERATION_FILTERS, ...filters };

 const response = await api.get('/operations.php', {
  params: {
   method: APP_CONSTANTS.METHODS.GET_REPORTS_OPERATION,
   page,
   type: resolved.type,
   coin: resolved.coin,
   user: resolved.user,
   state: resolved.state,
   account_id: accountId,
  },
 });

 if (response.data?.result === 'success') {
  return response.data?.data ?? [];
 }

 throw new Error(response.data?.message || 'Error al obtener movimientos de la cuenta');
}
