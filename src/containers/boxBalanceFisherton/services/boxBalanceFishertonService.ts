import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { getAPISessionService, getAPISessionService2 } from '../../../core/services/axiosClient';
import type { ReportItemOperation } from '../../accounts/services/accountItemsOperationService';
import { flagHelper } from '../../../helpers/flagHelper';

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
  coin_name?: string;
  coin_short_name: string;
  sum_debit?: number;
  sum_credit?: number;
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

export type ReportBalanceDetail = {
  coin_id: number;
  coin_name: string;
  coin_short_name: string;
  balance: number;
  raw: any;
};

export type ReportBalanceDetailByCoin = {
  coin_id: number;
  coin_name: string;
  coin_short_name: string;
  item_created: string;
  balance: number;
  sum_pendients_day: number;
  res_caja_general: number;
  sum_dep_acc: number;
  sum_ret_acc: number;
  sum_pendients_dep_acc: number;
  sum_pendients_ret_acc: number;
  sum_gasto: number;
  sum_extr: number;
};

export type BalanceDolarizedCoin = {
  coin_id: number;
  coin_short_name: string;
  amount: number;
  rate: number;
  raw: any;
};

export type ReportBalance = {
  id: number;
  gain: number;
  rentability: number;
  real_result_gain: number;
  assigned: string;
  created: string;
  user_name: string;
  assignable: string;
  list: BalanceDolarizedCoin[];
  list_partners: any[];
  raw: any;
};

const getListFromPayload = <T = any>(payload: any): T[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  if (payload?.data && typeof payload.data === 'object') return Object.values(payload.data);
  if (payload && typeof payload === 'object') return Object.values(payload);
  return [];
};

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const normalizeItem = (item: any): ReportItemOperation => ({
  id: toNumber(item?.id ?? item?.item_id),
  coin_id: toNumber(item?.coin_id),
  operation_id: toNumber(item?.operation_id),
  account_id: toNumber(item?.account_id ?? item?.i_account_id),
  coin: String(item?.coin ?? item?.coin_short_name ?? item?.coin_name ?? ''),
  debit: toNumber(item?.debit),
  credit: toNumber(item?.credit),
  balance: toNumber(item?.balance),
  state: String(item?.state ?? APP_CONSTANTS.STATE_DONE),
  user_name: String(item?.user_name ?? ''),
  client_name_account: String(item?.client_name_account ?? item?.client_name ?? ''),
  operation_type: String(item?.operation_type ?? item?.type ?? ''),
  observation: String(item?.observation ?? ''),
  nota: String(item?.nota ?? ''),
  created: String(item?.created ?? item?.i_created ?? item?.item_created ?? ''),
  commission: item?.commission === undefined ? undefined : toNumber(item?.commission),
  item_number: item?.item_number === undefined ? undefined : toNumber(item?.item_number),
  approve_amount: item?.approve_amount === undefined ? undefined : toNumber(item?.approve_amount),
});

const normalizeBoxCoin = (item: any): ReportBoxCoin => {
  const coinId = toNumber(item?.coin_id);
  return {
    coin_id: coinId,
    coin_name: String(item?.coin_name ?? ''),
    coin_short_name: String(item?.coin_short_name ?? flagHelper.getShortName(coinId) ?? '')
      .toUpperCase()
      .trim(),
    sum_debit: item?.sum_debit === undefined ? undefined : toNumber(item?.sum_debit),
    sum_credit: item?.sum_credit === undefined ? undefined : toNumber(item?.sum_credit),
    balance: toNumber(item?.balance),
    pendients: toNumber(item?.pendients),
  };
};

const normalizeReportBalanceDetail = (item: any): ReportBalanceDetail => ({
  coin_id: Number(item?.coin_id ?? item?.id ?? 0) || 0,
  coin_name: String(item?.coin_name ?? ''),
  coin_short_name: String(item?.coin_short_name ?? item?.coin_name ?? '')
    .toUpperCase()
    .trim(),
  balance: toNumber(item?.balance),
  raw: item,
});

const getNestedList = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value);
  return [];
};

const normalizeBalanceDolarizedCoin = (item: any): BalanceDolarizedCoin => {
  const shortName = String(item?.coin_name ?? item?.coin_short_name ?? '')
    .toUpperCase()
    .trim();

  return {
    coin_id: Number(item?.coin_id ?? item?.id ?? 0) || 0,
    coin_short_name: shortName,
    amount: toNumber(item?.result),
    rate: toNumber(item?.coefficient),
    raw: item,
  };
};

const normalizeReportBalance = (item: any): ReportBalance => ({
  id: Number(item?.id ?? 0) || 0,
  gain: toNumber(item?.gain),
  rentability: toNumber(item?.rentability),
  real_result_gain: toNumber(item?.real_result_gain),
  assigned: String(item?.assigned ?? 'false'),
  created: String(item?.created ?? ''),
  user_name: String(item?.user_name ?? ''),
  assignable: String(item?.assignable ?? 'false'),
  list: getNestedList(item?.list ?? item?.items ?? item?.coins ?? item?.detail ?? item?.list_items)
    .map(normalizeBalanceDolarizedCoin)
    .filter((coin) => coin.coin_short_name),
  list_partners: getNestedList(item?.list_partners ?? item?.partners ?? item?.dividends),
  raw: item,
});

export async function fetchFishertonTotalBoxCoins(): Promise<ReportBoxCoin[]> {
  const response = await getAPISessionService2().get('/items_operation_acces.php', {
    params: {
      method: 'getAmountGroupByCoin',
      bam_app: 'true',
    },
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener saldos de caja Fisherton');
  }

  return getListFromPayload<any>(response.data)
    .map(normalizeBoxCoin)
    .filter((item) => item.coin_id > 0 && Boolean(item.coin_short_name));
}

export async function fetchFishertonBalanceCoins(): Promise<ReportBalanceDetail[]> {
  const response = await getAPISessionService2().get('/items_operation_acces.php', {
    params: {
      method: 'getBalanceCoins',
      bam_app: 'true',
    },
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener saldo monedas Fisherton');
  }

  return getListFromPayload<any>(response.data)
    .map(normalizeReportBalanceDetail)
    .filter((item) => item.coin_id !== 0 && item.coin_short_name);
}

export async function fetchFishertonBoxItemsByCoin(
  page: number,
  coinId: number,
  filters: Partial<BoxMovementFilters> = {},
): Promise<ReportItemOperation[]> {
  const response = await getAPISessionService2().get('/items_operation_acces.php', {
    params: {
      method: 'getItemsByCoin',
      page,
      coin_id: coinId,
      account_id: APP_CONSTANTS.COIN_ALL,
      type: filters.type ?? APP_CONSTANTS.TYPE_ALL,
      user_id: filters.userId ?? APP_CONSTANTS.USER_ALL,
      state: filters.state ?? APP_CONSTANTS.STATE_ALL,
      bam_app: 'true',
    },
    timeout: 30000,
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener movimientos de caja Fisherton');
  }

  return getListFromPayload<any>(response.data)
    .map(normalizeItem)
    .filter((item) => item.id !== 0);
}

export async function fetchFishertonBalanceDetailByCoinTotalBox(
  coinId: number,
  groupby: 'day' | 'month' = 'day',
): Promise<ReportBalanceDetailTotalBox[]> {
  const response = await getAPISessionService2().get('/items_operation_acces.php', {
    params: {
      method: 'getBalanceDetailByCoinTotalBox',
      coin_id: coinId,
      groupby,
      bam_app: 'true',
    },
    timeout: 30000,
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener resumen de caja Fisherton por moneda');
  }

  return getListFromPayload<ReportBalanceDetailTotalBox>(response.data);
}

export async function fetchFishertonBalanceDetailByCoin(
  coinId: number,
  groupby: 'day' | 'month' = 'day',
): Promise<ReportBalanceDetailByCoin[]> {
  const response = await getAPISessionService().get('/items_operation_acces.php', {
    params: {
      method: 'getBalanceDetailByCoin',
      coin_id: coinId,
      groupby,
      bam_app: 'true',
    },
    timeout: 30000,
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener saldo monedas Fisherton por detalle');
  }

  return getListFromPayload<ReportBalanceDetailByCoin>(response.data);
}

export async function fetchFishertonBalances(page: number): Promise<ReportBalance[]> {
  const response = await getAPISessionService2().get('/items_operation_acces.php', {
    params: {
      method: 'getBalances',
      page,
      bam_app: 'true',
    },
    timeout: 30000,
  });

  if (response.data?.result && response.data.result !== 'success') {
    throw new Error(response.data?.message || 'Error al obtener balances Fisherton');
  }

  return getListFromPayload<any>(response.data)
    .map(normalizeReportBalance)
    .filter((item) => item.id !== 0);
}
