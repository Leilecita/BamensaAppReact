import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { dateHelper } from '../../../helpers/dateHelper';
import { deleteItemCheck, type ReportItemCheck, type ReportItemCheckEntry } from '../services/checkService';
import CheckDeleteLoadDialog from './CheckDeleteLoadDialog';
import styles from './CheckLoadItem.styles';

type Props = {
  item: ReportItemCheck;
  pending: boolean;
  parentLoadType?: string;
  checkDetailId?: number;
  onDeleted?: () => void | Promise<void>;
};

const formatAmountDisplay = (value: number) =>
  Math.round(Number(value || 0)).toLocaleString('en-US');

const showMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }
  Alert.alert('Atención', message);
};

function CheckLoadDivider({ count, rejection = false }: { count: number; rejection?: boolean }) {
  return (
    <View style={styles.checkLoadDotDivider}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.checkLoadDotDividerDot,
            rejection ? styles.checkLoadDotDividerDotRejected : null,
          ]}
        />
      ))}
    </View>
  );
}

type DetailRow = {
  key: string;
  label: string;
  value: string;
};

const getStatusMeta = (item: ReportItemCheck, parentLoadType?: string) => {
  const numbers = item.items.map((entry) => Number(entry.number || 0));
  const hasRejectStart = numbers.includes(44);
  const hasRejectMiddle = numbers.includes(55);
  const hasRejectEnd = numbers.includes(66);
  const resolvedLoadType = String(parentLoadType || item.load_type || '').trim().toLowerCase();

  if (hasRejectEnd) return { label: 'rechazado', rejection: true };
  if (hasRejectStart || hasRejectMiddle) {
    return { label: 'parcial rechazado', rejection: true };
  }
  if (resolvedLoadType === 'total') {
    return { label: 'aprobado', rejection: false };
  }
  return { label: 'parcial aprobado', rejection: false };
};

const getDetailRows = (entries: ReportItemCheckEntry[]): DetailRow[] => {
  const defaultRows: DetailRow[] = [
    { key: '11', label: 'Depósito cta cliente', value: '' },
    { key: '22', label: 'Retiro cta mutual', value: '' },
    { key: '33', label: 'Depósito caja general', value: '' },
  ];

  const byNumber = new Map(entries.map((entry) => [Number(entry.number || 0), entry]));

  const row11 = byNumber.get(11);
  if (row11) defaultRows[0].value = formatAmountDisplay(row11.monto_account || 0);

  const row22 = byNumber.get(22);
  if (row22) defaultRows[1].value = formatAmountDisplay(row22.monto_account || 0);

  const row33 = byNumber.get(33);
  if (row33) defaultRows[2].value = formatAmountDisplay(row33.monto_account || 0);

  const row44 = byNumber.get(44);
  if (row44) {
    defaultRows[0].label = 'retiro cta cliente';
    defaultRows[0].value = formatAmountDisplay(row44.monto_account || 0);
  }

  const row55 = byNumber.get(55);
  if (row55) {
    defaultRows[1].label = 'depósito cta mutual';
    defaultRows[1].value = formatAmountDisplay(row55.monto_account || 0);
  }

  const row66 = byNumber.get(66);
  if (row66) {
    defaultRows[2].label = 'depósito caja general';
    defaultRows[2].value = formatAmountDisplay(row66.monto_account || 0);
  }

  return defaultRows.filter((row) => row.value !== '');
};

export default function CheckLoadItem({ item, pending, parentLoadType, checkDetailId = 0, onDeleted }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const status = useMemo(() => getStatusMeta(item, parentLoadType), [item, parentLoadType]);
  const detailRows = useMemo(() => getDetailRows(item.items), [item.items]);
  const dayText = useMemo(() => dateHelper.getDayMonth(item.created), [item.created]);
  const isCreatedToday = useMemo(
    () => dateHelper.onlyDate(item.created) === dateHelper.onlyDate(dateHelper.getActualDate()),
    [item.created],
  );
  const itemOperationIds = useMemo(
    () =>
      item.items
        .map((entry) => Number(entry.item_operation_id || 0))
        .filter((entryId) => Number.isFinite(entryId) && entryId > 0),
    [item.items],
  );
  const canDeleteData = pending && expanded && !deleting && itemOperationIds.length >= 3 && checkDetailId > 0;
  const canDelete = canDeleteData && isCreatedToday;
  const handleToggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleDelete = () => {
    if (!canDeleteData) return;
    if (!isCreatedToday) {
      showMessage('Solo puede borrar una operación el mismo día de carga');
      return;
    }
    setDeleteDialogVisible(true);
  };

  const confirmDelete = async () => {
    if (!canDelete) return;
    setDeleting(true);
    try {
      await deleteItemCheck({
        id_1: itemOperationIds[0],
        id_2: itemOperationIds[1],
        id_3: itemOperationIds[2],
        check_detail_id: checkDetailId,
        load_type: item.load_type,
      });
      setDeleteDialogVisible(false);
      setExpanded(false);
      await onDeleted?.();
    } catch (error: any) {
      showMessage(error?.message || 'No se pudo eliminar la carga del cheque');
    } finally {
      setDeleting(false);
    }
  };

  const headerContent = (
    <>
      <View style={styles.checkLoadItemHeader}>
        <TouchableOpacity
          style={styles.checkLoadItemHeaderInfo}
          activeOpacity={0.85}
          onPress={handleToggleExpanded}
        >
          <Text style={[styles.checkLoadItemDay, status.rejection ? styles.checkLoadItemTextRejected : null]}>
            {dayText}
          </Text>
          <Text
            style={[
              styles.checkLoadItemState,
              status.rejection ? styles.checkLoadItemStateRejected : null,
              status.rejection ? styles.checkLoadItemTextRejected : null,
            ]}
          >
            {status.label}
          </Text>
        </TouchableOpacity>

        <View style={styles.checkLoadItemDividerWrap}>
          {pending && expanded ? (
            <TouchableOpacity
              style={styles.checkLoadItemDeleteInlineBtn}
              activeOpacity={0.8}
              onPress={handleDelete}
              disabled={!canDeleteData}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={status.rejection ? '#d27d22' : '#7b7e84'} />
              ) : (
                <Image
                  source={require('../../../../assets/images/ui/deletesan.png')}
                  style={[
                    styles.checkLoadItemDeleteInlineIcon,
                    status.rejection ? styles.checkLoadItemArrowRejected : null,
                    !canDelete ? styles.checkLoadItemDeleteInlineIconDisabled : null,
                  ]}
                />
              )}
            </TouchableOpacity>
          ) : (
            <CheckLoadDivider count={5} rejection={status.rejection} />
          )}
        </View>

        <TouchableOpacity
          style={styles.checkLoadItemRight}
          activeOpacity={0.85}
          onPress={handleToggleExpanded}
        >
          <Text style={[styles.checkLoadItemAmount, status.rejection ? styles.checkLoadItemTextRejected : null]}>
            {formatAmountDisplay(item.monto)}
          </Text>
          <Image
            source={require('../../../../assets/images/ui/downop.png')}
            style={[
              styles.checkLoadItemArrow,
              status.rejection ? styles.checkLoadItemArrowRejected : null,
              expanded ? styles.checkLoadItemArrowExpanded : null,
            ]}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={[styles.checkLoadItemWrap, status.rejection ? styles.checkLoadItemWrapRejected : null]}>
      {pending ? (
        headerContent
      ) : (
        <TouchableOpacity style={styles.checkLoadItemHeaderTouch} activeOpacity={0.85} onPress={handleToggleExpanded}>
          {headerContent}
        </TouchableOpacity>
      )}

      {expanded ? (
        <View
          style={[
            styles.checkLoadItemDetailsGrid,
            status.rejection ? styles.checkLoadItemDetailsGridRejected : null,
          ]}
        >
          <View style={styles.checkLoadItemDetailsLeftColumn}>
            {detailRows.map((row, index) => (
              <View key={`${item.created}-${row.key}-${index}`} style={styles.checkLoadItemDetailLeftRow}>
                <Text
                  style={[
                    styles.checkLoadItemDetailLabel,
                    status.rejection ? styles.checkLoadItemTextRejected : null,
                  ]}
                >
                  {row.label}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.checkLoadItemDividerWrap}>
            <CheckLoadDivider count={22} rejection={status.rejection} />
          </View>

          <View style={styles.checkLoadItemDetailsRightColumn}>
            {detailRows.map((row, index) => (
              <View key={`${item.created}-${row.key}-${index}-value`} style={styles.checkLoadItemDetailRightRow}>
                <Text
                  style={[
                    styles.checkLoadItemDetailValue,
                    status.rejection ? styles.checkLoadItemTextRejected : null,
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <CheckDeleteLoadDialog
        visible={deleteDialogVisible}
        dayText={dayText}
        statusLabel={status.label}
        amountText={formatAmountDisplay(item.monto)}
        rejection={status.rejection}
        detailRows={detailRows}
        deleting={deleting}
        onClose={() => {
          if (deleting) return;
          setDeleteDialogVisible(false);
        }}
        onConfirm={confirmDelete}
      />
    </View>
  );
}
