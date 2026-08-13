import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import { dateHelper } from '../../../helpers/dateHelper';
import type { ReportCheck } from '../services/checkService';
import styles from './CheckInfoDialog.styles';

type Props = {
  visible: boolean;
  item: ReportCheck;
  state: 'pendient' | 'done';
  onClose: () => void;
  onPressDelete?: () => void;
};

const formatAmountDisplay = (value: number) =>
  Math.round(Number(value || 0)).toLocaleString('en-US');

function DottedDivider() {
  return (
    <View style={styles.amountDivider}>
      {Array.from({ length: 10 }).map((_, index) => (
        <View key={index} style={styles.amountDividerDot} />
      ))}
    </View>
  );
}

export default function CheckInfoDialog({ visible, item, state, onClose, onPressDelete }: Props) {
  const approvedAmountValue =
    item.total_approve_amount > 0
      ? item.total_approve_amount
      : item.items
        .slice(0, item.count_parcial_loader || item.items.length)
        .reduce((sum, detail) => sum + Number(detail.monto || 0), 0);
  const todayDate = dateHelper.onlyDate(dateHelper.getActualDate());
  const operationCreatedDate = dateHelper.parseDate(item.operation_created);
  const deleteUntilDate = operationCreatedDate
    ? new Date(
      operationCreatedDate.getFullYear(),
      operationCreatedDate.getMonth(),
      operationCreatedDate.getDate() + 7,
    )
    : null;
  const todayParsed = dateHelper.parseDate(`${todayDate} 00:00:00`);
  const withinDeleteWindow =
    Boolean(deleteUntilDate) && Boolean(todayParsed) && todayParsed!.getTime() <= deleteUntilDate!.getTime();
  const canDeleteWithoutWindow =
    (item.count_parcial_loader === 0 && item.rejected_amount === 0 && item.total_approve_amount === 0) ||
    (item.count_parcial_loader === 1 && dateHelper.onlyDate(item.approve_date) === todayDate);
  const showDelete = withinDeleteWindow || canDeleteWithoutWindow;

  return (
    <AppDialog visible={visible} onClose={onClose} backdropStyle={styles.backdrop} cardStyle={styles.card}>
      <Text style={styles.title}>INFO CHEQUES</Text>

      <View style={styles.amountRow}>
        <View style={styles.amountLeft}>
          <Image source={require('../../../../assets/images/ui/check.png')} style={styles.amountIcon} />
          <Text style={styles.amountLabel}>Monto total</Text>
        </View>
        <DottedDivider />
        <Text style={styles.amountValue}>{formatAmountDisplay(item.total_amount)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Monto total aprobado</Text>
        <Text style={styles.summaryValue}>{formatAmountDisplay(approvedAmountValue)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, styles.summaryLabelWarning]}>Monto total rechazado</Text>
        <Text style={styles.summaryValue2}>{formatAmountDisplay(item.rejected_amount)}</Text>
      </View>

      <View style={styles.fieldsGrid}>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>cuenta cliente</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{item.account_client_name || '-'}</Text>
          </View>
        </View>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>cuenta mutual</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{item.account_mutual_name || '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.fieldsGrid}>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>fecha carga</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{dateHelper.onlyDateHour(item.load_date) || '-'}</Text>
          </View>
        </View>
        <View style={styles.fieldCol}>
          <Text style={styles.fieldLabel}>fecha aprobado</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>
              {state === 'done' ? dateHelper.onlyDateHour(item.approve_date) || '-' : 'pendiente'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <View style={styles.actionHalf}>
          {showDelete ? (
            <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={onPressDelete}>
              <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.deleteIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.actionHalf}>
          <TouchableOpacity style={styles.closeBtn} activeOpacity={0.85} onPress={onClose}>
            <Text style={styles.closeText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppDialog>
  );
}
