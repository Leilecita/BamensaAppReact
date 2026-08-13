import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import styles from './CheckDeleteLoadDialog.styles';

type DetailRow = {
  key: string;
  label: string;
  value: string;
};

type Props = {
  visible: boolean;
  dayText: string;
  statusLabel: string;
  amountText: string;
  rejection: boolean;
  detailRows: DetailRow[];
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function DottedDivider({ rejection, count = 10 }: { rejection: boolean; count?: number }) {
  return (
    <View style={styles.divider}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[styles.dividerDot, rejection ? styles.dividerDotRejected : null]}
        />
      ))}
    </View>
  );
}

export default function CheckDeleteLoadDialog({
  visible,
  dayText,
  statusLabel,
  amountText,
  rejection,
  detailRows,
  deleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AppDialog visible={visible} onClose={onClose} backdropStyle={styles.backdrop} cardStyle={styles.card}>
      <Text style={styles.title}>Eliminar Operacion</Text>

      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={styles.dayChip}>
            <Text style={styles.dayText}>{dayText}</Text>
          </View>
          <Text style={styles.statusText}>{statusLabel}</Text>
        </View>

        <View style={styles.dividerWrap}>

        </View>

        <View style={styles.amountWrap}>
          <Text style={styles.amountText}>{amountText}</Text>
        </View>
      </View>

      <View style={styles.detailsBlock}>
        {detailRows.map((row, index) => (
          <View key={`${row.key}-${index}`} style={styles.detailRow}>
            <View style={styles.detailLabelWrap}>
              <Text style={styles.detailLabel}>{row.label}</Text>
            </View>
            <View style={styles.dividerWrap}>
              <DottedDivider rejection={rejection} />
            </View>
            <View style={styles.detailValueWrap}>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.warningText}>
        Esta operación afectará la caja general. Se eliminarán los movimientos detallados anteriormente.
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
