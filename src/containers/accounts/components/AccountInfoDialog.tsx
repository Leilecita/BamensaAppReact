import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './AccountInfoDialog.styles';

export type AccountInfoForm = {
 name: string;
 surname: string;
 phone: string;
 category: string;
 cuit: string;
 address: string;
 observation: string;
 startDate: string;
};

type Props = {
 visible: boolean;
 info: AccountInfoForm;
 onClose: () => void;
 onSave?: (nextInfo: AccountInfoForm) => Promise<void>;
};

export default function AccountInfoDialog({ visible, info, onClose, onSave }: Props) {
 const [editing, setEditing] = useState(false);
 const [saving, setSaving] = useState(false);
 const [form, setForm] = useState<AccountInfoForm>(info);

 useEffect(() => {
  setForm(info);
  setEditing(false);
  setSaving(false);
 }, [info, visible]);

 const update = (key: keyof AccountInfoForm, value: string) => {
  setForm((prev) => ({ ...prev, [key]: value }));
 };

 const handleSave = async () => {
  if (!onSave) return;
  setSaving(true);
  try {
   await onSave(form);
   setEditing(false);
  } finally {
   setSaving(false);
  }
 };

 const handleDeletePress = () => {
  Alert.alert('Aviso', 'Pedir a administrador para poder borrar empleado');
 };

 const renderRow = ({
  label,
  value,
  field,
  editable = true,
 }: {
  label: string;
  value: string;
  field: keyof AccountInfoForm;
  editable?: boolean;
 }) => {
  return (
   <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{`${label} `}</Text>
    <View style={styles.infoDivider} />
    {editing && editable ? (
     <TextInput
      value={value}
      onChangeText={(text) => update(field, text)}
      style={styles.infoInput}
      placeholder=""
      placeholderTextColor="#a9a3bb"
     />
    ) : (
     <Text style={styles.infoValue}>{value}</Text>
    )}
   </View>
  );
 };

 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.infoBackdrop} onPress={onClose}>
    <Pressable style={styles.infoCard} onPress={() => {}}>
     <Text style={styles.infoTitle}>Información cuenta</Text>

     <View style={styles.infoTable}>
      {renderRow({ label: 'Nombre', value: form.name, field: 'name' })}
      {renderRow({ label: 'Apellido', value: form.surname, field: 'surname' })}
      {renderRow({ label: 'Telefono', value: form.phone, field: 'phone' })}
      {renderRow({ label: 'Categoria', value: form.category, field: 'category' })}
      {renderRow({ label: 'Cuit', value: form.cuit, field: 'cuit' })}
      {renderRow({ label: 'Dirección', value: form.address, field: 'address' })}
      {renderRow({ label: 'Observación', value: form.observation, field: 'observation' })}
      {renderRow({ label: 'Fecha inicio', value: form.startDate, field: 'startDate', editable: false })}
     </View>

     <View style={styles.infoActionsRow}>
      {editing ? (
       <>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setEditing(false)} disabled={saving}>
         <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={handleSave} disabled={saving} style={styles.saveBtn}>
         {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Guardar</Text>}
        </TouchableOpacity>
       </>
      ) : (
       <>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setEditing(true)}>
         <Image source={require('../../../../assets/images/ui/editsan.png')} style={styles.infoActionIcon} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} onPress={handleDeletePress}>
         <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.infoActionIcon} />
        </TouchableOpacity>
       </>
      )}
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}
