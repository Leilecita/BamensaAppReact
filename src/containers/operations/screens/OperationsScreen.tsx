import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import AppTopBar from '../../../core/components/AppTopBar';
import OperationsFiltersBottomSheet, {
  OPERATIONS_QUICK_FILTERS,
} from '../../../core/components/OperationsFiltersBottomSheet';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import { dateHelper } from '../../../helpers/dateHelper';
import { useCoins } from '../../coins/hooks/useCoins';
import OperationCard from '../components/OperationCard';
import { useOperations } from '../hooks/useOperations';
import { ReportOperation } from '../services/operationService';
import styles from './OperationsScreen.styles';

type OperationSection = {
  title: string;
  dateKey: string;
  data: ReportOperation[];
};

export default function OperationsScreen() {
  const { navigateTo } = useSideMenu();
  const [quickFilter, setQuickFilter] = useState<string>('all');
  const [selectedCoin, setSelectedCoin] = useState<number>(APP_CONSTANTS.COIN_ALL);
  const sheetHeight = 240;
  const sheetPeek = 90;
  const { coins } = useCoins();

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

  const { operations, loading, loadingMore, error, loadMore, reload } = useOperations(resolvedFilters);

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
    <View style={styles.screen}>
      <AppTopBar
        title="Todas las operaciones"
        leftSymbol="←"
        onPressLeft={() => navigateTo('home')}
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.operation_id.toString()}
        renderItem={({ item }) => <OperationCard operation={item} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrap}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.45}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
            <Text style={error ? styles.errorText : styles.emptyText}>
              {loading
                ? 'Cargando operaciones...'
                : error
                  ? 'No se pudieron cargar las operaciones'
                  : 'No hay operaciones para mostrar'}
            </Text>
            {error ? (
              <TouchableOpacity onPress={reload} activeOpacity={0.8} style={styles.retryBtn}>
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
        contentBottomPadding={18}
        quickFilters={OPERATIONS_QUICK_FILTERS}
        selectedQuickFilter={quickFilter}
        onSelectQuickFilter={(key) => {
          setQuickFilter(key);
          if (key === 'all') {
            setSelectedCoin(APP_CONSTANTS.COIN_ALL);
          }
        }}
        coinsSource={coins}
        selectedCoinId={selectedCoin}
        onSelectCoinId={setSelectedCoin}
      />
    </View>
  );
}
