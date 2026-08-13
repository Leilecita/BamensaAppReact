import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';

export type CheckState = typeof APP_CONSTANTS.STATE_PENDIENT | typeof APP_CONSTANTS.STATE_DONE;

export type ReportItemCheckEntry = {
  item_operation_id?: number;
  monto_account?: number;
  number?: number;
};

export type ReportItemCheck = {
  created: string;
  load_type: string;
  monto: number;
  items: ReportItemCheckEntry[];
};

export type ReportCheck = {
  operation_id: number;
  account_mutual_id: number;
  account_client_id: number;
  check_detail_id: number;
  count_parcial_loader: number;
  amount_client: number;
  amount_mutual: number;
  percentage_bam: number;
  percentage_mutual: number;
  type: string;
  state: string;
  user_id: number;
  user_name: string;
  account_mutual_name: string;
  account_client_name: string;
  observation: string;
  load_type: string;
  total_amount: number;
  rejected_amount: number;
  total_approve_amount: number;
  operation_created: string;
  approve_date: string;
  load_date: string;
  items: ReportItemCheck[];
};

export type SavePartialLoaderInput = {
  op_id: number;
  account_client_id: number;
  account_mutual_id: number;
  amount_mutual: number;
  amount_client: number;
  amount_bam: number;
  number_parcial: number;
  approve_amount: number;
  type: 'parcial' | 'total' | 'rejection';
  amount_rejected: number;
  check_detail_id: number;
  state_parcial: string;
};

export type DeleteItemCheckInput = {
  id_1: number;
  id_2: number;
  id_3: number;
  check_detail_id: number;
  load_type: string;
};

export type CreateCheckInput = {
  total_amount: number;
  account_mutual_id: number;
  account_client_id: number;
  amount_mutual: number;
  amount_client: number;
  percentage_mutual: number;
  percentage_bam: number;
  observation: string;
  user_id: number;
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toText = (value: unknown): string => String(value ?? '').trim();

const mapCheckItemEntry = (raw: any): ReportItemCheckEntry => ({
  item_operation_id: raw?.item_operation_id === undefined ? undefined : toNumber(raw?.item_operation_id),
  monto_account: raw?.monto_account === undefined ? undefined : toNumber(raw?.monto_account),
  number: raw?.number === undefined ? undefined : toNumber(raw?.number),
});

const mapCheckItem = (raw: any): ReportItemCheck => ({
  created: toText(raw?.created),
  load_type: toText(raw?.load_type),
  monto: toNumber(raw?.monto),
  items: Array.isArray(raw?.items) ? raw.items.map(mapCheckItemEntry) : [],
});

const mapCheck = (raw: any): ReportCheck => ({
  operation_id: toNumber(raw?.operation_id ?? raw?.op_id ?? raw?.id),
  account_mutual_id: toNumber(raw?.account_mutual_id),
  account_client_id: toNumber(raw?.account_client_id),
  check_detail_id: toNumber(raw?.check_detail_id),
  count_parcial_loader: toNumber(raw?.count_parcial_loader),
  amount_client: toNumber(raw?.amount_client),
  amount_mutual: toNumber(raw?.amount_mutual),
  percentage_bam: toNumber(raw?.percentage_bam),
  percentage_mutual: toNumber(raw?.percentage_mutual),
  type: toText(raw?.type),
  state: toText(raw?.state),
  user_id: toNumber(raw?.user_id),
  user_name: toText(raw?.user_name),
  account_mutual_name: toText(raw?.account_mutual_name),
  account_client_name: toText(raw?.account_client_name),
  observation: toText(raw?.observation),
  load_type: toText(raw?.load_type),
  total_amount: toNumber(raw?.total_amount),
  rejected_amount: toNumber(raw?.rejected_amount),
  total_approve_amount: toNumber(raw?.total_approve_amount),
  operation_created: toText(raw?.operation_created),
  approve_date: toText(raw?.approve_date),
  load_date: toText(raw?.load_date),
  items: Array.isArray(raw?.items) ? raw.items.map(mapCheckItem) : [],
});

export async function fetchChecks(page: number, state: CheckState, orderBy = 'created'): Promise<ReportCheck[]> {
  const response = await api.get('/operations.php', {
    params: {
      method: 'getReportsChecksOperation',
      page,
      state,
      order: orderBy,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al obtener cheques');
  }

  const payload = data?.data ?? data;
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? Object.values(payload)
      : [];

  return source
    .map(mapCheck)
    .filter((item) => item.operation_id > 0 || item.check_detail_id > 0);
}

export async function savePartialLoader(input: SavePartialLoaderInput): Promise<ReportCheck> {
  const response = await api.get('/items_operation.php', {
    params: {
      method: 'saveParcialLoader',
      op_id: input.op_id,
      account_client_id: input.account_client_id,
      account_mutual_id: input.account_mutual_id,
      amount_mutual: input.amount_mutual,
      amount_client: input.amount_client,
      amount_bam: input.amount_bam,
      number_parcial: input.number_parcial,
      approve_amount: input.approve_amount,
      type: input.type,
      amount_rejected: input.amount_rejected,
      check_detail_id: input.check_detail_id,
      state_parcial: input.state_parcial,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al guardar carga parcial');
  }

  const payload = data?.data ?? data;
  return mapCheck(payload);
}

export async function deleteItemCheck(input: DeleteItemCheckInput): Promise<ReportCheck> {
  const response = await api.get('/items_operation.php', {
    params: {
      method: 'deleteItemCheck',
      id_1: input.id_1,
      id_2: input.id_2,
      id_3: input.id_3,
      check_detail_id: input.check_detail_id,
      load_type: input.load_type,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al eliminar la carga del cheque');
  }

  const payload = data?.data ?? data;
  return mapCheck(payload);
}

export async function createCheck(input: CreateCheckInput): Promise<void> {
  const response = await api.get('/operations.php', {
    params: {
      method: 'saveCheck2',
      total_amount: input.total_amount,
      account_mutual_id: input.account_mutual_id,
      account_client_id: input.account_client_id,
      amount_mutual: input.amount_mutual,
      amount_client: input.amount_client,
      percentage_mutual: input.percentage_mutual,
      percentage_bam: input.percentage_bam,
      obs: input.observation,
      user_id: input.user_id,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al crear cheque');
  }
}

export async function deleteCheckOperation(id: number): Promise<void> {
  const response = await api.delete('/operations.php', {
    params: { id },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al eliminar cheque');
  }
}
