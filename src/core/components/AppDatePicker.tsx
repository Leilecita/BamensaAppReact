import React, { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { COLORS } from '../constants/colors';
import { DIMENS } from '../constants/dimensions';

type Props = {
 visible: boolean;
 value: Date;
 onCancel: () => void;
 onConfirm: (date: Date) => void;
};

export default function AppDatePicker({ visible, value, onCancel, onConfirm }: Props) {
 const [draftDate, setDraftDate] = useState<Date>(value);

 const safeDate = useMemo(() => (Number.isNaN(value.getTime()) ? new Date() : value), [value]);

 React.useEffect(() => {
  if (visible) setDraftDate(safeDate);
 }, [safeDate, visible]);

 const onChangeAndroid = (event: DateTimePickerEvent, selectedDate?: Date) => {
  if (event.type === 'dismissed') {
   onCancel();
   return;
  }
  if (selectedDate) onConfirm(selectedDate);
 };

 if (!visible) return null;

 if (Platform.OS === 'android') {
  return (
   <DateTimePicker
    value={safeDate}
    mode="date"
    display="default"
    onChange={onChangeAndroid}
   />
  );
 }

 return (
  <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
   <Pressable
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    }}
    onPress={onCancel}
   >
    <Pressable
     style={{
      width: '100%',
      maxWidth: 420,
      borderRadius: 14,
      backgroundColor: COLORS.background_dialog,
      paddingTop: 12,
      paddingHorizontal: 12,
      paddingBottom: 10,
    }}
     onPress={() => {}}
    >
     <DateTimePicker
      value={draftDate}
      mode="date"
      display="spinner"
      onChange={(_, selectedDate) => {
        if (selectedDate) setDraftDate(selectedDate);
      }}
     />
     <View style={{ flexDirection: 'row', marginTop: 8 }}>
      <TouchableOpacity
       style={{ flex: 1, minHeight: DIMENS.heightButton, justifyContent: 'center', alignItems: 'center' }}
       onPress={onCancel}
      >
       <Text style={{ color: COLORS.colorDialogButton, fontSize: DIMENS.generalText, fontFamily: 'OpenSansRegular' }}>
        Cancelar
       </Text>
      </TouchableOpacity>
      <TouchableOpacity
       style={{
        flex: 1,
        minHeight: DIMENS.heightButton,
        borderRadius: 8,
        backgroundColor: COLORS.colorDialogButton,
        justifyContent: 'center',
        alignItems: 'center',
       }}
       onPress={() => onConfirm(draftDate)}
      >
       <Text style={{ color: COLORS.white, fontSize: DIMENS.generalText, fontFamily: 'OpenSansRegular' }}>
        Guardar
       </Text>
      </TouchableOpacity>
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}

