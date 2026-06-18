import React, { useMemo } from 'react';
import { Clipboard, Image, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import { useToast } from '../../../core/feedback/ToastContext';
import type { ReportTransfer } from '../services/transferService';
import styles from './TransferInfoDialog.styles';

type Props = {
  visible: boolean;
  item: ReportTransfer | null;
  onClose: () => void;
  onPressDelete?: () => void;
};

const parseTransferObservation = (value?: string) => {
  const text = String(value ?? '').trim();
  if (!text) {
    return { type: 'TRANSFERENCIA', observation: '-' };
  }

  const [firstPart, ...rest] = text.split('-');
  const transferType = firstPart ? `TRANSFERENCIA ${String(firstPart).toUpperCase()}` : 'TRANSFERENCIA';
  const observation = rest.join('-').trim() || text;

  return {
    type: transferType,
    observation,
  };
};

export default function TransferInfoDialog({ visible, item, onClose, onPressDelete }: Props) {
  const parsed = useMemo(() => parseTransferObservation(item?.observation), [item?.observation]);
  const { showToast } = useToast();
  const copyText = parsed.observation === '-' ? '' : parsed.observation;

  const handleCopy = () => {
    if (!copyText) return;
    Clipboard.setString(copyText);

    if (Platform.OS === 'android') {
      ToastAndroid.show('El texto ha sido copiado', ToastAndroid.SHORT);
      return;
    }

    showToast('El texto ha sido copiado');
  };

  return (
    <AppDialog visible={visible} onClose={onClose} backdropStyle={styles.backdrop} cardStyle={styles.card}>
      <Text style={styles.title}>{parsed.type}</Text>

      <View style={styles.observationRow}>
        <View style={styles.observationTextWrap}>
          <Text style={styles.observationText}>{parsed.observation}</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn} activeOpacity={0.85} onPress={handleCopy}>
          <Image source={require('../../../../assets/images/ui/copy.png')} style={styles.copyIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconWrap}>
          <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.infoIcon} />
        </View>
        <Text style={styles.infoText}>{item?.operation_created || '-'}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIconWrap}>
          <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.infoIcon} />
        </View>
        <Text style={styles.infoText}>{item?.user_name || '-'}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={onPressDelete}>
          <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </AppDialog>
  );
}
