import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import AppDatePicker from '../../../core/components/AppDatePicker';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import api from '../../../core/services/axiosClient';
import { dateHelper } from '../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import { ReportItemOperation } from '../services/accountItemsOperationService';
import { shouldApplyFishertonMirrorRule } from '../services/accountMovementService';
import styles from './EditMovementDialog.styles';

type Props = {
 visible: boolean;
 accountId: number;
 item: ReportItemOperation | null;
 onClose: () => void;
 onSave: (payload: { id: number; state: string; debit: number; credit: number; created: string; coinId: number }) => Promise<void>;
};

const toDate = (value?: string): Date => {
 if (!value) return new Date();
 const direct = new Date(value);
 if (!Number.isNaN(direct.getTime())) return direct;
 const normalized = new Date(String(value).replace(' ', 'T'));
 if (!Number.isNaN(normalized.getTime())) return normalized;
 return new Date();
};

export default function EditMovementDialog({ visible, accountId, item, onClose, onSave }: Props) {
 const [amount, setAmount] = useState('');
 const [created, setCreated] = useState('');
 const [datePickerVisible, setDatePickerVisible] = useState(false);
 const [saving, setSaving] = useState(false);

 const isRetiro = item?.operation_type === APP_CONSTANTS.TYPE_RETIRO;
 const coinShortName = useMemo(() => String(item?.coin ?? '').toUpperCase() || 'ARS', [item?.coin]);

 const isFishertonSpecial = useMemo(() => {
  return shouldApplyFishertonMirrorRule(api.defaults.baseURL, accountId);
 }, [accountId]);

 React.useEffect(() => {
  if (!visible || !item) return;
  setAmount(String((item.debit || 0) + (item.credit || 0)));
  setCreated(String(item.created || dateHelper.getActualDate()));
 }, [visible, item]);

 const handleSave = async () => {
  if (!item) return;
  const valueT = Number(amount.trim().replace(',', '.'));
  if (!Number.isFinite(valueT) || valueT < 0) {
   Alert.alert('Dato inválido', 'Ingresá un monto válido.');
   return;
  }

  setSaving(true);
  try {
   await onSave({
    id: item.id,
    state: item.state,
    debit: isRetiro ? valueT : 0,
    credit: isRetiro ? 0 : valueT,
    created: created.trim(),
    coinId: item.coin_id,
   });
   onClose();
  } catch (e: any) {
   Alert.alert('Error al editar', e?.message || 'No se pudo editar el movimiento.');
  } finally {
   setSaving(false);
  }
 };

 return (
  <AppDialog
   visible={visible}
   onClose={onClose}
   keyboardAware
   keyboardGap={14}
   backdropStyle={styles.backdrop}
   cardStyle={styles.card}
  >
   <Text style={styles.title}>Editar {item?.operation_type || ''}</Text>

   {isFishertonSpecial ? <Text style={styles.onlyFishertonNote}>Solo Fisherton</Text> : null}

   <View style={styles.fieldsWrap}>
    <View style={styles.bigRow}>
     <View style={styles.coinInline}>
      <Image source={getFilterFlagSourceByShortName(coinShortName)} style={styles.coinFlag} />
      <Text style={styles.coinText}>{coinShortName}</Text>
     </View>
     <View style={styles.dottedDivider} />
     <Text style={styles.plusText}>{isRetiro ? '-' : '+'}</Text>
     <TextInput
      value={amount}
      onChangeText={setAmount}
      keyboardType="decimal-pad"
      style={styles.amountInput}
      placeholder=""
      placeholderTextColor="#9892a8"
     />
    </View>

    <TouchableOpacity activeOpacity={0.8} style={styles.fieldRow} onPress={() => setDatePickerVisible(true)}>
     <Text style={styles.fieldLabel}>Fecha</Text>
     <View style={styles.dottedDivider} />
     <View style={styles.fieldValueWrap}>
      <Text style={styles.fieldValueText}>{dateHelper.onlyDate(dateHelper.changeFormatDate(created))}</Text>
     </View>
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

   <AppDatePicker
    visible={datePickerVisible}
    value={toDate(created)}
    onCancel={() => setDatePickerVisible(false)}
    onConfirm={(nextDate) => {
     const time = dateHelper.getOnlyTime(dateHelper.getActualDate()) || '00:00:00';
     const yyyy = nextDate.getFullYear();
     const month = String(nextDate.getMonth() + 1).padStart(2, '0');
     const day = String(nextDate.getDate()).padStart(2, '0');
     setCreated(`${yyyy}-${month}-${day} ${time}`);
     setDatePickerVisible(false);
    }}
   />
  </AppDialog>
 );
}
