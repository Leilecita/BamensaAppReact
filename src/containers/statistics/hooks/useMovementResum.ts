import { useCallback } from 'react';
import { useCachedPaginatedList } from '../../../core/hooks/useCachedPaginatedList';
import { fetchMovementResum, ReportMoneyMovement, StatisticsGroupBy } from '../services/statisticsService';

export function useMovementResum(groupBy: StatisticsGroupBy) {
  const fetchFn = useCallback((page: number) => fetchMovementResum(page, groupBy), [groupBy]);
  const { data, loading, loadingMore, error, reload, loadMore } =
    useCachedPaginatedList<ReportMoneyMovement>({
      cacheKey: `statistics:movementResum:${groupBy}`,
      fetchPage: fetchFn,
    });

  return {
    items: data,
    loading,
    loadingMore,
    error,
    reload,
    loadMore,
  };
}
