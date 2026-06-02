import { useCallback, useEffect, useRef, useState } from 'react';

type CachedPage0<T> = {
 items: T[];
 hasMore: boolean;
};

const page0Cache = new Map<string, CachedPage0<any>>();

type UseCachedPaginatedListParams<T> = {
 cacheKey: string;
 fetchPage: (page: number) => Promise<T[]>;
};

export function useCachedPaginatedList<T>({ cacheKey, fetchPage }: UseCachedPaginatedListParams<T>) {
 const cachedPage0 = page0Cache.get(cacheKey) as CachedPage0<T> | undefined;
 const [data, setData] = useState<T[]>(() => cachedPage0?.items ?? []);
 const [loading, setLoading] = useState(cachedPage0?.items?.length === 0);
 const [loadingMore, setLoadingMore] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [page, setPage] = useState(0);
 const [hasMore, setHasMore] = useState(() => cachedPage0?.hasMore ?? true);
 const requestVersionRef = useRef(0);

 const loadPage = useCallback(
  async (pageToLoad: number, reset: boolean, version: number) => {
   if (!reset && !hasMore) return;

   if (reset) {
    const nextCachedPage0 = page0Cache.get(cacheKey) as CachedPage0<T> | undefined;
    if (!nextCachedPage0?.items?.length) {
     setLoading(true);
    }
    setData(nextCachedPage0?.items ?? []);
    setHasMore(nextCachedPage0?.hasMore ?? true);
    setError(null);
    setPage(0);
   } else {
    setLoadingMore(true);
   }

   try {
    const items = await fetchPage(pageToLoad);

    if (version !== requestVersionRef.current) return;

    if (reset && pageToLoad === 0) {
     page0Cache.set(cacheKey, {
      items,
      hasMore: items.length > 0,
     });
    }

    setData((prev) => (reset ? items : [...prev, ...items]));
    setHasMore(items.length > 0);
    setError(null);
   } catch (e: any) {
    if (version !== requestVersionRef.current) return;
    setError(e?.message ?? 'Error al cargar datos');
   } finally {
    if (version !== requestVersionRef.current) return;
    setLoading(false);
    setLoadingMore(false);
   }
  },
  [cacheKey, fetchPage, hasMore],
 );

 const resetAndLoad = useCallback(() => {
  const version = requestVersionRef.current + 1;
  requestVersionRef.current = version;
  void loadPage(0, true, version);
 }, [loadPage]);

 useEffect(() => {
  resetAndLoad();
 }, [resetAndLoad]);

 const loadMore = useCallback(() => {
  if (loading || loadingMore || !hasMore) return;

  const nextPage = page + 1;
  setPage(nextPage);
  void loadPage(nextPage, false, requestVersionRef.current);
 }, [hasMore, loadPage, loading, loadingMore, page]);

 const reload = useCallback(() => {
  resetAndLoad();
 }, [resetAndLoad]);

 return {
  data,
  loading,
  loadingMore,
  error,
  loadMore,
  reload,
  setData,
 };
}
