import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { ReportOperation } from '../services/operationService';
import styles from './DeleteOperationDialog.styles';

type Props = {
 visible: boolean;
 operation: ReportOperation | null;
 onClose: () => void;
 onDelete: (operation: ReportOperation) => Promise<void>;
};

export default function DeleteOperationDialog({ visible, operation, onClose, onDelete }: Props) {
 const [deleting, setDeleting] = useState(false);

 const isCompra = String(operation?.type || '').toLowerCase() === APP_CONSTANTS.TYPE_COMPRA;
 const coin = isCompra ? operation?.item_in?.coin : operation?.item_out?.coin;
 const value = isCompra ? Number(operation?.item_in?.credit ?? 0) : Number(operation?.item_out?.debit ?? 0);

 const affectsClient = useMemo(() => {
  const note = String(operation?.nota ?? '');
  return note.includes(APP_CONSTANTS.AFFECT_ACI) || note.includes(APP_CONSTANTS.AFFECT_ACO);
 }, [operation?.nota]);

 const handleDelete = async () => {
  if (!operation) return;
  setDeleting(true);
  try {
   await onDelete(operation);
   onClose();
  } finally {
   setDeleting(false);
  }
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.card} onPress={() => {}}>
     <Text style={styles.title}>Operación</Text>

     <View style={styles.infoRow}>
      <Text style={styles.infoText}>{operation?.type || '-'}</Text>
      <Text style={styles.infoDash}>-</Text>
      <Text style={styles.infoText}>{coin || '-'}</Text>
      <Text style={styles.infoDash}>-</Text>
      <Text style={styles.infoText}>{value.toFixed(1)}</Text>
     </View>

     {affectsClient ? (
      <Text style={styles.affectText}>
       La operación afecta al cliente en sus movimientos, estos también serán eliminados de su cuenta.
      </Text>
     ) : null}

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
