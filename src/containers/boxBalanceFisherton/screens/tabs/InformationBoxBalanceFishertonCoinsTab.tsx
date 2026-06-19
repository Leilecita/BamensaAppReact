import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import { valuesHelper } from '../../../../helpers/valuesHelper';
import BalanceCoinDayCard from '../../../boxBalance/components/BalanceCoinDayCard';
import styles from '../InformationBoxBalanceFishertonScreen.styles';
import {
  fetchFishertonBalanceCoins,
  fetchFishertonBalanceDetailByCoin,
  ReportBalanceDetail,
  ReportBalanceDetailByCoin,
} from '../../services/boxBalanceFishertonService';

let cachedFishertonCoinsTabBalances: ReportBalanceDetail[] = [];

export default function InformationBoxBalanceFishertonCoinsTab() {
  const [balances, setBalances] = useState<ReportBalanceDetail[]>(cachedFishertonCoinsTabBalances);
  const [loading, setLoading] = useState(cachedFishertonCoinsTabBalances.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [openCoinId, setOpenCoinId] = useState<number | null>(null);
  const [detailsCache, setDetailsCache] = useState<Record<number, ReportBalanceDetailByCoin[]>>({});
  const [detailLoading, setDetailLoading] = useState<Record<number, boolean>>({});
  const [detailError, setDetailError] = useState<Record<number, string | null>>({});

  const loadBalances = useCallback(async () => {
    const hasCachedBalances = cachedFishertonCoinsTabBalances.length > 0;
    if (!hasCachedBalances) {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchFishertonBalanceCoins();
      cachedFishertonCoinsTabBalances = data;
      setBalances(data);
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar los saldos por moneda de Fisherton');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBalances();
  }, [loadBalances]);

  const loadDetail = useCallback(async (coinId: number) => {
    setDetailLoading((prev) => ({ ...prev, [coinId]: true }));
    setDetailError((prev) => ({ ...prev, [coinId]: null }));

    try {
      const items = await fetchFishertonBalanceDetailByCoin(coinId, 'day');
      setDetailsCache((prev) => ({
        ...prev,
        [coinId]: items,
      }));
    } catch (e: any) {
      setDetailError((prev) => ({ ...prev, [coinId]: e?.message || 'No se pudo cargar el detalle por moneda' }));
    } finally {
      setDetailLoading((prev) => ({ ...prev, [coinId]: false }));
    }
  }, []);

  const handleToggleCoin = useCallback(
    async (coinId: number) => {
      const nextCoinId = openCoinId === coinId ? null : coinId;
      setOpenCoinId(nextCoinId);

      if (nextCoinId === null) return;
      if (detailsCache[nextCoinId]?.length || detailLoading[nextCoinId]) return;

      await loadDetail(nextCoinId);
    },
    [detailLoading, detailsCache, loadDetail, openCoinId],
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
                  {!expanded ? <Text style={styles.balanceCoinsAmount}>{valuesHelper.getBigNumb(item.balance)}</Text> : null}
                </TouchableOpacity>

                {expanded ? (
                  <View style={styles.balanceCoinsExpandedWrap}>
                    {detailLoading[item.coin_id] ? (
                      <View style={styles.coinDetailEmptyWrap}>
                        <ActivityIndicator size="small" color="#6f6392" />
                      </View>
                    ) : detailError[item.coin_id] ? (
                      <View style={styles.coinDetailEmptyWrap}>
                        <Text style={styles.coinDetailEmptyText}>No se pudo cargar el detalle</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => loadDetail(item.coin_id)}>
                          <Text style={styles.coinDetailRetryText}>Reintentar</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        {dayItems.map((dayItem, index) => (
                          <BalanceCoinDayCard key={`${dayItem.item_created}-${index}`} item={dayItem} />
                        ))}
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
