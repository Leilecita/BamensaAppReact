import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AddActionButton from '../../../../core/components/AddActionButton';
import type { AppStackParamList } from '../../../../core/navigation/AppStack';
import { useCachedPaginatedList } from '../../../../core/hooks/useCachedPaginatedList';
import styles from '../InformationBoxBalanceScreen.styles';
import BalanceListItem from '../../components/BalanceListItem';
import { fetchBalances, ReportBalance } from '../../services/boxBalanceService';

export default function InformationBoxBalanceBalancesTab() {
 const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
 const fetchBalancesPage = useCallback(async (page: number) => fetchBalances(page), []);
 const { data: balances, loading, loadingMore, error, loadMore, reload, setData: setBalances } =
  useCachedPaginatedList<ReportBalance>({
   cacheKey: 'box-balance:balances',
   fetchPage: fetchBalancesPage,
  });

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
        {loading ? 'Cargando balances...' : error ? 'No se pudieron cargar los balances' : 'No hay balances para mostrar'}
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

   <AddActionButton
    style={[styles.summaryFab, { bottom: 30 }]}
    onPress={() => navigation.navigate('createBalance')}
   />
  </View>
 );
}
