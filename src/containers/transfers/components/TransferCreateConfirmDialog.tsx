import React from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import styles from './TransferCreateConfirmDialog.styles';

type Props = {
  visible: boolean;
  saving: boolean;
  observation: string;
  dateText: string;
  userName: string;
  onChangeObservation: (value: string) => void;
  onCopy: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export default function TransferCreateConfirmDialog({
  visible,
  saving,
  observation,
  dateText,
  userName,
  onChangeObservation,
  onCopy,
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
      <Text style={styles.title}>TRANSFERENCIA</Text>

      <View style={styles.observationRow}>
        <TextInput
          value={observation}
          onChangeText={onChangeObservation}
          placeholder=""
          placeholderTextColor="#B4AFC3"
          style={styles.observationInput}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
        <TouchableOpacity style={styles.copyBtn} activeOpacity={0.85} onPress={onCopy}>
          <Image source={require('../../../../assets/images/ui/copy.png')} style={styles.copyIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.infoIcon} />
        <Text style={styles.infoText}>{dateText}</Text>
      </View>

      <View style={styles.infoRow}>
        <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.infoIcon} />
        <Text style={styles.infoText}>{userName}</Text>
      </View>

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
