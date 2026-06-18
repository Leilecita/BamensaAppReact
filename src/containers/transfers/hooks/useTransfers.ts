import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { fetchTransfers, ReportTransfer } from '../services/transferService';

export function useTransfers() {
  const fetchFn = useCallback(async (page: number) => fetchTransfers(page), []);
  const { data, loading, loadingMore, error, reload, loadMore } = usePaginatedFetch<ReportTransfer>(fetchFn, [fetchFn]);

  return {
    transfers: data,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
  };
}
