import React, { useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, SectionList, Text, TouchableOpacity, View } from 'react-native';
import AddActionButton from '../../../core/components/AddActionButton';
import AppTopBar from '../../../core/components/AppTopBar';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { dateHelper } from '../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import { useCoins } from '../../coins/hooks/useCoins';
import AddOutcomeDialog from '../components/AddOutcomeDialog';
import OutcomeItem from '../components/OutcomeItem';
import OutcomesFiltersBottomSheet from '../components/OutcomesFiltersBottomSheet';
import { useOutcomes } from '../hooks/useOutcomes';
import {
 createOutcome,
 deleteOutcomeOperation,
 GroupByType,
 ReportOutcome,
 updateOutcomeItem,
 updateOutcomeOperation,
} from '../services/outcomeService';
import styles from './OutcomesScreen.styles';

type OutcomeSection = {
 title: string;
 data: ReportOutcome[];
 totals: {
  ars: number;
  usd: number;
 };
};

export default function OutcomesScreen() {
 const { navigateTo } = useSideMenu();
 const { userId } = useContext(AuthContext);
 const { coins } = useCoins();
 const [addDialogVisible, setAddDialogVisible] = useState(false);
 const [editDialogVisible, setEditDialogVisible] = useState(false);
 const [editingOutcome, setEditingOutcome] = useState<ReportOutcome | null>(null);
 const [deletingOutcome, setDeletingOutcome] = useState<ReportOutcome | null>(null);
 const [groupBy, setGroupBy] = useState<GroupByType>('month');
 const [selectedCoin, setSelectedCoin] = useState<number>(APP_CONSTANTS.COIN_ALL);
 const sheetHeight = 200;
 const sheetPeek = 80;

 const { outcomes, loading, loadingMore, error, loadMore, reload } = useOutcomes({
  coinId: selectedCoin,
  groupBy,
 });

 const sections = useMemo<OutcomeSection[]>(() => {
  const byDate = new Map<string, ReportOutcome[]>();
  const normalizeDateKey = (rawDate: string) => {
    const value = rawDate.trim();
    if (!value) return '';

    const [datePart] = value.split(' ');
    if (!datePart) return '';

    const dashParts = datePart.split('-');
    if (dashParts.length === 3) {
      // yyyy-mm-dd
      if (dashParts[0].length === 4) return datePart;
      // dd-mm-yyyy
      if (dashParts[2].length === 4) return `${dashParts[2]}-${dashParts[1]}-${dashParts[0]}`;
    }

    const slashParts = datePart.split('/');
    if (slashParts.length === 3) {
      // dd/mm/yyyy
      if (slashParts[2].length === 4) return `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`;
    }

    return '';
  };

  const getDateKey = (value?: string) => {
    if (!value) return 'Sin fecha';
    const normalized = normalizeDateKey(value);
    if (!normalized) return 'Sin fecha';
    if (groupBy === 'month') {
      const [yyyy, mm] = normalized.split('-');
      return `${yyyy}-${mm}-01`;
    }
    return normalized;
  };

  outcomes.forEach((item) => {
    const key = getDateKey(item.created);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)?.push(item);
  });

  return Array.from(byDate.entries()).map(([dateKey, data]) => {
    const sectionTotals = data.reduce(
      (acc, item) => ({
        ars: item.tot_ars > 0 ? item.tot_ars : acc.ars,
        usd: item.tot_usd > 0 ? item.tot_usd : acc.usd,
      }),
      { ars: 0, usd: 0 },
    );

    return {
      title:
        groupBy === 'month'
          ? dateHelper.formatHeaderMonthYearEs(dateKey)
          : dateHelper.formatHeaderDateEs(dateKey),
      data,
      totals: sectionTotals,
    };
  });
 }, [groupBy, outcomes]);

 const formatArsTotal = (value: number) => {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
 };

 const formatUsdTotal = (value: number) => {
  if (!Number.isFinite(value)) return '0.0';
  return value.toFixed(1);
 };

 const handleSaveOutcome = async ({
  coinShortName,
  amount,
  description,
  created,
 }: {
  coinShortName: string;
  amount: number;
  description: string;
  created: string;
 }) => {
  const selected = coins.find((coin) => coin.short_name === coinShortName);
  if (!selected) {
   Alert.alert('Moneda inválida', 'La moneda seleccionada no existe en el catálogo actual.');
   return;
  }
  const coinId = selected.id;

  try {
   await createOutcome({
    type: APP_CONSTANTS.TYPE_GASTO,
    exchange: 0,
    created,
    observation: description,
    account_id: -1,
    user_id: userId ?? 0,
    out_coin_id: coinId,
    out_account_id: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
    out_state: APP_CONSTANTS.STATE_DONE,
    amount_debit: amount,
    in_coin_id: coinId,
    in_account_id: -1,
    in_state: APP_CONSTANTS.STATE_DONE,
    amount_credit: 0,
   });

   setAddDialogVisible(false);
   await reload();
   Alert.alert('Listo', 'El gasto se guardó correctamente');
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo guardar el gasto');
  }
 };

 const handleOpenEditOutcome = (item: ReportOutcome) => {
  setEditingOutcome(item);
  setEditDialogVisible(true);
 };

 const handleDeleteOutcome = async (item: ReportOutcome) => {
  try {
   await deleteOutcomeOperation(item.outcome_id);
   setDeletingOutcome(null);
   await reload();
   Alert.alert('Listo', 'Se eliminó el gasto');
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo eliminar el gasto');
  }
 };

 const handleOpenOutcomeMenu = (item: ReportOutcome) => {
  Alert.alert('Opciones', 'Seleccioná una acción', [
   {
    text: 'Editar',
    onPress: () => handleOpenEditOutcome(item),
   },
   {
    text: 'Eliminar',
    style: 'destructive',
    onPress: () => setDeletingOutcome(item),
   },
   { text: 'Cancelar', style: 'cancel' },
  ]);
 };

 const handleSaveEditOutcome = async ({
  coinShortName,
  amount,
  description,
  created,
 }: {
  coinShortName: string;
  amount: number;
  description: string;
  created: string;
 }) => {
  if (!editingOutcome) return;

  const selected = coins.find((coin) => coin.short_name === coinShortName);
  if (!selected) {
   Alert.alert('Moneda inválida', 'La moneda seleccionada no existe en el catálogo actual.');
   return;
  }

  const coinChanged = editingOutcome.coin_name !== coinShortName;
  const valueChanged = Number(editingOutcome.value ?? 0) !== Number(amount ?? 0);
  const descChanged = (editingOutcome.description ?? '') !== description;
  const dateChanged = (editingOutcome.created ?? '') !== created;

  try {
   if (coinChanged || valueChanged) {
    await updateOutcomeItem({
      id: editingOutcome.item_operation_id,
      state: APP_CONSTANTS.STATE_DONE,
      debit: amount,
      credit: 0,
      coin_id: selected.id,
      created,
    });
   }

   if (descChanged || dateChanged) {
    await updateOutcomeOperation({
      id: editingOutcome.outcome_id,
      observation: description,
      created,
    });
   }

   setEditDialogVisible(false);
   setEditingOutcome(null);
   await reload();
   Alert.alert('Listo', 'El gasto fue editado correctamente');
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo editar el gasto');
  }
 };

 return (
  <View style={styles.screen}>
   <AppTopBar title="Gastos" leftSymbol="←" onPressLeft={() => navigateTo('home')} />

   <SectionList
    sections={sections}
    keyExtractor={(item, idx) => `${item.id}-${item.created}-${idx}`}
    renderSectionHeader={({ section }) => (
      <View style={styles.sectionHeaderWrap}>
       <View style={styles.sectionHeaderChip}>
        <Text style={styles.sectionHeaderText}>{section.title}</Text>
       </View>
       {groupBy === 'month' ? (
        <View style={styles.sectionTotalsWrap}>
         <View style={styles.sectionTotalChip}>
          <Image source={getFilterFlagSourceByShortName('ARS')} style={styles.sectionTotalFlag} />
          <Text style={styles.sectionTotalText}>{formatArsTotal(section.totals.ars)}</Text>
         </View>
         <View style={styles.sectionTotalChip}>
          <Image source={getFilterFlagSourceByShortName('USD')} style={styles.sectionTotalFlag} />
          <Text style={styles.sectionTotalText}>{formatUsdTotal(section.totals.usd)}</Text>
         </View>
        </View>
       ) : null}
      </View>
    )}
    renderItem={({ item }) => <OutcomeItem item={item} onLongPress={handleOpenOutcomeMenu} />}
    onEndReached={loadMore}
    onEndReachedThreshold={0.45}
    contentContainerStyle={styles.listContent}
    ListEmptyComponent={
      <View style={styles.emptyWrap}>
       {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
       <Text style={styles.emptyText}>
        {loading ? 'Cargando gastos...' : error ? 'No se pudieron cargar los gastos' : 'No hay gastos para mostrar'}
       </Text>
       {error ? (
        <TouchableOpacity style={styles.retryBtn} onPress={reload} activeOpacity={0.8}>
         <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
       ) : null}
      </View>
    }
    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
   />

   <AddActionButton style={styles.fab} onPress={() => setAddDialogVisible(true)} />

   <AddOutcomeDialog
    visible={addDialogVisible}
    coins={coins}
    title="Gasto"
    onClose={() => setAddDialogVisible(false)}
    onSave={handleSaveOutcome}
   />

   <AddOutcomeDialog
    visible={editDialogVisible}
    coins={coins}
    title="Editar gasto"
    initialData={
      editingOutcome
        ? {
            coinShortName: editingOutcome.coin_name,
            amount: editingOutcome.value,
            description: editingOutcome.description,
            created: editingOutcome.created,
          }
        : undefined
    }
    onClose={() => {
      setEditDialogVisible(false);
      setEditingOutcome(null);
    }}
   onSave={handleSaveEditOutcome}
   />

   <Modal
    visible={!!deletingOutcome}
    transparent
    animationType="fade"
    onRequestClose={() => setDeletingOutcome(null)}
   >
    <Pressable style={styles.deleteDialogBackdrop} onPress={() => setDeletingOutcome(null)}>
     <Pressable style={styles.deleteDialogCard} onPress={() => {}}>
      <Text style={styles.deleteDialogTitle}>Gasto</Text>

      <View style={styles.deleteDialogInfoRow}>
       <Text style={styles.deleteDialogInfoText}>{deletingOutcome?.type || '-'}</Text>
       <Text style={styles.deleteDialogInfoDash}>-</Text>
       <Text style={styles.deleteDialogInfoText}>{deletingOutcome?.description || '-'}</Text>
       <Text style={styles.deleteDialogInfoDash}>-</Text>
       <Text style={styles.deleteDialogInfoText}>{Number(deletingOutcome?.value ?? 0).toFixed(1)}</Text>
      </View>

      <View style={styles.deleteDialogActions}>
       <TouchableOpacity
        style={styles.deleteDialogCancelBtn}
        onPress={() => setDeletingOutcome(null)}
        activeOpacity={0.8}
       >
        <Text style={styles.deleteDialogCancelText}>Cancelar</Text>
       </TouchableOpacity>
       <TouchableOpacity
        style={styles.deleteDialogDeleteBtn}
        onPress={() => deletingOutcome && handleDeleteOutcome(deletingOutcome)}
        activeOpacity={0.8}
       >
        <Text style={styles.deleteDialogDeleteText}>Borrar</Text>
       </TouchableOpacity>
      </View>
     </Pressable>
    </Pressable>
   </Modal>

   <OutcomesFiltersBottomSheet
    height={sheetHeight}
    peekHeight={sheetPeek}
    groupBy={groupBy}
    onChangeGroupBy={setGroupBy}
    coins={coins}
    selectedCoinId={selectedCoin}
    onChangeCoinId={setSelectedCoin}
   />
  </View>
 );
}
