import React, { useContext, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, SectionList, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../../core/constants/appConstants';
import OperationsFiltersBottomSheet, {
 CoinFilterOption,
 OPERATIONS_QUICK_FILTERS,
} from '../../../../core/components/OperationsFiltersBottomSheet';
import { AccountCoinBalanceParam } from '../../../../core/navigation/AppStack';
import { AuthContext } from '../../../../contexts/AuthContext';
import { dateHelper } from '../../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import OperationCard from '../../../operations/components/OperationCard';
import {
 affectClientOperationAndSync,
 ReportOperation,
 updateOperationObservation,
} from '../../../operations/services/operationService';
import { useAccountOperations } from '../../hooks/useAccountOperations';
import { changeStateItem } from '../../services/accountItemsOperationService';
import { AppUser, fetchUsers } from '../../../../core/services/userService';
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
 const { userId } = useContext(AuthContext);
 const [quickFilter, setQuickFilter] = useState<string>('all');
 const [selectedCoin, setSelectedCoin] = useState<number>(APP_CONSTANTS.COIN_ALL);
 const [selectedUser, setSelectedUser] = useState<number>(APP_CONSTANTS.USER_ALL);
 const [usersDialogVisible, setUsersDialogVisible] = useState(false);
 const [users, setUsers] = useState<AppUser[]>([]);
 const [loadingUsers, setLoadingUsers] = useState(false);
 const [usersError, setUsersError] = useState('');
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
     user: selectedUser,
    };
   default:
    return {
     type: APP_CONSTANTS.TYPE_ALL,
     state: APP_CONSTANTS.STATE_ALL,
     coin: selectedCoin,
     user: APP_CONSTANTS.USER_ALL,
    };
  }
 }, [quickFilter, selectedCoin, selectedUser]);

 const { operations, loading, loadingMore, error, loadMore, reload } = useAccountOperations(
  accountId,
  resolvedFilters
 );

 const handleChangeItemState = async ({ itemId, nextState }: { itemId: number; nextState: string }) => {
  await changeStateItem(itemId, nextState);
 };

 const handleUpdateOperation = async ({
  operation,
  observation,
 }: {
  operation: ReportOperation;
  observation: string;
 }) => {
  await updateOperationObservation({
   id: operation.operation_id,
   observation,
   nota: operation.nota ?? '',
  });
 };

 const handleAffectClient = async ({
  operation,
  side,
 }: {
  operation: ReportOperation;
  side: 'in' | 'out';
 }) => {
  if (!userId) {
   throw new Error('No se pudo identificar el usuario actual.');
  }

  await affectClientOperationAndSync({
   operation,
   side,
   userId,
  });
  await reload();
 };

 const handleOpenUsersDialog = async () => {
  setUsersDialogVisible(true);

  if (users.length > 0 || loadingUsers) return;

  setLoadingUsers(true);
  setUsersError('');

  try {
   const data = await fetchUsers();
   setUsers(data);
  } catch (error: any) {
   setUsersError(error?.message || 'No se pudieron cargar los usuarios');
  } finally {
   setLoadingUsers(false);
  }
 };

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
    renderItem={({ item }) => (
     <OperationCard
      operation={item}
      wrapperStyle={styles.operationCardCompact}
      onChangeItemState={handleChangeItemState}
      onUpdateOperation={handleUpdateOperation}
      onAffectClient={handleAffectClient}
     />
    )}
    renderSectionHeader={({ section }) => (
     <View style={styles.sectionHeaderWrap}>
      <View style={styles.sectionHeaderDatePill}>
       {section.dateKey === 'Sin fecha' ? (
        <Text style={styles.sectionHeaderWeekdayText}>{section.title}</Text>
       ) : (
        <>
         <Text style={styles.sectionHeaderWeekdayText}>
          {dateHelper.getNameDay(section.dateKey)}
         </Text>
         <Text style={styles.sectionHeaderDayText}>
          {dateHelper.numberDay(section.dateKey)}
         </Text>
         <Text style={styles.sectionHeaderMonthText}>
          {dateHelper.getNameMonth2(section.dateKey)}
         </Text>
         <Text style={styles.sectionHeaderYearText}>{section.dateKey.slice(0, 4)}</Text>
        </>
       )}
      </View>
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
    ListFooterComponent={!loading && loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
   />

   <OperationsFiltersBottomSheet
    height={sheetHeight}
    peekHeight={sheetPeek}
    quickFilters={OPERATIONS_QUICK_FILTERS}
    selectedQuickFilter={quickFilter}
    onSelectQuickFilter={(key) => {
     if (key === 'usr') {
      setQuickFilter('usr');
      handleOpenUsersDialog();
      return;
     }

     setQuickFilter(key);
     if (key === 'all') {
      setSelectedCoin(APP_CONSTANTS.COIN_ALL);
      setSelectedUser(APP_CONSTANTS.USER_ALL);
     }
    }}
    coinFilters={coinFilters}
    selectedCoinId={selectedCoin}
    onSelectCoinId={setSelectedCoin}
   />

   <Modal
    visible={usersDialogVisible}
    transparent
    animationType="fade"
    onRequestClose={() => setUsersDialogVisible(false)}
   >
    <Pressable style={styles.usersDialogBackdrop} onPress={() => setUsersDialogVisible(false)}>
     <Pressable style={styles.usersDialogCard} onPress={() => {}}>
      <Text style={styles.usersDialogTitle}>Usuarios</Text>

      {loadingUsers ? (
       <View style={styles.usersDialogLoadingWrap}>
        <ActivityIndicator size="small" color="#6f6392" />
       </View>
      ) : (
       <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        style={styles.usersList}
        renderItem={({ item }) => (
         <TouchableOpacity
          style={styles.userRow}
          activeOpacity={0.8}
          onPress={() => {
           setSelectedUser(item.id);
           setQuickFilter('usr');
           setUsersDialogVisible(false);
          }}
         >
          <View style={styles.userAvatar}>
           <Text style={styles.userAvatarText}>{item.name.trim().charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userRowText}>{item.name}</Text>
         </TouchableOpacity>
        )}
        ListEmptyComponent={
         <View style={styles.usersDialogLoadingWrap}>
          <Text style={styles.usersDialogEmptyText}>
           {usersError || 'No hay usuarios para mostrar'}
          </Text>
         </View>
        }
       />
      )}

      <View style={styles.usersDialogActions}>
       <TouchableOpacity
        style={styles.usersDialogCancelBtn}
        activeOpacity={0.8}
        onPress={() => setUsersDialogVisible(false)}
       >
        <Text style={styles.usersDialogCancelText}>Cancelar</Text>
       </TouchableOpacity>
      </View>
     </Pressable>
    </Pressable>
   </Modal>
  </View>
 );
}
