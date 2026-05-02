import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDatePicker from '../../../core/components/AppDatePicker';
import { dateHelper } from '../../../helpers/dateHelper';
import { getFlagSourceByShortName } from '../../../helpers/flagHelper';
import { Coin } from '../../coins/services/coinService';
import styles from './AddOutcomeDialog.styles';

type Props = {
 visible: boolean;
 coins: Coin[];
 title?: string;
 initialData?: {
  coinShortName?: string;
  amount?: number;
  description?: string;
  created?: string;
 };
 onClose: () => void;
 onSave: (params: {
  coinShortName: string;
  amount: number;
  description: string;
  created: string;
 }) => Promise<void> | void;
};

export default function AddOutcomeDialog({
 visible,
 coins,
 title = 'Gasto',
 initialData,
 onClose,
 onSave,
}: Props) {
 const [coinListVisible, setCoinListVisible] = useState(false);
 const [selectedCoin, setSelectedCoin] = useState('ARS');
 const [amount, setAmount] = useState('');
 const [description, setDescription] = useState('');
 const [created, setCreated] = useState(() => dateHelper.getActualDate(new Date()));
 const [datePickerVisible, setDatePickerVisible] = useState(false);

 useEffect(() => {
  if (!visible) return;
  const initialCreated = initialData?.created?.trim();
  setCreated(initialCreated || dateHelper.getActualDate(new Date()));
  const ars = coins.find((coin) => coin.short_name === 'ARS');
  setSelectedCoin(initialData?.coinShortName || ars?.short_name || coins[0]?.short_name || '');
  setAmount(initialData?.amount !== undefined ? String(initialData.amount) : '');
  setDescription(initialData?.description || '');
  setCoinListVisible(false);
 }, [coins, initialData, visible]);

 const viewDate = useMemo(() => dateHelper.formatOnlyDate(created), [created]);

 const save = async () => {
  if (!selectedCoin) {
   Alert.alert('Moneda inválida', 'No hay moneda seleccionada para guardar el gasto.');
   return;
  }
  const normalized = amount.trim().replace(',', '.');
  const parsed = Number(normalized || '0');
  await onSave({
   coinShortName: selectedCoin,
   amount: Number.isFinite(parsed) ? parsed : 0,
   description: description.trim(),
   created,
  });
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={styles.card} onPress={() => {}}>
     <Text style={styles.title}>{title}</Text>

     <View style={styles.fieldsWrap}>
      <View style={styles.amountRow}>
       <View style={styles.coinSide}>
        <TouchableOpacity style={styles.coinTrigger} activeOpacity={0.8} onPress={() => setCoinListVisible((v) => !v)}>
         <View style={styles.coinInline}>
          <Image source={getFlagSourceByShortName(selectedCoin)} style={styles.coinFlag} />
          <Text style={styles.coinText}>{selectedCoin}</Text>
         </View>
        </TouchableOpacity>
        {coinListVisible ? (
         <View style={styles.coinListCard}>
          <ScrollView nestedScrollEnabled>
           {coins.map((coin) => (
            <TouchableOpacity
             key={coin.id}
             style={styles.coinListRow}
             onPress={() => {
               setSelectedCoin(coin.short_name);
               setCoinListVisible(false);
             }}
             activeOpacity={0.8}
            >
             <Image
              source={getFlagSourceByShortName(coin.short_name)}
              style={styles.coinListFlag}
             />
             <Text style={styles.coinListText}>{coin.short_name}</Text>
            </TouchableOpacity>
           ))}
          </ScrollView>
         </View>
        ) : null}
       </View>

       <View style={styles.divider} />

       <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder=""
        keyboardType="decimal-pad"
        style={styles.amountInput}
       />
      </View>

      <View style={styles.row}>
       <Text style={styles.label}>Descripcion</Text>
       <View style={styles.divider} />
       <View style={styles.valueSide}>
        <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="" />
       </View>
      </View>

      <View style={styles.row}>
       <Text style={styles.label}>Fecha</Text>
       <View style={styles.divider} />
       <View style={styles.valueSide}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setDatePickerVisible(true)}>
         <Text style={styles.dateText}>{viewDate}</Text>
        </TouchableOpacity>
       </View>
      </View>
     </View>

     <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
       <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveBtn} onPress={save} activeOpacity={0.8}>
       <Text style={styles.saveText}>Guardar</Text>
      </TouchableOpacity>
     </View>
    </Pressable>
   </Pressable>
   <AppDatePicker
    visible={datePickerVisible}
    value={new Date(created.replace(' ', 'T'))}
    onCancel={() => setDatePickerVisible(false)}
    onConfirm={(selectedDate) => {
      const hhmmss = dateHelper.getActualDate(new Date()).split(' ')[1] ?? '00:00:00';
      const yyyy = String(selectedDate.getFullYear());
      const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const dd = String(selectedDate.getDate()).padStart(2, '0');
      setCreated(`${yyyy}-${mm}-${dd} ${hhmmss}`);
      setDatePickerVisible(false);
    }}
   />
  </Modal>
 );
}
