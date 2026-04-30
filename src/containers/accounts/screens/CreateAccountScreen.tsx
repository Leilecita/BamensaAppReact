import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppTopBar from '../../../core/components/AppTopBar';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { createAccount } from '../services/accountService';
import styles from './CreateAccountScreen.styles';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const CATEGORY_OPTIONS = [
  APP_CONSTANTS.CATEGORY_BASIC,
  APP_CONSTANTS.CATEGORY_BLACK,
  APP_CONSTANTS.CATEGORY_GOLD,
  APP_CONSTANTS.CATEGORY_PLATINUM,
];

const ACCOUNT_COLORS = ['#685c85', '#4f426b', '#A49FB8', '#817699', '#a197b8', '#9088a3', '#C6BCDA'];

type FieldRowProps = {
  icon: any;
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
  optionalStyle?: boolean;
};

function FieldRow({
  icon,
  label,
  required = false,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  optionalStyle = false,
}: FieldRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.iconWrap}>
        <Image source={icon} style={styles.icon} />
      </View>
      <View style={styles.labelWrap}>
        <Text style={[styles.label, optionalStyle ? styles.labelOptional : null]}>{label}</Text>
        {required ? <Text style={styles.asterisk}>*</Text> : null}
      </View>
      <View style={styles.divider} />
      <View style={styles.inputWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={optionalStyle ? '#bbbbbb' : '#807e7e'}
          style={styles.input}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
}

export default function CreateAccountScreen() {
  const navigation = useNavigation<Nav>();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [cuit, setCuit] = useState('');
  const [address, setAddress] = useState('');
  const [observation, setObservation] = useState('');
  const [saving, setSaving] = useState<'none' | 'save' | 'assign'>('none');

  const category = CATEGORY_OPTIONS[categoryIndex] ?? APP_CONSTANTS.CATEGORY_BASIC;

  const handleCycleCategory = () => {
    setCategoryIndex((prev) => (prev + 1) % CATEGORY_OPTIONS.length);
  };

  const isSaving = saving !== 'none';

  const handleSave = async (assignToOperation: boolean) => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Datos incompletos', 'Completá al menos Nombre y Teléfono.');
      return;
    }

    setSaving(assignToOperation ? 'assign' : 'save');
    try {
      const created = await createAccount({
        client_name: name.trim(),
        category: category.trim(),
        phone: phone.trim(),
        color: ACCOUNT_COLORS[Math.floor(Math.random() * ACCOUNT_COLORS.length)] ?? ACCOUNT_COLORS[0],
        client_surname: surname.trim(),
        address: address.trim(),
        cuit: cuit.trim(),
        observation: observation.trim(),
      });

      if (assignToOperation) {
        const fullName = `${created.client_name} ${created.client_surname}`.trim();
        navigation.navigate('home', {
          selectedAccount: {
            id: created.id,
            name: fullName || created.client_name,
          },
        });
        return;
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert('No se pudo crear la cuenta', e?.message || 'Error desconocido');
    } finally {
      setSaving('none');
    }
  };

  return (
    <View style={styles.screen}>
      <AppTopBar title="Nueva cuenta" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formInner}>
          <FieldRow
            icon={require('../../../../assets/images/ui/usuviol.png')}
            label="Nombre"
            required
            value={name}
            onChangeText={setName}
          />
          <FieldRow
            icon={require('../../../../assets/images/ui/usuviol.png')}
            label="Apellido"
            value={surname}
            onChangeText={setSurname}
          />
          <FieldRow
            icon={require('../../../../assets/images/ui/phonesan.png')}
            label="Teléfono"
            required
            value={phone}
            onChangeText={setPhone}
            placeholder="22464203304"
            keyboardType="number-pad"
          />

          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Image source={require('../../../../assets/images/ui/catename.png')} style={styles.icon} />
            </View>
            <View style={styles.labelWrap}>
              <Text style={styles.label}>Categoria</Text>
              <Text style={styles.asterisk}>*</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.inputWrap}>
              <TouchableOpacity style={styles.categoryBtn} onPress={handleCycleCategory} activeOpacity={0.8}>
                <Text style={styles.categoryText}>{category}</Text>
                <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.categoryArrow} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowSpaced}>
            <FieldRow
              icon={require('../../../../assets/images/ui/contactviolet.png')}
              label="Cuit"
              value={cuit}
              onChangeText={setCuit}
              optionalStyle
              keyboardType="number-pad"
            />
          </View>

          <FieldRow
            icon={require('../../../../assets/images/ui/casa.png')}
            label="Dirección"
            value={address}
            onChangeText={setAddress}
            optionalStyle
          />

          <FieldRow
            icon={require('../../../../assets/images/ui/documento.png')}
            label="Observación"
            value={observation}
            onChangeText={setObservation}
            optionalStyle
          />

          <Text style={styles.requiredText}>(*) Campos obligatorios</Text>
        </View>
      </ScrollView>

      <View style={styles.actionColumn}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed ? styles.actionBtnPressed : null]}
          disabled={isSaving}
          onPress={() => handleSave(false)}
        >
          <Image source={require('../../../../assets/images/ui/saveviol.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>{saving === 'save' ? 'Guardando...' : 'Guardar'}</Text>
          {saving === 'save' ? <ActivityIndicator size="small" color="#ffffff" style={styles.actionLoader} /> : null}
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.actionBtn, styles.actionBtnAssign, pressed ? styles.actionBtnPressed : null]}
          disabled={isSaving}
          onPress={() => handleSave(true)}
        >
          <Image source={require('../../../../assets/images/ui/saveviol.png')} style={styles.actionIcon} />
          <Text style={styles.actionText}>
            {saving === 'assign' ? 'Guardando...' : 'Guardar y asignar a operación'}
          </Text>
          {saving === 'assign' ? <ActivityIndicator size="small" color="#ffffff" style={styles.actionLoader} /> : null}
        </Pressable>
      </View>
    </View>
  );
}
