import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { getAPIServiceBamApp, getAPISessionService } from '../../../core/services/axiosClient';

type OperationState = typeof APP_CONSTANTS.STATE_DONE | typeof APP_CONSTANTS.STATE_PENDIENT;

export type CreateMovementInput = {
  type: typeof APP_CONSTANTS.TYPE_DEPOSITO | typeof APP_CONSTANTS.TYPE_RETIRO;
  coinId: number;
  amount: number;
  observation: string;
  created: string;
  accountId: number;
  userId: number;
  state: OperationState;
};

const normalizeUrl = (value: string): string => value.trim().replace(/\/+$/, '');

const buildPayload = (input: CreateMovementInput, accountId: number) => {
  const isRetiro = input.type === APP_CONSTANTS.TYPE_RETIRO;
  const retiroState = APP_CONSTANTS.STATE_DONE;

  return {
    type: input.type,
    exchange: 0,
    created: input.created,
    observation: input.observation,
    account_id: accountId,
    user_id: input.userId,
    out_coin_id: input.coinId,
    out_account_id: accountId,
    out_state: isRetiro ? retiroState : input.state,
    amount_debit: isRetiro ? input.amount : 0,
    in_coin_id: input.coinId,
    in_account_id: accountId,
    in_state: isRetiro ? retiroState : input.state,
    amount_credit: isRetiro ? 0 : input.amount,
    nota: '',
    operation_id_ant: -1,
  };
};

const assertSuccess = (responseData: any, defaultMessage: string) => {
  if (responseData?.result && responseData.result !== 'success') {
    throw new Error(responseData?.message || defaultMessage);
  }
};

export async function createMovement(input: CreateMovementInput) {
  const response = await getAPISessionService().post('/operations.php', buildPayload(input, input.accountId));
  assertSuccess(response.data, 'Error al guardar movimiento');
  return response.data?.data ?? response.data;
}

export const shouldApplyFishertonMirrorRule = (baseUrl: string | undefined, accountId: number): boolean => {
  return (
    normalizeUrl(baseUrl || '') === normalizeUrl(APP_CONSTANTS.URL_FISHERTON) &&
    accountId === APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_CENTRO_EN_APP_FISHERTON
  );
};

export const shouldBlockMirrorAccountMovementCreation = (
  baseUrl: string | undefined,
  accountId: number,
): boolean => {
  return (
    normalizeUrl(baseUrl || '') === normalizeUrl(APP_CONSTANTS.URL_BAMENSA_PRINCIPAL) &&
    accountId === APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL
  );
};

export async function saveInversaOperationInBamensaOriginalApp(input: CreateMovementInput) {
  const mirroredType =
    input.type === APP_CONSTANTS.TYPE_RETIRO ? APP_CONSTANTS.TYPE_DEPOSITO : APP_CONSTANTS.TYPE_RETIRO;

  const response = await getAPIServiceBamApp().post(
    '/operations_acces.php',
    buildPayload(
      {
        ...input,
        type: mirroredType,
        observation: 'opFisherton',
      },
      APP_CONSTANTS.ACCOUNT_ID_SUCURSAL_FISHERTON_EN_APP_BAMENSA_ORIGINAL,
    ),
  );

  assertSuccess(response.data, 'Error al guardar movimiento espejo en Bamensa');
  return response.data?.data ?? response.data;
}
