import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCachedPaginatedList } from '../../../../core/hooks/useCachedPaginatedList';
import BalanceListItem from '../../../boxBalance/components/BalanceListItem';
import styles from '../InformationBoxBalanceFishertonScreen.styles';
import { fetchFishertonBalances, ReportBalance } from '../../services/boxBalanceFishertonService';

type Props = {
  refreshKey?: number;
};

export default function InformationBoxBalanceFishertonBalancesTab({ refreshKey = 0 }: Props) {
  const fetchBalancesPage = useCallback(async (page: number) => fetchFishertonBalances(page), []);
  const { data: balances, loading, loadingMore, error, loadMore, reload, setData: setBalances } =
    useCachedPaginatedList<ReportBalance>({
      cacheKey: 'box-balance-fisherton:balances',
      fetchPage: fetchBalancesPage,
    });

  useEffect(() => {
    reload();
  }, [refreshKey, reload]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return (
    <View style={styles.summaryWrap}>
      <FlatList
        data={balances}
        keyExtractor={(item, index) => `${item.id}-${item.created}-${index}`}
        contentContainerStyle={styles.balanceListContent}
        renderItem={({ item }) => (
          <BalanceListItem
            item={item}
            onDeleted={(balanceId) => {
              setBalances((prev) => prev.filter((balance) => balance.id !== balanceId));
            }}
          />
        )}
        onEndReachedThreshold={0.45}
        onEndReached={loadMore}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
            <Text style={styles.emptyText}>
              {loading
                ? 'Cargando balances...'
                : error
                  ? 'No se pudieron cargar los balances'
                  : 'No hay balances para mostrar'}
            </Text>
            {error ? (
              <TouchableOpacity activeOpacity={0.8} onPress={reload}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
        ListFooterComponent={
          !loading && loadingMore ? (
            <View style={styles.balanceFooterWrap}>
              <ActivityIndicator size="small" color="#6f6392" />
              <Text style={styles.balanceFooterText}>Cargando mas balances...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
