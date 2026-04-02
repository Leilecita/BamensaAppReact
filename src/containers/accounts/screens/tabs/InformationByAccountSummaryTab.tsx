import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AccountCoinBalanceParam } from '../../../../core/navigation/AppStack';
import { dateHelper } from '../../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import { formatAmount1Decimal } from '../../../../helpers/valuesHelper';
import DateChip from '../../components/DateChip';
import ItemOpByCoin2 from '../../components/ItemOpByCoin2';
import { fetchItemsOperationByCoin, ReportItemOperation } from '../../services/accountItemsOperationService';
import styles from '../InformationByAccountScreen.styles';

const PAGE_SIZE = 12;

function CoinMovementDetail({
 items,
 loading,
 loadingMore,
 hasMore,
 error,
 onRetry,
 onLoadMore,
 coinShortName,
}: {
 items: ReportItemOperation[];
 loading: boolean;
 loadingMore: boolean;
 hasMore: boolean;
 error: string | null;
 onRetry: () => void;
 onLoadMore: () => void;
 coinShortName: string;
}) {
 return (
  <View style={styles.coinDetailWrap}>
   <View style={styles.coinDetailHeader}>
    <Text style={styles.coinDetailHeaderCoin}>{coinShortName}</Text>
    <Text style={styles.coinDetailHeaderMov}>MOVIMIENTOS</Text>
    <Text style={styles.coinDetailHeaderBalance}>SALDO</Text>
   </View>

   {loading ? (
    <View style={styles.coinDetailEmptyWrap}>
     <ActivityIndicator size="small" color="#6f6392" />
    </View>
   ) : error ? (
    <View style={styles.coinDetailEmptyWrap}>
     <Text style={styles.coinDetailEmptyText}>No se pudieron cargar los movimientos</Text>
     <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
      <Text style={styles.coinDetailRetryText}>Reintentar</Text>
     </TouchableOpacity>
    </View>
   ) : !items.length ? (
    <View style={styles.coinDetailEmptyWrap}>
     <Text style={styles.coinDetailEmptyText}>Sin movimientos en esta moneda</Text>
    </View>
   ) : (
   <View style={styles.coinDetailItemsWrap}>
     {items.map((item, index) => {
      const currentDayMonth = dateHelper.getDayMonth(item.created);
      const prevDayMonth = index > 0 ? dateHelper.getDayMonth(items[index - 1].created) : null;
      const showDate = currentDayMonth !== prevDayMonth;

      return (
       <Fragment key={`${item.id}-${item.operation_id}-${item.created}-${index}`}>
        {showDate ? (
         <View style={styles.coinDateChipWrap}>
          <DateChip label={currentDayMonth} />
         </View>
        ) : null}
       <ItemOpByCoin2 item={item} />
       </Fragment>
      );
     })}

     {hasMore || loadingMore ? (
      <TouchableOpacity
       style={styles.coinDetailLoadMoreBtn}
       activeOpacity={0.8}
       onPress={onLoadMore}
       disabled={loadingMore}
      >
       {loadingMore ? (
        <ActivityIndicator size="small" color="#b5adc8" />
       ) : (
        <Image source={require('../../../../../assets/images/ui/viewmore.png')} style={styles.coinDetailLoadMoreIcon} />
       )}
      </TouchableOpacity>
     ) : null}
    </View>
   )}
  </View>
 );
}

type Props = {
 accountId: number;
 balances: AccountCoinBalanceParam[];
};

export default function InformationByAccountSummaryTab({ accountId, balances }: Props) {
 const [openCoinId, setOpenCoinId] = useState<number | null>(null);
 const [coinItemsCache, setCoinItemsCache] = useState<Record<number, ReportItemOperation[]>>({});
 const [coinLoading, setCoinLoading] = useState<Record<number, boolean>>({});
 const [coinLoadingMore, setCoinLoadingMore] = useState<Record<number, boolean>>({});
 const [coinError, setCoinError] = useState<Record<number, string | null>>({});
 const [coinPage, setCoinPage] = useState<Record<number, number>>({});
 const [coinHasMore, setCoinHasMore] = useState<Record<number, boolean>>({});
 const [coinBalanceOverride, setCoinBalanceOverride] = useState<Record<number, number>>({});

 useEffect(() => {
  if (!balances.length) return;
  let cancelled = false;

  const preloadLatestBalances = async () => {
   const entries = await Promise.all(
    balances.map(async (coin) => {
     try {
      const items = await fetchItemsOperationByCoin(0, coin.coin_id, accountId);
      return [coin.coin_id, items[0]?.balance ?? coin.balance, items] as const;
     } catch {
      return [coin.coin_id, coin.balance, undefined] as const;
     }
    })
   );

   if (cancelled) return;

   const nextBalances: Record<number, number> = {};
   const nextCache: Record<number, ReportItemOperation[]> = {};
   const nextPage: Record<number, number> = {};
   const nextHasMore: Record<number, boolean> = {};

   entries.forEach(([coinId, balance, items]) => {
    nextBalances[coinId] = balance;
    nextPage[coinId] = 0;
    nextHasMore[coinId] = Boolean(items && items.length >= PAGE_SIZE);
    if (items && items.length) {
     nextCache[coinId] = items;
    }
   });

   setCoinBalanceOverride(nextBalances);
   setCoinPage(nextPage);
   setCoinHasMore(nextHasMore);
   if (Object.keys(nextCache).length) {
    setCoinItemsCache((prev) => ({ ...nextCache, ...prev }));
   }
  };

  preloadLatestBalances();

  return () => {
   cancelled = true;
  };
 }, [accountId, balances]);

 const loadCoinItemsFirstPage = useCallback(
  async (coinId: number) => {
   if (coinLoading[coinId]) return;

   setCoinLoading((prev) => ({ ...prev, [coinId]: true }));
   setCoinError((prev) => ({ ...prev, [coinId]: null }));

   try {
    const items = await fetchItemsOperationByCoin(0, coinId, accountId);
    setCoinItemsCache((prev) => ({ ...prev, [coinId]: items }));
    setCoinPage((prev) => ({ ...prev, [coinId]: 0 }));
    setCoinHasMore((prev) => ({ ...prev, [coinId]: items.length >= PAGE_SIZE }));
   } catch (e: any) {
    setCoinError((prev) => ({ ...prev, [coinId]: e?.message || 'Error al cargar movimientos' }));
   } finally {
    setCoinLoading((prev) => ({ ...prev, [coinId]: false }));
   }
  },
  [accountId, coinLoading]
 );

 const loadCoinItemsNextPage = useCallback(
  async (coinId: number) => {
   if (coinLoading[coinId] || coinLoadingMore[coinId] || !coinHasMore[coinId]) return;

   const nextPage = (coinPage[coinId] ?? 0) + 1;

   setCoinLoadingMore((prev) => ({ ...prev, [coinId]: true }));
   setCoinError((prev) => ({ ...prev, [coinId]: null }));

   try {
    const nextItems = await fetchItemsOperationByCoin(nextPage, coinId, accountId);

    setCoinItemsCache((prev) => ({
     ...prev,
     [coinId]: [...(prev[coinId] ?? []), ...nextItems],
    }));
    setCoinPage((prev) => ({ ...prev, [coinId]: nextPage }));
    setCoinHasMore((prev) => ({ ...prev, [coinId]: nextItems.length >= PAGE_SIZE }));
   } catch (e: any) {
    setCoinError((prev) => ({ ...prev, [coinId]: e?.message || 'Error al cargar más movimientos' }));
   } finally {
    setCoinLoadingMore((prev) => ({ ...prev, [coinId]: false }));
   }
  },
  [accountId, coinHasMore, coinLoading, coinLoadingMore, coinPage]
 );

 const handleToggleCoin = useCallback(
  (coinId: number) => {
    const isOpening = openCoinId !== coinId;
    setOpenCoinId((prev) => (prev === coinId ? null : coinId));

    if (isOpening && coinItemsCache[coinId] === undefined) {
      loadCoinItemsFirstPage(coinId);
    }
  },
  [openCoinId, coinItemsCache, loadCoinItemsFirstPage]
 );

 const sortedBalances = useMemo(() => balances, [balances]);

 return (
  <View style={styles.summaryWrap}>
   <ScrollView contentContainerStyle={styles.summaryContent}>
    {sortedBalances.length ? (
     sortedBalances.map((item) => {
      const expanded = openCoinId === item.coin_id;
      return (
       <View
        key={`${item.coin_id}-${item.coin_short_name}`}
        style={[styles.summaryCoinBlock, expanded ? styles.summaryCoinBlockExpanded : null]}
       >
        <TouchableOpacity
         style={[styles.summaryRow, expanded ? styles.summaryRowExpanded : null]}
         activeOpacity={0.85}
         onPress={() => handleToggleCoin(item.coin_id)}
        >
         <View style={styles.summaryCoinSide}>
          <Image source={getFilterFlagSourceByShortName(item.coin_short_name)} style={styles.summaryFlag} />
          <Text style={styles.summaryCoinCode}>{item.coin_short_name}</Text>
         </View>
         <Text style={styles.summaryAmount}>
          {formatAmount1Decimal(coinBalanceOverride[item.coin_id] ?? item.balance)}
         </Text>
        </TouchableOpacity>

        {expanded ? (
         <CoinMovementDetail
          items={coinItemsCache[item.coin_id] ?? []}
          loading={Boolean(coinLoading[item.coin_id])}
          loadingMore={Boolean(coinLoadingMore[item.coin_id])}
          hasMore={Boolean(coinHasMore[item.coin_id])}
          error={coinError[item.coin_id] ?? null}
          onRetry={() => loadCoinItemsFirstPage(item.coin_id)}
          onLoadMore={() => loadCoinItemsNextPage(item.coin_id)}
          coinShortName={item.coin_short_name}
         />
        ) : null}

        <View style={styles.summaryDivider} />
       </View>
      );
     })
    ) : (
     <Text style={styles.summaryText}>No hay saldos para mostrar en esta cuenta.</Text>
    )}
   </ScrollView>

   <TouchableOpacity style={styles.summaryFab} activeOpacity={0.85}>
    <Text style={styles.summaryFabText}>+</Text>
   </TouchableOpacity>
  </View>
 );
}
