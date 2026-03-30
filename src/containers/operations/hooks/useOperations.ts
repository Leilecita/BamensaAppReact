import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import {
 fetchOperations,
 OperationFilters,
 ReportOperation,
} from '../services/operationService';

export function useOperations(filters?: Partial<OperationFilters>) {
 const type = filters?.type;
 const coin = filters?.coin;
 const user = filters?.user;
 const state = filters?.state;

 const fetchFn = useCallback(
  (page: number) =>
   fetchOperations(page, {
    type,
    coin,
    user,
    state,
   }),
  [type, coin, user, state]
 );

 const {
  data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 } = usePaginatedFetch<ReportOperation>(fetchFn, [fetchFn]);

 return {
  operations: data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}
