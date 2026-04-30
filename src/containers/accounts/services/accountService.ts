import api from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { fetchCoins } from '../../coins/services/coinService';
import { flagHelper } from '../../../helpers/flagHelper';

export type Account = {
 id: number;
 firstName: string;
 lastName: string;
 name: string;
 category: string;
 color: string;
 phone: string;
 protectedAccount: string;
};

export type ReportBoxCoin = {
 coin_id: number;
 coin_name: string;
 coin_short_name: string;
 sum_debit: number;
 sum_credit: number;
 balance: number;
 pendients: number;
};

export type ReportAccount = {
 account: Account;
 balance: ReportBoxCoin[];
 raw: any;
};

type FetchAccountsParams = {
 page: number;
 query: string;
 category: string;
};

type FetchSpecialAccountsParams = {
 page: number;
};

type AccountsRequestParams = {
 page: number;
 query?: string;
 category?: string;
 method?: string;
};

export type CreateAccountData = {
 client_name: string;
 category: string;
 phone: string;
 color: string;
 client_surname?: string;
 address?: string;
 cuit?: string;
 observation?: string;
};

export type CreatedAccount = {
 id: number;
 client_name: string;
 client_surname: string;
};

export type UpdateAccountData = {
 id: number;
 client_name: string;
 client_surname?: string;
 category?: string;
 phone?: string;
 address?: string;
 cuit?: string;
 observation?: string;
 color?: string;
 created?: string;
 protected_account?: string;
};

const FALLBACK_COIN_SHORT_BY_ID: Record<number, string> = {
 1: 'ARS',
 2: 'USD',
 3: 'EUR',
 4: 'BRA',
};

let coinsCatalogLoaded = false;
let coinsCatalogPromise: Promise<void> | null = null;

const pickNumber = (value: unknown): number | null => {
 const n = Number(value);
 return Number.isFinite(n) ? n : null;
};

const ensureCoinsCatalog = async (): Promise<void> => {
 if (coinsCatalogLoaded) return;
 if (!coinsCatalogPromise) {
  coinsCatalogPromise = (async () => {
   try {
    const coins = await fetchCoins();
    flagHelper.setCoins(
     coins.map((coin) => ({
      id: coin.id,
      name: coin.name,
      short_name: coin.short_name,
     })),
    );
   } catch {
    // fallback local mapping
   } finally {
    coinsCatalogLoaded = true;
   }
  })();
 }
 await coinsCatalogPromise;
};

const toNumber = (value: unknown): number => {
 if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
 if (typeof value === 'string') {
  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
 }
 const parsed = Number(value ?? 0);
 return Number.isFinite(parsed) ? parsed : 0;
};

const mapBalanceItem = (b: any): ReportBoxCoin => {
 const coinNode = b?.coin ?? b?.currency ?? b?.coin_data ?? {};
 const coinId = Number(b?.coin_id ?? b?.id ?? coinNode?.id ?? 0);
 const mappedShortByIdFromHelper = String(
  flagHelper.getCoins().find((coin) => coin.id === coinId)?.short_name ?? '',
 )
 .toUpperCase()
 .trim();
 const mappedShortById = mappedShortByIdFromHelper || FALLBACK_COIN_SHORT_BY_ID[coinId] || '';
 const mappedNameById = flagHelper.getNameById(coinId);
 const resolvedShortName = String(
  b?.coin_short_name ??
   b?.short_name ??
   b?.symbol ??
   coinNode?.short_name ??
   coinNode?.symbol ??
   coinNode?.name ??
   mappedShortById ??
   b?.coin_name ??
   b?.coin ??
   ''
 )
  .toUpperCase()
  .trim();
 const resolvedCoinName = String(
  b?.coin_name ??
  b?.name ??
  coinNode?.name ??
  mappedNameById ??
   resolvedShortName
 )
  .trim();

 return {
  coin_id: coinId,
  coin_name: resolvedCoinName,
  coin_short_name: resolvedShortName,
  sum_debit: toNumber(b?.sum_debit ?? b?.debit),
  sum_credit: toNumber(b?.sum_credit ?? b?.credit),
  balance: toNumber(b?.balance ?? b?.amount ?? b?.value ?? b?.sum_balance),
  pendients: toNumber(b?.pendients ?? b?.pending),
 };
};

const normalizeBalances = (item: any): ReportBoxCoin[] => {
 const accountNode = item?.account ?? {};
 const raw =
  item?.balance ??
  item?.balances ??
  item?.coins ??
  item?.coin_balances ??
  item?.report_box_coin ??
  item?.report_box_coins ??
  accountNode?.balance ??
  accountNode?.balances ??
  accountNode?.coins ??
  accountNode?.report_box_coin ??
  accountNode?.report_box_coins;
 const fromArray = Array.isArray(raw)
  ? raw
  : raw && typeof raw === 'object'
   ? Object.values(raw)
   : null;

 if (fromArray) {
  return fromArray.map((b: any) => mapBalanceItem(b)).filter((b: ReportBoxCoin) => !!b.coin_short_name);
 }

 const candidates: ReportBoxCoin[] = [];
 const byKey: Record<string, unknown> = {
  ARS: item?.ars,
  USD: item?.usd,
  EUR: item?.eur,
  BRA: item?.bra,
 };

 Object.entries(byKey).forEach(([coin, value]) => {
  const amount = pickNumber(value);
  if (amount !== null) {
   candidates.push({
    coin_id: 0,
    coin_name: coin,
    coin_short_name: coin,
    sum_debit: 0,
    sum_credit: 0,
    balance: amount,
    pendients: 0,
   });
  }
 });

 return candidates;
};

const normalizeItem = (item: any): ReportAccount => {
 const accountRaw = item?.account ?? item;
 const id = Number(accountRaw?.id ?? accountRaw?.account_id ?? item?.id ?? item?.account_id ?? 0);
 const firstName = String(
  accountRaw?.client_name ??
   accountRaw?.name ??
   accountRaw?.account_name ??
   accountRaw?.client_name_account ??
   accountRaw?.title ??
   item?.name ??
   ''
 ).trim();
 const lastName = String(accountRaw?.client_surname ?? accountRaw?.surname ?? '').trim();
 const fullName = `${firstName}${lastName ? ` ${lastName}` : ''}`.trim();
 const name = fullName || '-';
 const category = String(
  accountRaw?.category ??
   accountRaw?.type ??
   accountRaw?.kind ??
   item?.category ??
   APP_CONSTANTS.CATEGORY_BASIC
 ).toLowerCase();
 const color = String(accountRaw?.color ?? '#9D92B6');
 const phone = String(accountRaw?.phone ?? '');
 const protectedAccount = String(accountRaw?.protected_account ?? 'false');

 const normalizedId = Number.isFinite(id) ? id : 0;

 return {
  account: {
   id: normalizedId,
   firstName,
   lastName,
   name,
   category,
   color,
   phone,
   protectedAccount,
  },
  balance: normalizeBalances(item),
  raw: item,
 };
};

export async function fetchAccounts({
 page,
 query,
 category,
}: FetchAccountsParams): Promise<ReportAccount[]> {
 return requestAccounts({
  method: 'getReportAccount',
  page,
  query,
  category,
 });
}

export async function fetchSpecialAccounts({
 page,
}: FetchSpecialAccountsParams): Promise<ReportAccount[]> {
 return requestAccounts({ method: 'getReportSpecialAccount', page });
}

export async function createAccount(accountData: CreateAccountData): Promise<CreatedAccount> {
 const response = await api.post('/accounts.php', accountData);
 const data = response.data;

 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al crear cuenta');
 }

 const raw = data?.data ?? data;
 const item = Array.isArray(raw) ? raw[0] : raw;
 const id = Number(item?.id ?? item?.account_id ?? 0);
 const clientName = String(item?.client_name ?? accountData.client_name ?? '').trim();
 const clientSurname = String(item?.client_surname ?? accountData.client_surname ?? '').trim();

 if (!Number.isFinite(id) || id <= 0) {
  throw new Error('La cuenta se creó pero el backend no devolvió un id válido');
 }

 return {
  id,
  client_name: clientName,
  client_surname: clientSurname,
 };
}

export async function updateAccount(accountData: UpdateAccountData): Promise<void> {
 const response = await api.put('/accounts.php', accountData);
 const data = response.data;

 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al modificar cuenta');
 }
}

async function requestAccounts(params: AccountsRequestParams): Promise<ReportAccount[]> {
 await ensureCoinsCatalog();
 const response = await api.get('/accounts.php', { params });
 const data = response.data;

 if (data?.result && data.result !== 'success') {
  throw new Error(data?.message || 'Error al obtener cuentas');
 }

 const payload = data?.data ?? data;
 const source = Array.isArray(payload)
  ? payload
  : payload && typeof payload === 'object'
   ? Object.values(payload)
   : [];

 if (__DEV__) {
  console.log('[accounts] request params =>', params);
  console.log('[accounts] source length =>', source.length);
  source.slice(0, 3).forEach((item: any, index: number) => {
   console.log(`[accounts] raw[${index}] balance =>`, item?.balance);
   console.log(`[accounts] raw[${index}] balances =>`, item?.balances);
   console.log(`[accounts] raw[${index}] report_box_coin =>`, item?.report_box_coin);
   console.log(`[accounts] raw[${index}] account.balance =>`, item?.account?.balance);
  });
 }

 const normalized = source.map(normalizeItem).filter((item) => item.account.id !== 0);

 if (__DEV__) {
  normalized.slice(0, 5).forEach((item, index) => {
   console.log(
    `[accounts] normalized[${index}] id=${item.account.id} name=${item.account.name} balanceCount=${item.balance.length}`,
   );
   console.log(`[accounts] normalized[${index}] balances =>`, item.balance);
  });
 }

 return normalized;
}
