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

export type ReportBalanceDetail = {
 coin_id: number;
 coin_name: string;
 coin_short_name: string;
 balance: number;
 raw: any;
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

export type BalancePartner = {
 id: number;
 account_id: number;
 name: string;
 surname: string;
 value: number | null;
 participation: number | null;
 assigned: string;
 balance_id: number;
 raw: any;
};

export type CreatedBalance = {
 id: number;
 gain: number;
 created: string;
 raw: any;
};

export type PartnerBalancePayload = {
 id?: number;
 balance_id: number;
 account_id: number;
 participation?: number;
 amount?: number;
 created?: string;
 assigned: string;
};

export const formatBalancePartnerParticipation = (value: number | null) => {
 if (value === null) return '-';
 return Number.isInteger(value) ? String(value) : String(value);
};

export const calculateBalancePartnerAmount = (participation: number | null, totalValue: number) => {
 if (participation === null) return 0;
 const raw = (participation * totalValue) / 100;
 const rounded1 = Math.round((raw + Number.EPSILON) * 10) / 10;
 return Math.round(rounded1);
};

export const isBalancePartnerAssigned = (partner: Pick<BalancePartner, 'assigned'>) =>
 String(partner.assigned ?? '').trim().toLowerCase() === 'true';

export const areAllBalancePartnersAssigned = (partners: Array<Pick<BalancePartner, 'assigned'>>) =>
 partners.every(isBalancePartnerAssigned);

export const getBalancePartnerDisplayName = (partner: Pick<BalancePartner, 'name' | 'surname'>) =>
 `${partner.name}${partner.surname ? ` ${partner.surname}` : ''}`;

const getListFromPayload = <T = any>(payload: any): T[] => {
 if (Array.isArray(payload?.data)) return payload.data;
 if (Array.isArray(payload)) return payload;
 if (payload?.data && typeof payload.data === 'object') return Object.values(payload.data);
 if (payload && typeof payload === 'object') return Object.values(payload);
 return [];
};

const toNumber = (value: unknown): number => {
 const parsed = Number(value ?? 0);
 return Number.isFinite(parsed) ? parsed : 0;
};

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

const normalizeReportBalanceDetail = (item: any): ReportBalanceDetail => ({
 coin_id: Number(item?.coin_id ?? item?.id ?? 0) || 0,
 coin_name: String(item?.coin_name ?? ''),
 coin_short_name: String(item?.coin_short_name ?? item?.coin_name ?? '')
  .toUpperCase()
  .trim(),
 balance: toNumber(item?.balance),
 raw: item,
});

const normalizeReportBalance = (item: any): ReportBalance => {
 return {
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
 };
};

export const normalizeBalancePartners = (items: any[]): BalancePartner[] =>
 items.map((item) => {
  const accountNode = item?.account ?? {};
  const partnerNode = item?.partner_balance ?? {};

  return {
   id: Number(partnerNode?.id ?? 0) || 0,
   account_id: Number(partnerNode?.account_id ?? 0) || 0,
   name: String(accountNode?.client_name ?? '-').trim() || '-',
   surname: String(accountNode?.client_surname ?? '').trim(),
   value: toNumber(partnerNode?.amount),
   participation: toNumber(partnerNode?.participation),
   assigned: String(partnerNode?.assigned ?? 'false'),
   balance_id: Number(partnerNode?.balance_id ?? 0) || 0,
   raw: item,
  };
 });

const normalizeCreatedBalance = (item: any): CreatedBalance => ({
 id: Number(item?.id ?? item?.balance_id ?? 0) || 0,
 gain: toNumber(item?.gain ?? item?.result ?? item?.real_result_gain),
 created: String(item?.created ?? item?.date ?? ''),
 raw: item,
});

export async function fetchPartnersAccounts(balanceId: number, page = 0): Promise<BalancePartner[]> {
 const response = await api.get('/accounts.php', {
  params: {
   method: 'getReportAccountsPartner',
   page,
   partners: 'true',
   balance_id: balanceId,
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener cuentas para dividendos');
 }

 return normalizeBalancePartners(getListFromPayload<any>(response.data));
}

export async function putPartnerBalance(payload: PartnerBalancePayload): Promise<PartnerBalancePayload> {
 const response = await api.put('/partners_balance.php', payload);

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al asignar dividendo');
 }

 const data =
  response.data?.data && typeof response.data.data === 'object'
   ? response.data.data
   : response.data;

 return {
  id: Number(data?.id ?? payload.id ?? 0) || undefined,
  balance_id: Number(data?.balance_id ?? payload.balance_id ?? 0) || 0,
  account_id: Number(data?.account_id ?? payload.account_id ?? 0) || 0,
  participation: toNumber(data?.participation ?? payload.participation),
  amount: toNumber(data?.amount ?? payload.amount),
  created: String(data?.created ?? payload.created ?? ''),
  assigned: String(data?.assigned ?? payload.assigned ?? 'false'),
 };
}

// Helpers y flujo que se usan en la division del balance entre socios.
export async function assignBalancePartnerDividend(input: {
 partner: BalancePartner;
 totalValue: number;
}): Promise<BalancePartner> {
 const partnerRaw = input.partner.raw?.partner_balance;

 if (!partnerRaw?.balance_id || !partnerRaw?.account_id) {
  throw new Error('No se pudo identificar el dividendo a asignar.');
 }

 const amount = calculateBalancePartnerAmount(input.partner.participation, input.totalValue);

 await putPartnerBalance({
  ...partnerRaw,
  amount,
  assigned: 'true',
 });

 return {
  ...input.partner,
  value: amount,
  assigned: 'true',
  raw: {
   ...input.partner.raw,
   partner_balance: {
    ...(input.partner.raw?.partner_balance ?? {}),
    amount,
    assigned: 'true',
   },
  },
 };
}

export async function createBalance(items: string, balance: string): Promise<CreatedBalance> {
 const response = await api.get('/balances.php', {
  params: {
   method: 'createItems',
   items,
   balance,
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al crear balance');
 }

 const payload =
  response.data?.data && typeof response.data.data === 'object'
   ? response.data.data
   : response.data;

 return normalizeCreatedBalance(payload);
}

export async function createBalanceFisherton(items: string, balance: string): Promise<CreatedBalance> {
 const response = await api.get('/balances.php', {
  params: {
   method: 'createItemsOnlyFisherton',
   items,
   balance,
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al crear balance Fisherton');
 }

 const payload =
  response.data?.data && typeof response.data.data === 'object'
   ? response.data.data
   : response.data;

 return normalizeCreatedBalance(payload);
}

export async function deleteBalance(id: number): Promise<void> {
 const response = await api.delete('/balances.php', {
  params: { id },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al eliminar balance');
 }
}

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

export async function fetchBalanceCoins(): Promise<ReportBalanceDetail[]> {
 const response = await api.get('/items_operation.php', {
  params: {
   method: 'getBalanceCoins',
  },
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener saldo monedas');
 }

 return getListFromPayload<any>(response.data)
  .map(normalizeReportBalanceDetail)
  .filter((item) => item.coin_id !== 0 && item.coin_short_name);
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

export async function fetchBalanceDetailByCoin(
 page: number,
 coinId: number,
 groupby: 'day' | 'month' = 'day',
): Promise<ReportBalanceDetailByCoin[]> {
 const response = await api.get('/items_operation.php', {
  params: {
   method: 'getBalanceDetailByCoin',
   page,
   coin_id: coinId,
   groupby,
  },
  timeout: 30000,
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener saldo por moneda');
 }

 return getListFromPayload<ReportBalanceDetailByCoin>(response.data);
}

export async function fetchBalances(page: number): Promise<ReportBalance[]> {
 const response = await api.get('/balances.php', {
  params: {
   method: 'getBalances',
   page,
  },
  timeout: 30000,
 });

 if (response.data?.result && response.data.result !== 'success') {
  throw new Error(response.data?.message || 'Error al obtener balances');
 }

 return getListFromPayload<any>(response.data).map(normalizeReportBalance).filter((item) => item.id !== 0);
}
