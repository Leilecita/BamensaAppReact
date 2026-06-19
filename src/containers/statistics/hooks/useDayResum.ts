import { useCallback } from 'react';
import { useCachedPaginatedList } from '../../../core/hooks/useCachedPaginatedList';
import { fetchDayResum, ReportSumBuySaleDay, StatisticsGroupBy } from '../services/statisticsService';

export function useDayResum(groupBy: StatisticsGroupBy) {
  const fetchFn = useCallback((page: number) => fetchDayResum(page, groupBy), [groupBy]);
  const { data, loading, loadingMore, error, reload, loadMore } =
    useCachedPaginatedList<ReportSumBuySaleDay>({
      cacheKey: `statistics:dayResum:${groupBy}`,
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
