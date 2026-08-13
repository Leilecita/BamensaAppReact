import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import type { ReportCheck } from '../services/checkService';
import styles from './CheckDeleteOperationDialog.styles';

type Props = {
  visible: boolean;
  item: ReportCheck;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const formatAmountDisplay = (value: number) => String(Math.round(Number(value || 0)));

function DottedDivider() {
  return (
    <View style={styles.divider}>
      {Array.from({ length: 18 }).map((_, index) => (
        <View key={index} style={styles.dividerDot} />
      ))}
    </View>
  );
}

export default function CheckDeleteOperationDialog({ visible, item, deleting, onClose, onConfirm }: Props) {
  return (
    <AppDialog visible={visible} onClose={onClose} backdropStyle={styles.backdrop} cardStyle={styles.card}>
      <Text style={styles.title}>ELIMINAR OPERACION</Text>

      <View style={styles.headerRow}>
        <View style={styles.percentagesWrap}>
          <View style={styles.headerLeft}>
            <Image source={require('../../../../assets/images/ui/check.png')} style={styles.checkIcon} />
            <Text style={styles.accountName}>{item.account_client_name || '-'}</Text>
          </View>

          <View style={styles.percentageRow}>
            <Image source={require('../../../../assets/images/ui/bammut.png')} style={styles.percentageIcon} />
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageValue}>{formatAmountDisplay(item.percentage_mutual)}</Text>
              <Text style={styles.percentageSymbol}>%</Text>
            </View>
          </View>

          <View style={styles.percentageRow}>
            <Image source={require('../../../../assets/images/ui/baml.png')} style={styles.percentageIcon} />
            <View style={styles.percentageBadge}>
              <Text style={styles.percentageValue}>{formatAmountDisplay(item.percentage_bam)}</Text>
              <Text style={styles.percentageSymbol}>%</Text>
            </View>
          </View>
        </View>

        <DottedDivider />

        <View style={styles.headerRight}>
          <Text style={styles.totalLabel}>Total cheque</Text>
          <Text style={styles.totalAmount}>{formatAmountDisplay(item.total_amount)}</Text>
        </View>
      </View>

      <Text style={styles.message}>
        Si la operación tiene montos parciales aprobados o montos rechazados serán eliminados del sistema.
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onClose} disabled={deleting}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={onConfirm} disabled={deleting}>
          {deleting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.deleteText}>Borrar</Text>}
        </TouchableOpacity>
      </View>
    </AppDialog>
  );
}
