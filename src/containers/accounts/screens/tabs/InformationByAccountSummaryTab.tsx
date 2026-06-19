import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AccountCoinBalanceParam } from '../../../../core/navigation/AppStack';
import AddActionButton from '../../../../core/components/AddActionButton';
import ContextActionMenu from '../../../../core/components/ContextActionMenu';
import { APP_CONSTANTS } from '../../../../core/constants/appConstants';
import { useCoins } from '../../../coins/hooks/useCoins';
import { dateHelper } from '../../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../../helpers/flagHelper';
import { formatAmount1Decimal } from '../../../../helpers/valuesHelper';
import AddMovementDialog from '../../components/AddMovementDialog';
import ChangeStateItemDialog from '../../components/ChangeStateItemDialog';
import DeleteMovementDialog from '../../components/DeleteMovementDialog';
import EditMovementDialog from '../../components/EditMovementDialog';
import DateChip from '../../components/DateChip';
import ItemOpByCoin2 from '../../components/ItemOpByCoin2';
import {
  changeStateItem,
  deleteReportItem,
  fetchItemsOperationByCoin,
  getTotalAmountCoinsByAccountId,
  putItemOperation,
  ReportItemOperation,
} from '../../services/accountItemsOperationService';
import { shouldBlockMirrorAccountMovementCreation } from '../../services/accountMovementService';
import api from '../../../../core/services/axiosClient';
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
  onLongPressItem,
}: {
  items: ReportItemOperation[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onRetry: () => void;
  onLoadMore: () => void;
  coinShortName: string;
  onLongPressItem: (item: ReportItemOperation, anchorY: number) => void;
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
                <ItemOpByCoin2 item={item} onLongPress={onLongPressItem} />
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
  const { height: windowHeight } = useWindowDimensions();
  const { coins } = useCoins();
  const [balancesView, setBalancesView] = useState<AccountCoinBalanceParam[]>(balances);
  const [openCoinId, setOpenCoinId] = useState<number | null>(null);
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [coinItemsCache, setCoinItemsCache] = useState<Record<number, ReportItemOperation[]>>({});
  const [coinLoading, setCoinLoading] = useState<Record<number, boolean>>({});
  const [coinLoadingMore, setCoinLoadingMore] = useState<Record<number, boolean>>({});
  const [coinError, setCoinError] = useState<Record<number, string | null>>({});
  const [coinPage, setCoinPage] = useState<Record<number, number>>({});
  const [coinHasMore, setCoinHasMore] = useState<Record<number, boolean>>({});
  const [refreshingSummary, setRefreshingSummary] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editingMovement, setEditingMovement] = useState<ReportItemOperation | null>(null);
  const [changeStateDialogVisible, setChangeStateDialogVisible] = useState(false);
  const [changingStateMovement, setChangingStateMovement] = useState<ReportItemOperation | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [deletingMovement, setDeletingMovement] = useState<ReportItemOperation | null>(null);
  const [menuMovement, setMenuMovement] = useState<ReportItemOperation | null>(null);
  const [menuTop, setMenuTop] = useState(180);

  useEffect(() => {
    setBalancesView(balances);
  }, [balances]);

  const shouldBlockMovementCreation = useMemo(() => {
    return shouldBlockMirrorAccountMovementCreation(api.defaults.baseURL, accountId);
  }, [accountId]);

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

  const refreshAllMovementsAndBalances = useCallback(async () => {
    setRefreshingSummary(true);
    try {
      const balancesByAccount = await getTotalAmountCoinsByAccountId(accountId);

      setBalancesView(
        balancesByAccount.map((row) => ({
          coin_id: row.coin_id,
          coin_short_name: row.coin_short_name,
          balance: row.balance,
        })),
      );

      const entries = await Promise.all(
        balancesByAccount.map(async (coin) => {
          try {
            const items = await fetchItemsOperationByCoin(0, coin.coin_id, accountId);
            return [coin.coin_id, items] as const;
          } catch {
            return [coin.coin_id, [] as ReportItemOperation[]] as const;
          }
        }),
      );

      const nextCache: Record<number, ReportItemOperation[]> = {};
      const nextPage: Record<number, number> = {};
      const nextHasMore: Record<number, boolean> = {};

      entries.forEach(([coinId, items]) => {
        nextCache[coinId] = items;
        nextPage[coinId] = 0;
        nextHasMore[coinId] = items.length >= PAGE_SIZE;
      });

      setCoinItemsCache(nextCache);
      setCoinPage(nextPage);
      setCoinHasMore(nextHasMore);
    } finally {
      setRefreshingSummary(false);
    }
  }, [accountId]);

  useFocusEffect(
    useCallback(() => {
      void refreshAllMovementsAndBalances();
    }, [refreshAllMovementsAndBalances]),
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

  const handleLongPressItem = useCallback(
    (item: ReportItemOperation, anchorY: number) => {
      setMenuTop(Math.min(Math.max(110, anchorY + 15), windowHeight - 290));
      setMenuMovement(item);
    },
    [windowHeight]
  );

  const handleSaveEditMovement = useCallback(
    async ({
      id,
      state,
      debit,
      credit,
      created,
      coinId: _coinId,
    }: {
      id: number;
      state: string;
      debit: number;
      credit: number;
      created: string;
      coinId: number;
    }) => {
      await putItemOperation({
        id,
        state,
        debit,
        credit,
        created,
      });
      await refreshAllMovementsAndBalances();
    },
    [refreshAllMovementsAndBalances]
  );

  const sortedBalances = useMemo(() => balancesView, [balancesView]);
  const coinOptions = useMemo(
    () => {
      const fromCatalog = coins
        .map((coin) => String(coin.short_name ?? '').toUpperCase().trim())
        .filter(Boolean);

      if (fromCatalog.length) {
        return Array.from(new Set(fromCatalog));
      }

      const fromBalances = balancesView
        .map((b) => String(b.coin_short_name ?? '').toUpperCase().trim())
        .filter(Boolean);
      return Array.from(new Set(fromBalances));
    },
    [balancesView, coins]
  );

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
                    {refreshingSummary ? '' : formatAmount1Decimal(item.balance)}
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
                    onLongPressItem={handleLongPressItem}
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

      <AddActionButton
        style={styles.summaryFab}
        onPress={() => {
          if (shouldBlockMovementCreation) {
            Alert.alert('Atención', 'Esta cuenta muestra movimientos en espejo de la sucursal Fisherton.');
            return;
          }
          setAddDialogVisible(true);
        }}
      />
      <AddMovementDialog
        visible={addDialogVisible}
        accountId={accountId}
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
        accountId={accountId}
        item={editingMovement}
        onClose={() => {
          setEditDialogVisible(false);
          setEditingMovement(null);
        }}
        onSave={handleSaveEditMovement}
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
      <DeleteMovementDialog
        visible={deleteDialogVisible}
        accountId={accountId}
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
              if (
                String(menuMovement.nota ?? '').includes(APP_CONSTANTS.AFFECT_ACO) ||
                String(menuMovement.nota ?? '').includes(APP_CONSTANTS.AFFECT_ACI)
              ) {
                Alert.alert('Atención', 'No puede editar un movimiento que fue afectado por una COMPRA o VENTA.');
                return;
              }

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
    </View>
  );
}
