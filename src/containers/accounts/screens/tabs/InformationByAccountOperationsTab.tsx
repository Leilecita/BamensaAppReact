import React, { useMemo, useState } from 'react';
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../../core/constants/appConstants';
import OperationsFiltersBottomSheet, {
 CoinFilterOption,
 OPERATIONS_QUICK_FILTERS,
} from '../../../../core/components/OperationsFiltersBottomSheet';
import { AccountCoinBalanceParam } from '../../../../core/navigation/AppStack';
import { dateHelper } from '../../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import OperationCard from '../../../operations/components/OperationCard';
import { ReportOperation } from '../../../operations/services/operationService';
import { useAccountOperations } from '../../hooks/useAccountOperations';
import styles from '../InformationByAccountScreen.styles';

type OperationSection = {
 title: string;
 dateKey: string;
 data: ReportOperation[];
};

type Props = {
 accountId: number;
 balances: AccountCoinBalanceParam[];
};

export default function InformationByAccountOperationsTab({ accountId, balances }: Props) {
 const [quickFilter, setQuickFilter] = useState<string>('all');
 const [selectedCoin, setSelectedCoin] = useState<number>(APP_CONSTANTS.COIN_ALL);
 const sheetHeight = 240;
 const sheetPeek = 90;

 const coinFilters = useMemo<CoinFilterOption[]>(
  () =>
   balances.map((coin) => ({
    key: `coin-${coin.coin_id}`,
    coinId: coin.coin_id,
    shortName: coin.coin_short_name,
    icon: getFilterFlagSourceByShortName(coin.coin_short_name),
   })),
  [balances]
 );

 const resolvedFilters = useMemo(() => {
  switch (quickFilter) {
   case 'buy':
    return {
     type: APP_CONSTANTS.TYPE_COMPRA,
     state: APP_CONSTANTS.STATE_ALL,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
   case 'sale':
    return {
     type: APP_CONSTANTS.TYPE_VENTA,
     state: APP_CONSTANTS.STATE_ALL,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
   case 'pend':
    return {
     type: APP_CONSTANTS.TYPE_ALL,
     state: APP_CONSTANTS.STATE_PENDIENT,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
   case 'done':
    return {
     type: APP_CONSTANTS.TYPE_ALL,
     state: APP_CONSTANTS.STATE_DONE,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
   case 'usr':
    return {
     type: APP_CONSTANTS.TYPE_ALL,
     state: APP_CONSTANTS.STATE_ALL,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
   default:
    return {
     type: APP_CONSTANTS.TYPE_ALL,
     state: APP_CONSTANTS.STATE_ALL,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
  }
 }, [quickFilter, selectedCoin]);

 const { operations, loading, loadingMore, error, loadMore, reload } = useAccountOperations(
  accountId,
  resolvedFilters
 );

 const sections = useMemo<OperationSection[]>(() => {
  const byDate = new Map<string, ReportOperation[]>();

  const getDateKey = (value?: string) => {
   if (!value) return 'Sin fecha';
   const onlyDate = value.split(' ')[0]?.trim();
   return onlyDate || 'Sin fecha';
  };

  operations.forEach((operation) => {
   const key = getDateKey(operation.operation_created);
   if (!byDate.has(key)) {
    byDate.set(key, []);
   }
   byDate.get(key)?.push(operation);
  });

  return Array.from(byDate.entries()).map(([dateKey, data]) => ({
   dateKey,
   title: dateHelper.formatHeaderDateEs(dateKey),
   data,
  }));
 }, [operations]);

 return (
  <View style={styles.operationsWrap}>
   <SectionList
    sections={sections}
    keyExtractor={(item) => item.operation_id.toString()}
    contentContainerStyle={styles.listContent}
    renderItem={({ item }) => <OperationCard operation={item} wrapperStyle={styles.operationCardCompact} />}
    renderSectionHeader={({ section }) => (
     <View style={styles.sectionHeaderWrap}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
     </View>
    )}
    onEndReached={loadMore}
    onEndReachedThreshold={0.4}
    ListEmptyComponent={
     <View style={styles.emptyWrap}>
      {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
      <Text style={styles.emptyText}>
       {loading
        ? 'Cargando movimientos...'
        : error
         ? 'No se pudieron cargar los movimientos'
         : 'No hay movimientos para mostrar'}
      </Text>
      {error ? (
       <TouchableOpacity activeOpacity={0.8} onPress={reload}>
        <Text style={styles.retryText}>Reintentar</Text>
       </TouchableOpacity>
      ) : null}
     </View>
    }
    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
   />

   <OperationsFiltersBottomSheet
    height={sheetHeight}
    peekHeight={sheetPeek}
    quickFilters={OPERATIONS_QUICK_FILTERS}
    selectedQuickFilter={quickFilter}
    onSelectQuickFilter={(key) => {
     setQuickFilter(key);
     if (key === 'all') {
      setSelectedCoin(APP_CONSTANTS.COIN_ALL);
     }
    }}
    coinFilters={coinFilters}
    selectedCoinId={selectedCoin}
    onSelectCoinId={setSelectedCoin}
   />
  </View>
 );
}
