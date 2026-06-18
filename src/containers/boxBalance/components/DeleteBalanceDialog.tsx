import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { dateHelper } from '../../../helpers/dateHelper';
import { valuesHelper } from '../../../helpers/valuesHelper';
import type { ReportBalance } from '../services/boxBalanceService';
import styles from '../../operations/components/DeleteOperationDialog.styles';

type Props = {
 visible: boolean;
 balance: ReportBalance | null;
 onClose: () => void;
 onDelete: (balance: ReportBalance) => Promise<void>;
};

export default function DeleteBalanceDialog({ visible, balance, onClose, onDelete }: Props) {
 const [deleting, setDeleting] = useState(false);

 const dateLabel = useMemo(() => {
  if (!balance?.created) return '-';
  const day = dateHelper.getNameDay(balance.created);
  const dayMonth = dateHelper.getDayMonth(balance.created);
  const year = dateHelper.getYear(balance.created);
  return `${day} ${dayMonth} ${year}`;
 }, [balance?.created]);

 const valueLabel = useMemo(() => valuesHelper.getBigNumb(Number(balance?.gain ?? 0)), [balance?.gain]);

 const handleDelete = async () => {
  if (!balance) return;
  setDeleting(true);
  try {
   await onDelete(balance);
   onClose();
  } catch (e: any) {
   Alert.alert('Error', e?.message || 'No se pudo eliminar el balance');
  } finally {
   setDeleting(false);
  }
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.card} onPress={() => {}}>
     <Text style={styles.title}>Balance</Text>

     <View style={styles.infoRow}>
      <Text style={styles.infoText}>{dateLabel}</Text>
      <Text style={styles.infoDash}>-</Text>
      <Text style={styles.infoText}>USD</Text>
      <Text style={styles.infoDash}>-</Text>
      <Text style={styles.infoText}>{valueLabel}</Text>
     </View>

     <View style={styles.actions}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8} disabled={deleting}>
       <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete} activeOpacity={0.8} disabled={deleting}>
       {deleting ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.deleteText}>Borrar</Text>}
      </TouchableOpacity>
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}
