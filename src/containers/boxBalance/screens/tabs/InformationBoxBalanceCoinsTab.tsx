import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import { formatAmount1Decimal } from '../../../../helpers/valuesHelper';
import styles from '../InformationBoxBalanceScreen.styles';
import BalanceCoinDayCard from '../../components/BalanceCoinDayCard';
import {
 fetchBalanceDetailByCoin,
 fetchTotalBoxCoins,
 ReportBalanceDetailByCoin,
 ReportBoxCoin,
} from '../../services/boxBalanceService';

const PAGE_SIZE = 3;

export default function InformationBoxBalanceCoinsTab() {
 const [balances, setBalances] = useState<ReportBoxCoin[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [openCoinId, setOpenCoinId] = useState<number | null>(null);
 const [detailsCache, setDetailsCache] = useState<Record<number, ReportBalanceDetailByCoin[]>>({});
 const [detailLoading, setDetailLoading] = useState<Record<number, boolean>>({});
 const [detailLoadingMore, setDetailLoadingMore] = useState<Record<number, boolean>>({});
 const [detailError, setDetailError] = useState<Record<number, string | null>>({});
 const [detailPage, setDetailPage] = useState<Record<number, number>>({});
 const [detailHasMore, setDetailHasMore] = useState<Record<number, boolean>>({});

 const loadBalances = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
   const data = await fetchTotalBoxCoins();
   setBalances(data);
  } catch (e: any) {
   setError(e?.message || 'No se pudieron cargar los saldos por moneda');
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  void loadBalances();
 }, [loadBalances]);

 const loadDetailPage = useCallback(async (coinId: number, page: number, reset: boolean) => {
  if (reset) {
   setDetailLoading((prev) => ({ ...prev, [coinId]: true }));
  } else {
   setDetailLoadingMore((prev) => ({ ...prev, [coinId]: true }));
  }
  setDetailError((prev) => ({ ...prev, [coinId]: null }));

  try {
   const items = await fetchBalanceDetailByCoin(page, coinId, 'day');
   setDetailsCache((prev) => ({
    ...prev,
    [coinId]: reset ? items : [...(prev[coinId] ?? []), ...items],
   }));
   setDetailPage((prev) => ({ ...prev, [coinId]: page }));
   setDetailHasMore((prev) => ({ ...prev, [coinId]: items.length >= PAGE_SIZE }));
  } catch (e: any) {
   setDetailError((prev) => ({ ...prev, [coinId]: e?.message || 'No se pudo cargar el detalle por moneda' }));
  } finally {
   if (reset) {
    setDetailLoading((prev) => ({ ...prev, [coinId]: false }));
   } else {
    setDetailLoadingMore((prev) => ({ ...prev, [coinId]: false }));
   }
  }
 }, []);

 const handleToggleCoin = useCallback(
  async (coinId: number) => {
   const nextCoinId = openCoinId === coinId ? null : coinId;
   setOpenCoinId(nextCoinId);

   if (nextCoinId === null) return;
   if (detailsCache[nextCoinId]?.length || detailLoading[nextCoinId]) return;

   await loadDetailPage(nextCoinId, 0, true);
  },
  [detailLoading, detailsCache, loadDetailPage, openCoinId],
 );

 const handleLoadMore = useCallback(
  async (coinId: number) => {
   if (detailLoading[coinId] || detailLoadingMore[coinId] || !detailHasMore[coinId]) return;
   const nextPage = (detailPage[coinId] ?? 0) + 1;
   await loadDetailPage(coinId, nextPage, false);
  },
  [detailHasMore, detailLoading, detailLoadingMore, detailPage, loadDetailPage],
 );

 return (
  <View style={styles.summaryWrap}>
   <ScrollView contentContainerStyle={styles.summaryContent}>
    {loading ? (
     <View style={styles.emptyWrap}>
      <ActivityIndicator size="small" color="#6f6392" />
      <Text style={styles.emptyText}>Cargando saldo monedas...</Text>
     </View>
    ) : error ? (
     <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>No se pudo cargar saldo monedas</Text>
      <Text style={styles.retryText}>{error}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={loadBalances}>
       <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
     </View>
    ) : balances.length ? (
     balances.map((item) => {
      const expanded = openCoinId === item.coin_id;
      const dayItems = detailsCache[item.coin_id] ?? [];

      return (
       <View
        key={`${item.coin_id}-${item.coin_short_name}`}
        style={[styles.balanceCoinsBlock, expanded ? styles.balanceCoinsBlockExpanded : null]}
       >
        <TouchableOpacity
         style={[styles.balanceCoinsTopRow, expanded ? styles.balanceCoinsTopRowExpanded : null]}
         activeOpacity={0.85}
         onPress={() => handleToggleCoin(item.coin_id)}
        >
         <View style={styles.balanceCoinsTopLeft}>
          <Image source={getFilterFlagSourceByShortName(item.coin_short_name)} style={styles.balanceCoinsFlag} />
          <Text style={styles.balanceCoinsCode}>{item.coin_short_name}</Text>
         </View>
         {!expanded ? <Text style={styles.balanceCoinsAmount}>{formatAmount1Decimal(item.balance)}</Text> : null}
        </TouchableOpacity>

        {expanded ? (
         <View style={styles.balanceCoinsExpandedWrap}>
          <View style={styles.balanceCoinsSaldoRow}>
           <Text style={styles.balanceCoinsSaldoLabel}>Saldo al día</Text>
           <Text style={styles.balanceCoinsSaldoValue}>{formatAmount1Decimal(item.balance)}</Text>
          </View>

          {detailLoading[item.coin_id] ? (
           <View style={styles.coinDetailEmptyWrap}>
            <ActivityIndicator size="small" color="#6f6392" />
           </View>
          ) : detailError[item.coin_id] ? (
           <View style={styles.coinDetailEmptyWrap}>
            <Text style={styles.coinDetailEmptyText}>No se pudo cargar el detalle</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={() => loadDetailPage(item.coin_id, 0, true)}>
             <Text style={styles.coinDetailRetryText}>Reintentar</Text>
            </TouchableOpacity>
           </View>
          ) : (
           <>
            {dayItems.map((dayItem, index) => (
             <BalanceCoinDayCard key={`${dayItem.item_created}-${index}`} item={dayItem} />
            ))}

            {detailHasMore[item.coin_id] || detailLoadingMore[item.coin_id] ? (
             <TouchableOpacity
              style={styles.coinDetailLoadMoreBtn}
              activeOpacity={0.8}
              onPress={() => handleLoadMore(item.coin_id)}
              disabled={detailLoadingMore[item.coin_id]}
             >
              {detailLoadingMore[item.coin_id] ? (
               <ActivityIndicator size="small" color="#b5adc8" />
              ) : (
               <Image
                source={require('../../../../../assets/images/ui/addnew.png')}
                style={styles.balanceCoinsLoadMoreIcon}
               />
              )}
             </TouchableOpacity>
            ) : null}
           </>
          )}
         </View>
        ) : null}

        <View style={styles.summaryDivider} />
       </View>
      );
     })
    ) : (
     <Text style={styles.summaryText}>No hay monedas para mostrar.</Text>
    )}
   </ScrollView>
  </View>
 );
}
