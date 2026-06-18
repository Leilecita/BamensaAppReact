import api from '../../../core/services/axiosClient';

export type ReportItemTransfer = {
  id: number;
  coin_id: number;
  operation_id: number;
  account_id: number;
  coin: string;
  debit: number;
  credit: number;
  state: string;
  user_name: string;
  client_name_account: string;
  operation_type: string;
  observation: string;
  nota: string;
  created: string;
  commission: number;
};

export type ReportTransfer = {
  operation_id: number;
  type: string;
  user_id: number;
  user_name: string;
  observation: string;
  item_one: ReportItemTransfer;
  item_two: ReportItemTransfer;
  item_three: ReportItemTransfer;
  item_four: ReportItemTransfer;
  operation_created: string;
};

export type CreateTransferInput = {
  info_items: string;
  observation: string;
  user_id: number;
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toText = (value: unknown): string => String(value ?? '').trim();

const mapTransferItem = (raw: any): ReportItemTransfer => ({
  id: toNumber(raw?.id),
  coin_id: toNumber(raw?.coin_id),
  operation_id: toNumber(raw?.operation_id),
  account_id: toNumber(raw?.account_id),
  coin: toText(raw?.coin),
  debit: toNumber(raw?.debit),
  credit: toNumber(raw?.credit),
  state: toText(raw?.state),
  user_name: toText(raw?.user_name),
  client_name_account: toText(raw?.client_name_account),
  operation_type: toText(raw?.operation_type),
  observation: toText(raw?.observation),
  nota: toText(raw?.nota),
  created: toText(raw?.created),
  commission: toNumber(raw?.commission),
});

const EMPTY_TRANSFER_ITEM: ReportItemTransfer = {
  id: 0,
  coin_id: 0,
  operation_id: 0,
  account_id: 0,
  coin: '',
  debit: 0,
  credit: 0,
  state: '',
  user_name: '',
  client_name_account: '',
  operation_type: '',
  observation: '',
  nota: '',
  created: '',
  commission: 0,
};

const mapTransfer = (raw: any): ReportTransfer => ({
  operation_id: toNumber(raw?.operation_id ?? raw?.id),
  type: toText(raw?.type),
  user_id: toNumber(raw?.user_id),
  user_name: toText(raw?.user_name),
  observation: toText(raw?.observation),
  item_one: raw?.item_one ? mapTransferItem(raw.item_one) : EMPTY_TRANSFER_ITEM,
  item_two: raw?.item_two ? mapTransferItem(raw.item_two) : EMPTY_TRANSFER_ITEM,
  item_three: raw?.item_three ? mapTransferItem(raw.item_three) : EMPTY_TRANSFER_ITEM,
  item_four: raw?.item_four ? mapTransferItem(raw.item_four) : EMPTY_TRANSFER_ITEM,
  operation_created: toText(raw?.operation_created),
});

export async function fetchTransfers(page: number): Promise<ReportTransfer[]> {
  const response = await api.get('/operations.php', {
    params: {
      method: 'getReportsTransfersOperation',
      page,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al obtener transferencias');
  }

  const payload = data?.data ?? data;
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? Object.values(payload)
      : [];

  return source
    .map(mapTransfer)
    .filter((item) => item.operation_id > 0);
}

export async function createTransfer(input: CreateTransferInput): Promise<void> {
  const response = await api.get('/operations.php', {
    params: {
      method: 'saveTransfer',
      info_items: input.info_items,
      obs: input.observation,
      user_id: input.user_id,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al crear transferencia');
  }
}
