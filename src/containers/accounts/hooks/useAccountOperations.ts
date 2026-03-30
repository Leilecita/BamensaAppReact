import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { ReportOperation } from '../../operations/services/operationService';
import { AccountOperationFilters, fetchOperationsByAccount } from '../services/accountOperationsService';

export function useAccountOperations(accountId: number, filters?: Partial<AccountOperationFilters>) {
 const type = filters?.type;
 const coin = filters?.coin;
 const user = filters?.user;
 const state = filters?.state;

 const fetchFn = useCallback(
  (page: number) =>
   fetchOperationsByAccount(page, accountId, {
    type,
    coin,
    user,
    state,
   }),
  [accountId, type, coin, user, state]
 );

 const { data, loading, loadingMore, error, loadMore, reload } = usePaginatedFetch<ReportOperation>(fetchFn, [
  fetchFn,
 ]);

 return {
  operations: data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}
