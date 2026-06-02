import React, { Fragment, useCallback, useContext, useMemo, useState } from 'react';
import {
 ActivityIndicator,
 Alert,
 Image,
 Modal,
 Pressable,
 ScrollView,
 Text,
 TouchableOpacity,
 View,
 useWindowDimensions,
} from 'react-native';
import AddActionButton from '../../../../core/components/AddActionButton';
import ContextActionMenu from '../../../../core/components/ContextActionMenu';
import OperationsFiltersBottomSheet, {
 QuickFilterOption,
} from '../../../../core/components/OperationsFiltersBottomSheet';
import { APP_CONSTANTS } from '../../../../core/constants/appConstants';
import { AppUser, fetchUsers } from '../../../../core/services/userService';
import { AuthContext } from '../../../../contexts/AuthContext';
import { dateHelper } from '../../../../helpers/dateHelper';
import { useCoins } from '../../../coins/hooks/useCoins';
import ChangeStateItemDialog from '../../../accounts/components/ChangeStateItemDialog';
import DateChip from '../../../accounts/components/DateChip';
import EditMovementDialog from '../../../accounts/components/EditMovementDialog';
import BoxCoinItem from '../../components/BoxCoinItem';
import BoxDeleteMovementDialog from '../../components/BoxDeleteMovementDialog';
import BoxItemOpByCoin2 from '../../components/BoxItemOpByCoin2';
import CoinMovementSummary from '../../components/CoinMovementSummary';
import {
 changeStateItem,
 deleteReportItem,
 putItemOperation,
 ReportItemOperation,
} from '../../../accounts/services/accountItemsOperationService';
import AddMovementDialog from '../../../accounts/components/AddMovementDialog';
import styles from '../InformationBoxBalanceScreen.styles';
import {
 BoxQuickFilter,
 fetchBalanceDetailByCoinTotalBox,
 fetchBoxItemsByCoin,
 fetchTotalBoxCoins,
 ReportBalanceDetailTotalBox,
 ReportBoxCoin,
} from '../../services/boxBalanceService';

const PAGE_SIZE = 12;
let cachedTotalBoxBalances: ReportBoxCoin[] = [];

const canManageBoxMovement = (item: ReportItemOperation | null) => {
 if (!item) return false;
 return (
  String(item.client_name_account ?? '') === APP_CONSTANTS.CUENTA_CAJA_GENERAL_NOMBRE &&
  (item.operation_type === APP_CONSTANTS.TYPE_DEPOSITO || item.operation_type === APP_CONSTANTS.TYPE_RETIRO)
 );
};

const getBoxMovementRestrictionMessage = (item: ReportItemOperation | null) => {
 if (!item) return 'No se puede modificar este movimiento.';

 if (String(item.client_name_account ?? '') !== APP_CONSTANTS.CUENTA_CAJA_GENERAL_NOMBRE) {
  if (item.operation_type === APP_CONSTANTS.TYPE_VENTA || item.operation_type === APP_CONSTANTS.TYPE_COMPRA) {
   return `Modificar desde la OPERACION de ${item.operation_type}`;
  }

  return `Modificar desde la CUENTA que ha sido creado el ${item.operation_type}`;
 }

 if (item.operation_type === APP_CONSTANTS.TYPE_VENTA || item.operation_type === APP_CONSTANTS.TYPE_COMPRA) {
  return `Modificar desde la OPERACION de ${item.operation_type}`;
 }

 if (item.operation_type === APP_CONSTANTS.TYPE_GASTO) {
  return 'Modificar desde la planilla de gastos';
 }

 return 'Modificar desde la planilla de extracciones';
};

const BOX_QUICK_FILTERS: QuickFilterOption[] = [
 {
  key: 'all',
  label: 'Todos',
  icon: require('../../../../../assets/images/ui/filtall.png'),
 },
 {
  key: 'buy',
  label: 'compra',
  icon: require('../../../../../assets/images/ui/filtbuy.png'),
 },
 {
  key: 'sale',
  label: 'venta',
  icon: require('../../../../../assets/images/ui/venta.png'),
 },
 {
  key: 'dep',
  label: 'depos',
  icon: require('../../../../../assets/images/ui/depo4.png'),
 },
 {
  key: 'ret',
  label: 'retiros',
  icon: require('../../../../../assets/images/ui/extracc.png'),
 },
];

const BOX_SECONDARY_QUICK_FILTERS: QuickFilterOption[] = [
 {
  key: 'pend',
  label: 'pend',
  icon: require('../../../../../assets/images/ui/pendsan.png'),
 },
 {
  key: 'usr',
  label: 'usr',
  icon: require('../../../../../assets/images/ui/sessionviol.png'),
  iconSize: 45,
 },
];

function CoinMovementDetail({
 items,
 loading,
 loadingMore,
 hasMore,
 error,
 onRetry,
 onLoadMore,
 onLongPressItem,
}: {
 items: ReportItemOperation[];
 loading: boolean;
 loadingMore: boolean;
 hasMore: boolean;
 error: string | null;
 onRetry: () => void;
 onLoadMore: () => void;
 onLongPressItem: (item: ReportItemOperation, anchorY: number) => void;
}) {
 if (loading) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <ActivityIndicator size="small" color="#6f6392" />
   </View>
  );
 }

 if (error) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <Text style={styles.coinDetailEmptyText}>No se pudieron cargar los movimientos</Text>
    <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
     <Text style={styles.coinDetailRetryText}>Reintentar</Text>
    </TouchableOpacity>
   </View>
  );
 }

 if (!items.length) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <Text style={styles.coinDetailEmptyText}>Sin movimientos en esta moneda</Text>
   </View>
  );
 }

 return (
  <View style={styles.coinDetailItemsWrap}>
   {items.map((item, index) => {
    const currentDayMonth = dateHelper.onlyDayMonth(item.created);
    const prevDayMonth = index > 0 ? dateHelper.onlyDayMonth(items[index - 1].created) : null;
    const showDate = currentDayMonth !== prevDayMonth;

    return (
     <Fragment key={`${item.id}-${item.operation_id}-${item.created}-${index}`}>
      {showDate ? (
       <View style={styles.coinDateChipWrap}>
        <DateChip label={currentDayMonth} />
       </View>
      ) : null}
      <BoxItemOpByCoin2 item={item} onLongPress={onLongPressItem} />
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
 );
}

export default function InformationBoxBalanceTotalTab() {
 const { userId } = useContext(AuthContext);
 const { coins } = useCoins();
 const { height: windowHeight } = useWindowDimensions();
 const sheetHeight = 240;
 const sheetPeek = 90;
 const [balances, setBalances] = useState<ReportBoxCoin[]>(cachedTotalBoxBalances);
 const [balancesLoading, setBalancesLoading] = useState(cachedTotalBoxBalances.length === 0);
 const [balancesError, setBalancesError] = useState<string | null>(null);
 const [openCoinId, setOpenCoinId] = useState<number | null>(null);
 const [selectedType, setSelectedType] = useState<string>(APP_CONSTANTS.TYPE_ALL);
 const [selectedState, setSelectedState] = useState<string>(APP_CONSTANTS.STATE_ALL);
 const [selectedUser, setSelectedUser] = useState<number>(APP_CONSTANTS.USER_ALL);
 const [selectedUserName, setSelectedUserName] = useState('');
 const [usersDialogVisible, setUsersDialogVisible] = useState(false);
 const [users, setUsers] = useState<AppUser[]>([]);
 const [loadingUsers, setLoadingUsers] = useState(false);
 const [usersError, setUsersError] = useState('');
 const [addDialogVisible, setAddDialogVisible] = useState(false);
 const [coinItemsCache, setCoinItemsCache] = useState<Record<number, ReportItemOperation[]>>({});
 const [coinLoading, setCoinLoading] = useState<Record<number, boolean>>({});
 const [coinLoadingMore, setCoinLoadingMore] = useState<Record<number, boolean>>({});
 const [coinError, setCoinError] = useState<Record<number, string | null>>({});
 const [coinPage, setCoinPage] = useState<Record<number, number>>({});
 const [coinHasMore, setCoinHasMore] = useState<Record<number, boolean>>({});
 const [menuMovement, setMenuMovement] = useState<ReportItemOperation | null>(null);
 const [menuTop, setMenuTop] = useState(180);
 const [editDialogVisible, setEditDialogVisible] = useState(false);
 const [editingMovement, setEditingMovement] = useState<ReportItemOperation | null>(null);
 const [changeStateDialogVisible, setChangeStateDialogVisible] = useState(false);
 const [changingStateMovement, setChangingStateMovement] = useState<ReportItemOperation | null>(null);
 const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
 const [deletingMovement, setDeletingMovement] = useState<ReportItemOperation | null>(null);
 const [selectedView, setSelectedView] = useState<typeof APP_CONSTANTS.TYPE_VIEW_DETAIL | typeof APP_CONSTANTS.TYPE_VIEW_RESUM>(
  APP_CONSTANTS.TYPE_VIEW_DETAIL,
 );
 const [viewOptionsVisible, setViewOptionsVisible] = useState(false);
 const [coinSummaryCache, setCoinSummaryCache] = useState<Record<number, ReportBalanceDetailTotalBox[]>>({});
 const [coinSummaryLoading, setCoinSummaryLoading] = useState<Record<number, boolean>>({});
 const [coinSummaryError, setCoinSummaryError] = useState<Record<number, string | null>>({});

 const resolvedFilters = useMemo(
  () => ({
   type: selectedType,
   state: selectedState,
   userId: selectedUser,
  }),
  [selectedState, selectedType, selectedUser],
 );

 const selectedQuickFilterKeys = useMemo<BoxQuickFilter[]>(() => {
  const keys: BoxQuickFilter[] = [];

  if (
   selectedType === APP_CONSTANTS.TYPE_ALL &&
   selectedState === APP_CONSTANTS.STATE_ALL &&
   selectedUser === APP_CONSTANTS.USER_ALL
  ) {
   keys.push('all');
  }

  if (selectedType === APP_CONSTANTS.TYPE_COMPRA) keys.push('buy');
  if (selectedType === APP_CONSTANTS.TYPE_VENTA) keys.push('sale');
  if (selectedType === APP_CONSTANTS.TYPE_DEPOSITO) keys.push('dep');
  if (selectedType === APP_CONSTANTS.TYPE_RETIRO) keys.push('ret');
  if (selectedState === APP_CONSTANTS.STATE_PENDIENT) keys.push('pend');
  if (selectedUser !== APP_CONSTANTS.USER_ALL) keys.push('usr');

  return keys;
 }, [selectedState, selectedType, selectedUser]);

 const refreshBalances = useCallback(async () => {
  const hasCachedBalances = cachedTotalBoxBalances.length > 0;
  if (!hasCachedBalances) {
   setBalancesLoading(true);
  }
  setBalancesError(null);

 try {
  const data = await fetchTotalBoxCoins();
  cachedTotalBoxBalances = data;
  setBalances(data);
  } catch (e: any) {
   setBalancesError(e?.message || 'No se pudieron cargar los saldos de caja');
  } finally {
   setBalancesLoading(false);
  }
 }, []);

 React.useEffect(() => {
  void refreshBalances();
 }, [refreshBalances]);

 const loadCoinItemsFirstPage = useCallback(
  async (coinId: number) => {
   if (coinLoading[coinId]) return;

   setCoinLoading((prev) => ({ ...prev, [coinId]: true }));
   setCoinError((prev) => ({ ...prev, [coinId]: null }));

  try {
   const items = await fetchBoxItemsByCoin(0, coinId, resolvedFilters);
    setCoinItemsCache((prev) => ({ ...prev, [coinId]: items }));
    setCoinPage((prev) => ({ ...prev, [coinId]: 0 }));
    setCoinHasMore((prev) => ({ ...prev, [coinId]: items.length >= PAGE_SIZE }));
   } catch (e: any) {
    setCoinError((prev) => ({ ...prev, [coinId]: e?.message || 'Error al cargar movimientos' }));
   } finally {
    setCoinLoading((prev) => ({ ...prev, [coinId]: false }));
   }
  },
  [resolvedFilters, coinLoading],
 );

 const loadCoinItemsNextPage = useCallback(
  async (coinId: number) => {
   if (coinLoading[coinId] || coinLoadingMore[coinId] || !coinHasMore[coinId]) return;

   const nextPage = (coinPage[coinId] ?? 0) + 1;
   setCoinLoadingMore((prev) => ({ ...prev, [coinId]: true }));
   setCoinError((prev) => ({ ...prev, [coinId]: null }));

   try {
    const nextItems = await fetchBoxItemsByCoin(nextPage, coinId, resolvedFilters);

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
  [coinHasMore, coinLoading, coinLoadingMore, coinPage, resolvedFilters],
 );

 const loadCoinSummary = useCallback(
  async (coinId: number) => {
   if (coinSummaryLoading[coinId]) return;

   setCoinSummaryLoading((prev) => ({ ...prev, [coinId]: true }));
   setCoinSummaryError((prev) => ({ ...prev, [coinId]: null }));

   try {
    const items = await fetchBalanceDetailByCoinTotalBox(coinId, 'day');
    setCoinSummaryCache((prev) => ({ ...prev, [coinId]: items }));
   } catch (e: any) {
    setCoinSummaryError((prev) => ({ ...prev, [coinId]: e?.message || 'Error al cargar resumen' }));
   } finally {
    setCoinSummaryLoading((prev) => ({ ...prev, [coinId]: false }));
   }
  },
  [coinSummaryLoading],
 );

 const refreshAllMovementsAndBalances = useCallback(async () => {
  await refreshBalances();

  if (openCoinId) {
   await loadCoinItemsFirstPage(openCoinId);
  } else {
   setCoinItemsCache({});
   setCoinPage({});
   setCoinHasMore({});
   setCoinError({});
  }
 }, [loadCoinItemsFirstPage, openCoinId, refreshBalances]);

 React.useEffect(() => {
  if (openCoinId === null) return;

  if (selectedView === APP_CONSTANTS.TYPE_VIEW_DETAIL) {
   setCoinItemsCache({});
   setCoinPage({});
   setCoinHasMore({});
   setCoinError({});
   loadCoinItemsFirstPage(openCoinId);
   return;
  }

  setCoinSummaryCache({});
  setCoinSummaryError({});
  loadCoinSummary(openCoinId);
 }, [openCoinId, selectedType, selectedState, selectedUser, selectedView]);

 const handleToggleCoin = useCallback(
  (coinId: number) => {
   const nextCoinId = openCoinId === coinId ? null : coinId;
   setOpenCoinId(nextCoinId);
  },
  [openCoinId],
 );

 const handleChangeView = useCallback(
  (view: typeof APP_CONSTANTS.TYPE_VIEW_DETAIL | typeof APP_CONSTANTS.TYPE_VIEW_RESUM) => {
   setSelectedView(view);
   setViewOptionsVisible(false);
  },
  [],
 );

 const handleOpenUsersDialog = useCallback(async () => {
  setUsersDialogVisible(true);

  if (users.length > 0 || loadingUsers) return;

  setLoadingUsers(true);
  setUsersError('');
  try {
   const data = await fetchUsers();
   setUsers(data);
  } catch (e: any) {
   setUsersError(e?.message || 'No se pudieron cargar los usuarios');
  } finally {
   setLoadingUsers(false);
  }
 }, [loadingUsers, users.length]);

 const handleSelectQuickFilter = useCallback(
  (key: BoxQuickFilter) => {
   switch (key) {
    case 'all':
     setSelectedType(APP_CONSTANTS.TYPE_ALL);
     setSelectedState(APP_CONSTANTS.STATE_ALL);
     setSelectedUser(APP_CONSTANTS.USER_ALL);
     setSelectedUserName('');
     return;
    case 'buy':
     setSelectedType(APP_CONSTANTS.TYPE_COMPRA);
     return;
    case 'sale':
     setSelectedType(APP_CONSTANTS.TYPE_VENTA);
     return;
    case 'dep':
     setSelectedType(APP_CONSTANTS.TYPE_DEPOSITO);
     return;
    case 'ret':
     setSelectedType(APP_CONSTANTS.TYPE_RETIRO);
     return;
    case 'pend':
     setSelectedState(APP_CONSTANTS.STATE_PENDIENT);
     return;
    case 'usr':
     handleOpenUsersDialog();
     return;
   }
  },
  [handleOpenUsersDialog],
 );

 const handleLongPressItem = useCallback(
  (item: ReportItemOperation, anchorY: number) => {
   if (!canManageBoxMovement(item)) {
    Alert.alert('Atención', getBoxMovementRestrictionMessage(item));
    return;
   }

   setMenuTop(Math.min(Math.max(110, anchorY + 15), windowHeight - 290));
   setMenuMovement(item);
  },
  [windowHeight],
 );

 const coinOptions = useMemo(() => {
  const fromCatalog = coins
   .map((coin) => String(coin.short_name ?? '').toUpperCase().trim())
   .filter(Boolean);

  if (fromCatalog.length) {
   return Array.from(new Set(fromCatalog));
  }

  return Array.from(
   new Set(
    balances
     .map((coin) => String(coin.coin_short_name ?? '').toUpperCase().trim())
     .filter(Boolean),
   ),
  );
 }, [balances, coins]);

  return (
  <View style={styles.summaryWrap}>
   <View style={styles.viewOptionsWrap}>
    <TouchableOpacity
     style={styles.viewOptionsButton}
     activeOpacity={0.85}
     onPress={() => setViewOptionsVisible((prev) => !prev)}
    >
     <Image source={require('../../../../../assets/images/ui/btnojo2.png')} style={styles.viewOptionsButtonBg} />
    </TouchableOpacity>

    {viewOptionsVisible ? (
     <View style={styles.viewOptionsList}>
      <TouchableOpacity
       style={styles.viewOptionsCard}
       activeOpacity={0.85}
       onPress={() => handleChangeView(APP_CONSTANTS.TYPE_VIEW_RESUM)}
      >
       <View style={styles.viewOptionsTextWrap}>
        <Text style={styles.viewOptionsTitle}>VISTA RESUMEN</Text>
        <Text style={styles.viewOptionsSubtitle}>de mov por moneda</Text>
       </View>
       <Image
        source={
         selectedView === APP_CONSTANTS.TYPE_VIEW_RESUM
          ? require('../../../../../assets/images/ui/btnojo2.png')
          : require('../../../../../assets/images/ui/btojoclose.png')
        }
        style={styles.viewOptionsIcon}
       />
      </TouchableOpacity>

      <TouchableOpacity
       style={styles.viewOptionsCard}
       activeOpacity={0.85}
       onPress={() => handleChangeView(APP_CONSTANTS.TYPE_VIEW_DETAIL)}
      >
       <View style={styles.viewOptionsTextWrap}>
        <Text style={styles.viewOptionsTitle}>VISTA DETALLADA</Text>
        <Text style={styles.viewOptionsSubtitle}>de mov por moneda</Text>
       </View>
       <Image
        source={
         selectedView === APP_CONSTANTS.TYPE_VIEW_DETAIL
          ? require('../../../../../assets/images/ui/btnojo2.png')
          : require('../../../../../assets/images/ui/btojoclose.png')
        }
        style={styles.viewOptionsIcon}
       />
      </TouchableOpacity>
     </View>
    ) : null}
   </View>

   {selectedQuickFilterKeys.length > 1 || selectedUserName ? (
    <Text style={styles.userFilterCaption}>
     {selectedUserName ? `Usuario filtrado: ${selectedUserName}` : 'Filtros combinados activos'}
    </Text>
   ) : null}

   <ScrollView contentContainerStyle={styles.summaryContent}>
    {balancesLoading ? (
     <View style={styles.emptyWrap}>
      <ActivityIndicator size="small" color="#6f6392" />
      <Text style={styles.emptyText}>Cargando caja total...</Text>
     </View>
    ) : balancesError ? (
     <View style={styles.emptyWrap}>
      <Text style={styles.emptyText}>No se pudo cargar la caja total</Text>
      <Text style={styles.retryText}>{balancesError}</Text>
      <TouchableOpacity activeOpacity={0.8} onPress={refreshBalances}>
       <Text style={styles.retryText}>Reintentar</Text>
      </TouchableOpacity>
     </View>
    ) : balances.length ? (
     balances.map((item) => {
      const expanded = openCoinId === item.coin_id;
      return (
       <BoxCoinItem
        key={`${item.coin_id}-${item.coin_short_name}`}
        item={item}
        expanded={expanded}
        selectedView={selectedView}
        onPress={() => handleToggleCoin(item.coin_id)}
        detailContent={
         <CoinMovementDetail
          items={coinItemsCache[item.coin_id] ?? []}
          loading={Boolean(coinLoading[item.coin_id])}
          loadingMore={Boolean(coinLoadingMore[item.coin_id])}
          hasMore={Boolean(coinHasMore[item.coin_id])}
          error={coinError[item.coin_id] ?? null}
          onRetry={() => loadCoinItemsFirstPage(item.coin_id)}
          onLoadMore={() => loadCoinItemsNextPage(item.coin_id)}
          onLongPressItem={handleLongPressItem}
         />
        }
        summaryContent={
         <CoinMovementSummary
          items={coinSummaryCache[item.coin_id] ?? []}
          loading={Boolean(coinSummaryLoading[item.coin_id])}
          error={coinSummaryError[item.coin_id] ?? null}
          onRetry={() => loadCoinSummary(item.coin_id)}
         />
        }
       />
      );
     })
    ) : (
     <Text style={styles.summaryText}>No hay saldos para mostrar en caja total.</Text>
    )}
   </ScrollView>

   <AddActionButton
    style={styles.summaryFab}
    onPress={() => {
     if (!userId) {
      Alert.alert('Atención', 'No se pudo identificar el usuario actual.');
      return;
     }
     setAddDialogVisible(true);
    }}
   />

   <OperationsFiltersBottomSheet
    height={sheetHeight}
    peekHeight={sheetPeek}
    contentBottomPadding={18}
    quickFilters={BOX_QUICK_FILTERS}
    secondaryQuickFilters={BOX_SECONDARY_QUICK_FILTERS}
    selectedQuickFilter="all"
    selectedQuickFilterKeys={selectedQuickFilterKeys}
    onSelectQuickFilter={(key) => handleSelectQuickFilter(key as BoxQuickFilter)}
   />

   <AddMovementDialog
    visible={addDialogVisible}
    accountId={APP_CONSTANTS.CUENTA_CAJA_GENERAL}
    coinOptions={coinOptions}
    coinsCatalog={coins.map((coin) => ({ id: coin.id, shortName: coin.short_name }))}
    onClose={() => setAddDialogVisible(false)}
    onSaved={async ({ coinId }) => {
     await refreshAllMovementsAndBalances();
     setOpenCoinId(coinId);
    }}
   />

   <EditMovementDialog
    visible={editDialogVisible}
    accountId={APP_CONSTANTS.CUENTA_CAJA_GENERAL}
    item={editingMovement}
    onClose={() => {
     setEditDialogVisible(false);
     setEditingMovement(null);
    }}
    onSave={async ({ id, state, debit, credit, created }) => {
     await putItemOperation({
      id,
      state,
      debit,
      credit,
      created,
     });
     await refreshAllMovementsAndBalances();
    }}
   />

   <ChangeStateItemDialog
    visible={changeStateDialogVisible}
    item={changingStateMovement}
    onClose={() => {
     setChangeStateDialogVisible(false);
     setChangingStateMovement(null);
    }}
    onSave={async ({ id, state }) => {
     await changeStateItem(id, state);
     await refreshAllMovementsAndBalances();
    }}
   />

   <BoxDeleteMovementDialog
    visible={deleteDialogVisible}
    item={deletingMovement}
    onClose={() => {
      setDeleteDialogVisible(false);
      setDeletingMovement(null);
    }}
    onDelete={async (item) => {
     await deleteReportItem(item.id);
     await refreshAllMovementsAndBalances();
    }}
   />

   <ContextActionMenu
    visible={!!menuMovement}
    top={menuTop}
    onClose={() => setMenuMovement(null)}
    cardStyle={styles.movementActionMenuCard}
    itemStyle={styles.movementActionMenuItem}
    textStyle={styles.movementActionMenuText}
    items={[
     {
      label: 'Cambiar estado',
      onPress: () => {
       if (!menuMovement) return;
       setChangingStateMovement(menuMovement);
       setChangeStateDialogVisible(true);
      },
     },
     {
      label: 'Editar',
      onPress: () => {
       if (!menuMovement) return;
       setEditingMovement(menuMovement);
       setEditDialogVisible(true);
      },
     },
     {
      label: 'Borrar',
      onPress: () => {
       if (!menuMovement) return;
       setDeletingMovement(menuMovement);
       setDeleteDialogVisible(true);
      },
     },
    ]}
   />

   <Modal visible={usersDialogVisible} transparent animationType="fade" onRequestClose={() => setUsersDialogVisible(false)}>
    <Pressable style={styles.usersDialogBackdrop} onPress={() => setUsersDialogVisible(false)}>
     <Pressable style={styles.usersDialogCard} onPress={() => {}}>
      <Text style={styles.usersDialogTitle}>Seleccionar usuario</Text>

      <View style={styles.usersList}>
       {loadingUsers ? (
        <View style={styles.usersDialogLoadingWrap}>
         <ActivityIndicator size="small" color="#6f6392" />
        </View>
       ) : usersError ? (
        <View style={styles.usersDialogLoadingWrap}>
         <Text style={styles.usersDialogEmptyText}>{usersError}</Text>
        </View>
       ) : (
        <ScrollView nestedScrollEnabled>
         <TouchableOpacity
          style={styles.userRow}
          activeOpacity={0.8}
            onPress={() => {
             setSelectedUser(APP_CONSTANTS.USER_ALL);
             setSelectedUserName('');
             setUsersDialogVisible(false);
            }}
         >
          <View style={styles.userAvatar}>
           <Text style={styles.userAvatarText}>T</Text>
          </View>
          <Text style={styles.userRowText}>Todos</Text>
         </TouchableOpacity>

         {users.map((user) => (
          <TouchableOpacity
           key={user.id}
           style={styles.userRow}
           activeOpacity={0.8}
            onPress={() => {
             setSelectedUser(user.id);
             setSelectedUserName(user.name);
             setUsersDialogVisible(false);
            }}
          >
           <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{String(user.name || '?').slice(0, 1).toUpperCase()}</Text>
           </View>
           <Text style={styles.userRowText}>{user.name}</Text>
          </TouchableOpacity>
         ))}
        </ScrollView>
       )}
      </View>

      <View style={styles.usersDialogActions}>
       <TouchableOpacity style={styles.usersDialogCancelBtn} activeOpacity={0.8} onPress={() => setUsersDialogVisible(false)}>
        <Text style={styles.usersDialogCancelText}>Cancelar</Text>
       </TouchableOpacity>
      </View>
     </Pressable>
    </Pressable>
   </Modal>
  </View>
 );
}
