import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import type { ReportTransfer } from '../services/transferService';
import styles from './TransferDeleteOperationDialog.styles';

type Props = {
  visible: boolean;
  item: ReportTransfer | null;
  onClose: () => void;
  onConfirm: (item: ReportTransfer) => Promise<void>;
};

const parseTransferType = (value?: string) => {
  const text = String(value ?? '').trim();
  if (!text) return 'Transferencia';
  const [firstPart] = text.split('-');
  return firstPart ? `Transferencia ${firstPart}` : 'Transferencia';
};

const parseTransferObservation = (value?: string) => {
  const text = String(value ?? '').trim();
  if (!text) return '-';
  const [, ...rest] = text.split('-');
  return rest.join('-').trim() || text;
};

export default function TransferDeleteOperationDialog({ visible, item, onClose, onConfirm }: Props) {
  const [deleting, setDeleting] = useState(false);
  const typeLabel = useMemo(() => parseTransferType(item?.observation), [item?.observation]);
  const observationText = useMemo(() => parseTransferObservation(item?.observation), [item?.observation]);

  const handleConfirm = async () => {
    if (!item) return;
    setDeleting(true);
    try {
      await onConfirm(item);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AppDialog visible={visible} onClose={onClose} backdropStyle={styles.backdrop} cardStyle={styles.card}>
      <Text style={styles.title}>ELIMINAR OPERACION</Text>
      <Text style={styles.typeText}>{typeLabel}</Text>
      <Text style={styles.observationText}>{observationText}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onClose} disabled={deleting}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={handleConfirm} disabled={deleting}>
          {deleting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.deleteText}>Borrar</Text>}
        </TouchableOpacity>
      </View>
    </AppDialog>
  );
}
