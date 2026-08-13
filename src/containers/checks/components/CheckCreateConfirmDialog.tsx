import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import styles from './CheckCreateConfirmDialog.styles';

type Props = {
  visible: boolean;
  saving: boolean;
  totalAmount: string;
  mutualPercent: string | number;
  mutualCommissionAmount: string;
  bamPercent: string | number;
  bamCommissionAmount: string;
  clientAccountName: string;
  clientAmount: string;
  mutualAccountName: string;
  mutualAmount: string;
  observation: string;
  onChangeObservation: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CheckCreateConfirmDialog({
  visible,
  saving,
  totalAmount,
  mutualPercent,
  mutualCommissionAmount,
  bamPercent,
  bamCommissionAmount,
  clientAccountName,
  clientAmount,
  mutualAccountName,
  mutualAmount,
  observation,
  onChangeObservation,
  onClose,
  onConfirm,
}: Props) {
  return (
    <AppDialog
      visible={visible}
      onClose={onClose}
      keyboardAware
      keyboardGap={14}
      backdropStyle={styles.backdrop}
      cardStyle={styles.card}
    >
      <Text style={styles.title}>INFO CHEQUE</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Total cheques</Text>
        <Text style={styles.summaryValue}>{totalAmount}</Text>
      </View>

      <View style={styles.percentRow}>
        <View style={styles.percentLeft}>
          <Image source={require('../../../../assets/images/ui/bammut.png')} style={styles.percentIcon} />
          <Text style={styles.percentNumber}>{mutualPercent || 0}</Text>
          <Text style={styles.percentSymbol}>%</Text>
        </View>
        <Text style={styles.percentAmount}>{mutualCommissionAmount}</Text>
      </View>

      <View style={styles.percentRow}>
        <View style={styles.percentLeft}>
          <Image source={require('../../../../assets/images/ui/baml.png')} style={styles.percentIcon} />
          <Text style={styles.percentNumber}>{bamPercent || 0}</Text>
          <Text style={styles.percentSymbol}>%</Text>
        </View>
        <Text style={styles.percentAmount}>{bamCommissionAmount}</Text>
      </View>

      <Text style={styles.sectionLabel}>monto a depositar cliente</Text>
      <View style={styles.accountRow}>
        <View style={styles.accountBox}>
          <Text style={styles.accountName}>{clientAccountName}</Text>
        </View>
        <Text style={styles.accountAmount}>{clientAmount}</Text>
      </View>

      <Text style={styles.sectionLabel}>monto a retirar mutual</Text>
      <View style={styles.accountRow}>
        <View style={styles.accountBox}>
          <Text style={styles.accountName}>{mutualAccountName}</Text>
        </View>
        <Text style={styles.accountAmount}>{mutualAmount}</Text>
      </View>

      <Text style={styles.sectionLabel}>monto a depositar Bamensa</Text>
      <View style={styles.accountRow}>
        <View style={styles.accountBox}>
          <Text style={styles.accountName}>Caja general</Text>
        </View>
        <Text style={styles.accountAmount}>{bamCommissionAmount}</Text>
      </View>

      <TextInput
        value={observation}
        onChangeText={onChangeObservation}
        placeholder="nota"
        placeholderTextColor="#B4AFC3"
        style={styles.obsInput}
      />

      <Text style={styles.infoText}>
        Operacion pendiente. Los movimientos se veran reflejados en la caja al momento de recibir aprobacion de la
        mutual.
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onClose} disabled={saving}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={onConfirm} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.confirmText}>Confirmar</Text>}
        </TouchableOpacity>
      </View>
    </AppDialog>
  );
}
