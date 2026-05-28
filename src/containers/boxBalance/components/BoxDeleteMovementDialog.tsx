import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import type { ReportItemOperation } from '../../accounts/services/accountItemsOperationService';
import styles from '../../accounts/components/DeleteMovementDialog.styles';

type Props = {
 visible: boolean;
 item: ReportItemOperation | null;
 onClose: () => void;
 onDelete: (item: ReportItemOperation) => Promise<void>;
};

export default function BoxDeleteMovementDialog({ visible, item, onClose, onDelete }: Props) {
 const [deleting, setDeleting] = useState(false);

 const valueText = useMemo(() => {
  const value = Number(item?.debit ?? 0) + Number(item?.credit ?? 0);
  return formatAmount1Decimal(value);
 }, [item?.credit, item?.debit]);

 const handleDelete = async () => {
  if (!item) return;
  setDeleting(true);
  try {
   await onDelete(item);
   onClose();
  } catch (e: any) {
   Alert.alert('Error', e?.message || 'No se pudo borrar el movimiento');
  } finally {
   setDeleting(false);
  }
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.card} onPress={() => {}}>
     <Text style={styles.title}>Movimiento</Text>

     <View style={styles.infoRow}>
      <Text style={styles.infoText}>{item?.operation_type || '-'}</Text>
      <Text style={styles.infoDash}>-</Text>
      <Text style={styles.infoText}>{valueText}</Text>
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
