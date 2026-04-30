import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { fetchOutcomes, GroupByType, ReportOutcome } from '../services/outcomeService';

type UseOutcomesParams = {
 coinId: number;
 groupBy: GroupByType;
};

export function useOutcomes({ coinId, groupBy }: UseOutcomesParams) {
 const fetchFn = useCallback(
  (page: number) => fetchOutcomes(page, coinId, groupBy),
  [coinId, groupBy]
 );

 const { data, loading, loadingMore, error, loadMore, reload } = usePaginatedFetch<ReportOutcome>(fetchFn, [fetchFn]);

 return {
  outcomes: data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}

