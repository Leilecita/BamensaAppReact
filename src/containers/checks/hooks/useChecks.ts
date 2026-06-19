import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { CheckState, fetchChecks, ReportCheck } from '../services/checkService';

export function useChecks(state: CheckState) {
  const fetchFn = useCallback((page: number) => fetchChecks(page, state), [state]);

  const { data, loading, loadingMore, error, reload, loadMore } = usePaginatedFetch<ReportCheck>(fetchFn, [fetchFn]);

  return {
    checks: data,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
  };
}
