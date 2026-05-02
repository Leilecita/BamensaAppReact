import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';

export type GroupByType = 'all' | 'day' | 'month';

export type ReportOutcome = {
 id: number;
 outcome_id: number;
 item_operation_id: number;
 description: string;
 type: string;
 coin_name: string;
 value: number;
 created: string;
 user_name: string;
 tot_ars: number;
 tot_usd: number;
};

export type CreateOutcomeData = {
 type: string;
 exchange: number;
 created: string;
 observation: string;
 account_id: number;
 user_id: number;
 out_coin_id: number;
 out_account_id: number;
 out_state: string;
 amount_debit: number;
 in_coin_id: number;
 in_account_id: number;
 in_state: string;
 amount_credit: number;
};

const toNumber = (value: unknown): number => {
 const n = Number(value);
 return Number.isFinite(n) ? n : 0;
};

const toText = (value: unknown): string => String(value ?? '').trim();

const resolveCreated = (raw: any): string => {
 const candidates = [
  raw?.outcome_created,
  raw?.created,
  raw?.operation_created,
  raw?.date,
  raw?.fecha,
  raw?.created_at,
 ];

 for (const candidate of candidates) {
  const value = toText(candidate);
  if (!value) continue;
  return value;
 }

 return '';
};

const mapOutcome = (raw: any, index: number): ReportOutcome => ({
 id: Number(raw?.outcome_id ?? raw?.item_operation_id ?? raw?.id ?? raw?.item_id ?? raw?.operation_item_id ?? index),
 outcome_id: Number(raw?.outcome_id ?? raw?.operation_id ?? raw?.id ?? 0),
 item_operation_id: Number(raw?.item_operation_id ?? raw?.item_id ?? raw?.operation_item_id ?? 0),
 description: toText(raw?.description ?? raw?.observation ?? raw?.obs ?? raw?.detail ?? raw?.type),
 type: toText(raw?.type ?? APP_CONSTANTS.TYPE_GASTO),
 coin_name: toText(raw?.coin_name ?? raw?.coin ?? raw?.coin_short_name ?? 'ARS').toUpperCase(),
 value: toNumber(raw?.value ?? raw?.debit ?? raw?.amount ?? raw?.total),
 created: resolveCreated(raw),
 user_name: toText(raw?.user_name ?? raw?.user ?? ''),
 tot_ars: toNumber(raw?.tot_ars),
 tot_usd: toNumber(raw?.tot_usd),
});

export async function fetchOutcomes(page: number, coinId: number, groupBy: GroupByType): Promise<ReportOutcome[]> {
 const response = await api.get('/items_operation.php', {
  params: {
   method: 'getOutcomes',
   page,
   coin_id: coinId,
   group_by: groupBy,
  },
 });

 const data = response.data;
 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al obtener gastos');
 }

 const payload = data?.data ?? data;
 const source = Array.isArray(payload)
  ? payload
  : payload && typeof payload === 'object'
   ? Object.values(payload)
   : [];

 return source.map((item, index) => mapOutcome(item, index));
}

export async function createOutcome(data: CreateOutcomeData) {
 const response = await api.post('/operations.php', data);
 const responseData = response.data;
 if (responseData?.result && responseData.result !== 'success') {
  throw new Error(responseData?.message || 'Error al crear gasto');
 }
 return responseData?.data ?? responseData;
}

export type UpdateOutcomeItemData = {
 id: number;
 state: string;
 debit: number;
 credit: number;
 coin_id: number;
 created: string;
};

export async function updateOutcomeItem(data: UpdateOutcomeItemData) {
 const response = await api.put('/items_operation.php', data);
 const responseData = response.data;
 if (responseData?.result && responseData.result !== 'success') {
  throw new Error(responseData?.message || 'Error al editar item de gasto');
 }
 return responseData?.data ?? responseData;
}

export type UpdateOutcomeOperationData = {
 id: number;
 observation: string;
 created: string;
};

export async function updateOutcomeOperation(data: UpdateOutcomeOperationData) {
 const response = await api.put('/operations.php', data);
 const responseData = response.data;
 if (responseData?.result && responseData.result !== 'success') {
  throw new Error(responseData?.message || 'Error al editar gasto');
 }
 return responseData?.data ?? responseData;
}

export async function deleteOutcomeOperation(id: number) {
 const response = await api.delete('/operations.php', {
  params: { id },
 });
 const responseData = response.data;
 if (responseData?.result && responseData.result !== 'success') {
  throw new Error(responseData?.message || 'Error al eliminar gasto');
 }
 return responseData?.data ?? responseData;
}
