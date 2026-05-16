import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { dateHelper } from '../../../helpers/dateHelper';

export type ReportOperation = {
 operation_id: number;
 type: string;
 exchange: number;
 account_name: string;
 account_id?: number | string;
 nota?: string;
 observation?: string;
 user_name?: string;
 cant_op_day?: number;
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

export type CreateOperationPayload = {
 type: string;
 exchange: number;
 created: string;
 observation: string;
 account_id: number;
 user_id: number;
 in_coin_id: number;
 in_account_id: number;
 in_state: string;
 amount_credit: number;
 out_coin_id: number;
 out_account_id: number;
 out_state: string;
 amount_debit: number;
 nota: string;
 operation_id_ant: number;
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

export async function postOperation(payload: CreateOperationPayload): Promise<void> {
 const response = await api.post('/operations.php', payload);
 const data = response.data;
 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al guardar operación');
 }
}

export async function deleteOperation(id: number): Promise<void> {
 const response = await api.delete('/operations.php', {
  params: { id },
 });
 const data = response.data;
 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al eliminar operación');
 }
}

export async function updateOperationObservation(input: {
 id: number;
 observation: string;
 nota?: string;
}): Promise<void> {
 const response = await api.put('/operations.php', {
  id: input.id,
  observation: input.observation,
  nota: input.nota ?? '',
 });
 const data = response.data;
 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al actualizar observación');
 }
}

export async function postAffectClientOperation(input: {
 operation: ReportOperation;
 side: 'in' | 'out';
 userId: number;
}): Promise<{ suffix: '*ACI' | '*ACO' }> {
 const accountId = Number(
  input.operation.account_id ??
   input.operation.item_in?.account_id ??
   input.operation.item_out?.account_id ??
   0
 );

 if (!accountId) {
  throw new Error('No se pudo identificar la cuenta de la operación.');
 }

 const isAffectIn = input.side === 'in';
 const selectedType = isAffectIn ? APP_CONSTANTS.TYPE_RETIRO : APP_CONSTANTS.TYPE_DEPOSITO;
 const suffix = isAffectIn ? '*ACI' : '*ACO';

  const payload: CreateOperationPayload = {
  type: selectedType,
  exchange: 0,
  created: dateHelper.getActualDate(),
  observation: '',
  nota: suffix,
  operation_id_ant: input.operation.operation_id,
  account_id: accountId,
  user_id: input.userId,
  in_coin_id: isAffectIn
   ? Number(input.operation.item_in.coin_id ?? 0)
   : Number(input.operation.item_out.coin_id ?? 0),
  in_account_id: accountId,
  in_state: APP_CONSTANTS.STATE_DONE,
  amount_credit: isAffectIn ? 0 : Number(input.operation.item_out.debit ?? 0),
  out_coin_id: isAffectIn
   ? Number(input.operation.item_in.coin_id ?? 0)
   : Number(input.operation.item_out.coin_id ?? 0),
  out_account_id: accountId,
  out_state: APP_CONSTANTS.STATE_DONE,
  amount_debit: isAffectIn ? Number(input.operation.item_in.credit ?? 0) : 0,
 };

 if (!payload.in_coin_id || !payload.out_coin_id) {
  throw new Error('No se pudo identificar la moneda de la operación.');
 }

 await postOperation(payload);
 return { suffix };
}

export async function affectClientOperationAndSync(input: {
 operation: ReportOperation;
 side: 'in' | 'out';
 userId: number;
}): Promise<void> {
 const { suffix } = await postAffectClientOperation(input);
 await updateOperationObservation({
  id: input.operation.operation_id,
  observation: String(input.operation.observation ?? ''),
  nota: `${String(input.operation.nota ?? '')}${suffix}`,
 });
}
