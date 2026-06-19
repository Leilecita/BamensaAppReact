import api from '../../../core/services/axiosClient';

export type StatisticsGroupBy = 'day' | 'month';

export type ReportSumBuySaleDay = {
  created: string;
  result_buys: number;
  result_sales: number;
  count_transfers: number;
  count_checks: number;
  ppc: number;
  ppv: number;
  amount_checks: number;
  amount_transfers: number;
  amount_transfers_usd: number;
  outcomes_ars: number;
  outcomes_usd: number;
  amount_balance_gain: number;
  amount_balance_rentability: number;
};

export type ReportMoneyMovement = {
  created: string;
  amount_check_in: number;
  amount_check_out: number;
  amount_transfer_in: number;
  amount_transfer_out: number;
  amount_transfer_in_usd: number;
  amount_transfer_out_usd: number;
  amount_change_in: number;
  amount_change_out: number;
  amount_change_in_usd: number;
  amount_change_out_usd: number;
  tot_amount_in: number;
  tot_amount_out: number;
  tot_amount_in_usd: number;
  tot_amount_out_usd: number;
};

const toNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toText = (value: unknown): string => String(value ?? '').trim();

const mapDayResum = (raw: any): ReportSumBuySaleDay => ({
  created: toText(raw?.created),
  result_buys: toNumber(raw?.result_buys),
  result_sales: toNumber(raw?.result_sales),
  count_transfers: toNumber(raw?.count_transfers),
  count_checks: toNumber(raw?.count_checks),
  ppc: toNumber(raw?.ppc),
  ppv: toNumber(raw?.ppv),
  amount_checks: toNumber(raw?.amount_checks),
  amount_transfers: toNumber(raw?.amount_transfers),
  amount_transfers_usd: toNumber(raw?.amount_transfers_usd),
  outcomes_ars: toNumber(raw?.outcomes_ars),
  outcomes_usd: toNumber(raw?.outcomes_usd),
  amount_balance_gain: toNumber(raw?.amount_balance_gain),
  amount_balance_rentability: toNumber(raw?.amount_balance_rentability),
});

const mapMovementResum = (raw: any): ReportMoneyMovement => ({
  created: toText(raw?.created),
  amount_check_in: toNumber(raw?.amount_check_in),
  amount_check_out: toNumber(raw?.amount_check_out),
  amount_transfer_in: toNumber(raw?.amount_transfer_in),
  amount_transfer_out: toNumber(raw?.amount_transfer_out),
  amount_transfer_in_usd: toNumber(raw?.amount_transfer_in_usd),
  amount_transfer_out_usd: toNumber(raw?.amount_transfer_out_usd),
  amount_change_in: toNumber(raw?.amount_change_in),
  amount_change_out: toNumber(raw?.amount_change_out),
  amount_change_in_usd: toNumber(raw?.amount_change_in_usd),
  amount_change_out_usd: toNumber(raw?.amount_change_out_usd),
  tot_amount_in: toNumber(raw?.tot_amount_in),
  tot_amount_out: toNumber(raw?.tot_amount_out),
  tot_amount_in_usd: toNumber(raw?.tot_amount_in_usd),
  tot_amount_out_usd: toNumber(raw?.tot_amount_out_usd),
});

export async function fetchDayResum(page: number, groupBy: StatisticsGroupBy): Promise<ReportSumBuySaleDay[]> {
  const response = await api.get('/items_operation.php', {
    params: {
      method: 'getDayResum',
      groupby: groupBy,
      page,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al obtener ganancias');
  }

  const payload = data?.data ?? data;
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? Object.values(payload)
      : [];

  return source
    .map(mapDayResum)
    .filter((item) => item.created.length > 0);
}

export async function fetchMovementResum(page: number, groupBy: StatisticsGroupBy): Promise<ReportMoneyMovement[]> {
  const response = await api.get('/items_operation.php', {
    params: {
      method: 'getMovementResum',
      groupby: groupBy,
      page,
    },
  });

  const data = response.data;
  if (data?.result && data.result !== 'success') {
    throw new Error(data?.message || 'Error al obtener movimientos de dinero');
  }

  const payload = data?.data ?? data;
  const source = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object'
      ? Object.values(payload)
      : [];

  return source
    .map(mapMovementResum)
    .filter((item) => item.created.length > 0);
}
