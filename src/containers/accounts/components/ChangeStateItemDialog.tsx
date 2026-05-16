import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { dateHelper } from '../../../helpers/dateHelper';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import { ReportItemOperation } from '../services/accountItemsOperationService';
import styles from './ChangeStateItemDialog.styles';

type Props = {
 visible: boolean;
 item: ReportItemOperation | null;
 onClose: () => void;
 onSave: (payload: { id: number; state: string }) => Promise<void>;
};

const capitalizeWord = (text?: string) => {
 const value = String(text ?? '').trim();
 if (!value) return '-';
 return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function ChangeStateItemDialog({ visible, item, onClose, onSave }: Props) {
 const [state, setState] = useState<string>(item?.state ?? APP_CONSTANTS.STATE_DONE);
 const [saving, setSaving] = useState(false);

 React.useEffect(() => {
  if (!visible || !item) return;
  setState(item.state ?? APP_CONSTANTS.STATE_DONE);
 }, [visible, item]);

 const isPending = state === APP_CONSTANTS.STATE_PENDIENT;
 const amountText = useMemo(() => {
  if (!item) return '-';
  if (item.credit > 0) return `+${formatAmount1Decimal(item.credit)}`;
  return `-${formatAmount1Decimal(item.debit)}`;
 }, [item]);
 const amountStyle = item?.credit && item.credit > 0 ? styles.amountPlus : styles.amountMinus;

 const handleSave = async () => {
  if (!item) return;
  setSaving(true);
  try {
   await onSave({ id: item.id, state });
   onClose();
  } catch (e: any) {
   Alert.alert('Error', e?.message || 'No se pudo cambiar el estado');
  } finally {
   setSaving(false);
  }
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.card} onPress={() => {}}>
     <View style={styles.dateChipWrap}>
      <Text style={styles.dateChip}>{dateHelper.onlyDayMonth(item?.created)}</Text>
     </View>

     <View style={styles.mainRow}>
      <Text style={styles.type}>{capitalizeWord(item?.operation_type)}</Text>
      <View style={styles.amountRow}>
       <Image
        source={require('../../../../assets/images/ui/pendsan.png')}
        style={[styles.pendingIcon, !isPending ? styles.pendingIconHidden : null]}
       />
       <Text style={[styles.amount, amountStyle]}>{amountText}</Text>
      </View>
     </View>

     <Text style={styles.accountName}>{item?.client_name_account || '-'}</Text>

     <View style={styles.changeRow}>
      <Text style={styles.changeText}>cambiar estado</Text>
      <Image source={require('../../../../assets/images/ui/righhh.png')} style={styles.arrowIcon} />
      <TouchableOpacity
       style={styles.stateButton}
       activeOpacity={0.8}
       onPress={() =>
        setState((prev) => (prev === APP_CONSTANTS.STATE_PENDIENT ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT))
       }
      >
       <Image
        source={
         isPending
          ? require('../../../../assets/images/ui/pendsan.png')
          : require('../../../../assets/images/ui/donesan.png')
        }
        style={styles.stateIcon}
       />
      </TouchableOpacity>
     </View>

     <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8} disabled={saving}>
       <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
       {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Guardar</Text>}
      </TouchableOpacity>
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}
