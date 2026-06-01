import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { valuesHelper } from '../../../helpers/valuesHelper';
import {
 createBalance,
 createBalanceFisherton,
 CreatedBalance,
 ReportBoxCoin,
} from './boxBalanceService';
import {
 CreateOperationPayload,
 postOperation,
 postOperationAppOriginal,
} from '../../operations/services/operationService';

export type BalanceDraftRow = {
 coin_id: number;
 coin_short_name: string;
 balance: number;
 rate: string;
};

export const createDraftRows = (items: ReportBoxCoin[]): BalanceDraftRow[] =>
 items.map((item) => ({
  coin_id: item.coin_id,
  coin_short_name: item.coin_short_name,
  balance: Number(item.balance ?? 0),
  rate: '',
 }));

export const parseNumberInput = (value: string) => {
 const parsed = Number(String(value).replace(',', '.').trim());
 return Number.isFinite(parsed) ? parsed : 0;
};

const toRateNumber = (value: string) => {
 const parsed = Number(String(value).replace(',', '.'));
 return Number.isFinite(parsed) ? parsed : 0;
};

export const getAutoUsdValue = (balance: number, coinShortName: string, rate: string) => {
 const normalizedCoin = String(coinShortName ?? '').trim().toUpperCase();
 const parsedRate = toRateNumber(rate);

 if (parsedRate <= 0) return null;

 if (normalizedCoin === 'EUR') {
  return valuesHelper.roundTwoDecimals(balance * parsedRate);
 }

 return valuesHelper.roundTwoDecimals(balance / parsedRate);
};

export const calculateTotalUsd = (rows: BalanceDraftRow[]) =>
 rows.reduce((acc, item) => {
  const next = getAutoUsdValue(item.balance, item.coin_short_name, item.rate);
  return acc + (typeof next === 'number' && Number.isFinite(next) ? next : 0);
 }, 0);

export const hasAllRatesLoaded = (rows: BalanceDraftRow[]) =>
 rows.length > 0 && rows.every((item) => String(item.rate).trim().length > 0);

export const buildItemsPayload = (rows: BalanceDraftRow[]) =>
 rows
  .map((item) => {
   const result = getAutoUsdValue(item.balance, item.coin_short_name, item.rate);
   return {
    coinName: item.coin_short_name,
    coefficient: parseNumberInput(item.rate),
    result: typeof result === 'number' ? result : 0,
   };
  })
  .map((item) => `${item.coinName} ${item.coefficient} ${item.result}`)
  .join(';');

export const buildBalancePayload = (gain: number, userId: number, assignable: boolean) =>
 `${gain} ${userId} ${assignable ? 'true' : 'false'}`;

const buildOperationPayload = (input: {
 type: typeof APP_CONSTANTS.TYPE_DEPOSITO | typeof APP_CONSTANTS.TYPE_RETIRO;
 accountId: number;
 amount: number;
 created: string;
 userId: number;
 inAccountId?: number;
 outAccountId?: number;
 inCoinId?: number;
 outCoinId?: number;
 observation?: string;
}): CreateOperationPayload => ({
 type: input.type,
 exchange: 0,
 created: input.created,
 observation: input.observation ?? 'balanceFisherton',
 account_id: input.accountId,
 user_id: input.userId,
 in_coin_id: input.inCoinId ?? APP_CONSTANTS.ID_COIN_USD,
 in_account_id: input.inAccountId ?? input.accountId,
 in_state: APP_CONSTANTS.STATE_DONE,
 amount_credit: input.type === APP_CONSTANTS.TYPE_DEPOSITO ? input.amount : 0,
 out_coin_id: input.outCoinId ?? APP_CONSTANTS.ID_COIN_USD,
 out_account_id: input.outAccountId ?? input.accountId,
 out_state: APP_CONSTANTS.STATE_DONE,
 amount_debit: input.type === APP_CONSTANTS.TYPE_RETIRO ? input.amount : 0,
 nota: '',
 operation_id_ant: -1,
});

export async function runFishertonAssignableFlow(input: {
 amount: number;
 createdDate: string;
 userId: number;
 rows: BalanceDraftRow[];
}): Promise<CreatedBalance> {
 await postOperation(
  buildOperationPayload({
   type: APP_CONSTANTS.TYPE_DEPOSITO,
   accountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_CENTRO_EN_APP_FISHERTON,
   inAccountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_CENTRO_EN_APP_FISHERTON,
   outAccountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_CENTRO_EN_APP_FISHERTON,
   amount: input.amount,
   created: input.createdDate,
   userId: input.userId,
  }),
 );

 await postOperationAppOriginal(
  buildOperationPayload({
   type: APP_CONSTANTS.TYPE_RETIRO,
   accountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL,
   inAccountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL,
   outAccountId: APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL,
   amount: input.amount,
   created: input.createdDate,
   userId: input.userId,
  }),
 );

 await postOperation(
  buildOperationPayload({
   type: APP_CONSTANTS.TYPE_RETIRO,
   accountId: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
   inAccountId: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
   outAccountId: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
   amount: input.amount,
   created: input.createdDate,
   userId: input.userId,
  }),
 );

 return createBalanceFisherton(
  buildItemsPayload(input.rows),
  buildBalancePayload(input.amount, input.userId, true),
 );
}

export async function saveCreateBalance(input: {
 rows: BalanceDraftRow[];
 userId: number;
 gain: number;
 assignable: boolean;
 isFisherton: boolean;
 createdDate: string;
}): Promise<CreatedBalance> {
 if (input.assignable && input.isFisherton) {
  return runFishertonAssignableFlow({
   amount: input.gain,
   createdDate: input.createdDate,
   userId: input.userId,
   rows: input.rows,
  });
 }

 return createBalance(
  buildItemsPayload(input.rows),
  buildBalancePayload(input.gain, input.userId, input.assignable),
 );
}
