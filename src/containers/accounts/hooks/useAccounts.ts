import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAccounts, fetchSpecialAccounts, ReportAccount } from '../services/accountService';

type UseAccountsParams = {
 mode: 'clients' | 'own';
 query: string;
 category: string;
};

type CachedAccountsPage = {
 items: ReportAccount[];
 hasMore: boolean;
};

const page0AccountsCache = new Map<string, CachedAccountsPage>();

const getCacheKey = ({ mode, query, category }: UseAccountsParams) => `${mode}::${query}::${category}`;

export function useAccounts({ mode, query, category }: UseAccountsParams) {
 const cacheKey = getCacheKey({ mode, query, category });
 const getCachedPage0 = useCallback(() => page0AccountsCache.get(cacheKey), [cacheKey]);
 const [accounts, setAccounts] = useState<ReportAccount[]>(() => getCachedPage0()?.items ?? []);
 const [loading, setLoading] = useState(false);
 const [loadingMore, setLoadingMore] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [page, setPage] = useState(0);
 const [hasMore, setHasMore] = useState(() => getCachedPage0()?.hasMore ?? true);
 const requestVersionRef = useRef(0);

 const fetchPage = useCallback(
  async (pageToLoad: number, reset: boolean, version: number) => {
   if (!reset && !hasMore) return;

   if (reset) {
    setLoading(true);
    const cachedPage0 = pageToLoad === 0 ? getCachedPage0() : undefined;
    setAccounts(cachedPage0?.items ?? []);
    setHasMore(cachedPage0?.hasMore ?? true);
   } else {
    setLoadingMore(true);
   }

   try {
    const result =
     mode === 'own'
      ? await fetchSpecialAccounts({ page: pageToLoad })
      : await fetchAccounts({
         page: pageToLoad,
         query,
         category,
        });

    if (version !== requestVersionRef.current) return;

    if (reset && pageToLoad === 0) {
     page0AccountsCache.set(cacheKey, {
      items: result,
      hasMore: result.length > 0,
     });
    }

    setAccounts((prev) => (reset ? result : [...prev, ...result]));
    setHasMore(result.length > 0);
    setError(null);
   } catch (e: any) {
    if (version !== requestVersionRef.current) return;
    setError(e.message ?? 'Error al cargar datos');
   } finally {
    if (version !== requestVersionRef.current) return;

    setLoading(false);
    setLoadingMore(false);
   }
  },
  [cacheKey, category, getCachedPage0, hasMore, mode, query]
 );

 const resetAndLoad = useCallback(() => {
  const version = requestVersionRef.current + 1;
  requestVersionRef.current = version;
  setPage(0);
  void fetchPage(0, true, version);
 }, [fetchPage]);

 useEffect(() => {
  resetAndLoad();
 }, [resetAndLoad]);

 const loadMore = useCallback(() => {
  if (loading || loadingMore || !hasMore) return;

  const nextPage = page + 1;
  setPage(nextPage);
  void fetchPage(nextPage, false, requestVersionRef.current);
 }, [fetchPage, hasMore, loading, loadingMore, page]);

 const reload = useCallback(() => {
  resetAndLoad();
 }, [resetAndLoad]);

 return {
  accounts,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
 };
}
