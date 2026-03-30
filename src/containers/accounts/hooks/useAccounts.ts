import { useCallback } from 'react';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { fetchAccounts, fetchSpecialAccounts, ReportAccount } from '../services/accountService';

type UseAccountsParams = {
 mode: 'clients' | 'own';
 query: string;
 category: string;
};

export function useAccounts({ mode, query, category }: UseAccountsParams) {
 const fetchFn = useCallback(
  (page: number) =>
   mode === 'own'
    ? fetchSpecialAccounts({ page })
    : fetchAccounts({
       page,
       query,
       category,
      }),
  [mode, query, category]
 );

 const {
  data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 } = usePaginatedFetch<ReportAccount>(fetchFn, [fetchFn]);

 return {
  accounts: data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}

