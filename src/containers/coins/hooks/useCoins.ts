import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { Coin, fetchCoins } from '../services/coinService';

export function useCoins() {
 const fetchFn = useCallback(async (page: number) => {
  // El endpoint de monedas no está paginado: cargamos solo en página 0.
  if (page > 0) return [] as Coin[];
  return fetchCoins();
 }, []);

 const { data, loading, error, reload } = usePaginatedFetch<Coin>(fetchFn, [fetchFn]);

 return {
  coins: data,
  loadingCoins: loading,
  coinsError: error,
  reloadCoins: reload,
 };
}
