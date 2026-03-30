import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import {
 fetchItemsOperationByCoin,
 ReportItemOperation,
} from '../services/accountItemsOperationService';

export function useAccountItemsOperation(accountId: number, coinId: number) {
 const fetchFn = useCallback(
  (page: number) => fetchItemsOperationByCoin(page, coinId, accountId),
  [accountId, coinId]
 );

 const { data, loading, loadingMore, error, loadMore, reload } = usePaginatedFetch<ReportItemOperation>(
  fetchFn,
  [fetchFn]
 );

 return {
  items: data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}
