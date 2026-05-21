import React, { useMemo, useState } from 'react';
import {
 ActivityIndicator,
 Alert,
 Keyboard,
 KeyboardAvoidingView,
 Platform,
 ScrollView,
 StyleSheet,
 Text,
 TouchableOpacity,
 TouchableWithoutFeedback,
 View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import axiosClient from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';
import { getAppVariant } from '../../../core/theme/appVariant';
import { AuthStackParamList } from '../../../core/navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'register'>;

const getAppTitle = (): string => {
 const variant = getAppVariant();
 if (variant === 'fisherton') return APP_CONSTANTS.NAME_FISHERTON;
 if (variant === 'mendoza') return APP_CONSTANTS.NAME_MENDOZA;
 return APP_CONSTANTS.NAME_BAMENSA;
};

export default function RegisterScreen({ navigation }: Props) {
 const { top } = useSafeAreaInsets();
 const appTitle = useMemo(() => getAppTitle(), []);

 const [keyAccess, setKeyAccess] = useState('');
 const [email, setEmail] = useState('');
 const [name, setName] = useState('');
 const [phone, setPhone] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [errorMsg, setErrorMsg] = useState('');

 const inputTheme = useMemo(
  () => ({
   colors: {
    primary: COLORS.colorPrimaryChange,
    outline: COLORS.colorPrimaryClear2,
    onSurfaceVariant: COLORS.word_clear,
    background: COLORS.background,
   },
  }),
  [],
 );

 const handleRegister = async () => {
  const trimmedKey = keyAccess.trim();
  const trimmedEmail = email.trim();
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const trimmedPassword = password.trim();

  if (!trimmedKey) {
   setErrorMsg('LLave de ingreso incorrecta');
   return;
  }

  if (!trimmedEmail) {
   setErrorMsg('Completar email');
   return;
  }

  if (!trimmedName) {
   setErrorMsg('Completar nombre');
   return;
  }

  if (!trimmedPhone) {
   setErrorMsg('Completar telefono');
   return;
  }

  if (!trimmedPassword) {
   setErrorMsg('Completar contraseña');
   return;
  }

  if (trimmedPassword.length <= 4) {
   setErrorMsg('La contraseña debe tener al menos 5 caracteres');
   return;
  }

  setLoading(true);
  setErrorMsg('');

  try {
   await axiosClient.post(
    '/login.php',
    {
     name: trimmedName,
     hash_password: trimmedPassword,
     mail: trimmedEmail,
     phone: trimmedPhone,
     token: '',
    },
    {
     params: {
      key_access: trimmedKey,
      method: 'register',
     },
    },
   );

   Alert.alert('Listo', 'El usuario ha sido registrado', [
    {
     text: 'Aceptar',
     onPress: () => navigation.goBack(),
    },
   ]);
  } catch (error: unknown) {
   if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage =
     error.response?.data?.message ||
     error.response?.data?.error ||
     (typeof error.response?.data === 'string' ? error.response.data : '');

    setErrorMsg(
     serverMessage ||
      (status === 500
       ? 'Error interno del servidor al registrar'
       : status
        ? `Error ${status} al registrar`
        : 'Error de conexión'),
    );
   } else {
    setErrorMsg('No se pudo registrar el usuario');
   }
  } finally {
   setLoading(false);
  }
 };

 return (
  <View style={styles.screen}>
   <View style={[styles.toolbar, { paddingTop: top, minHeight: top + 60 }]}>
    <TouchableOpacity
     style={styles.backButton}
     activeOpacity={0.8}
     onPress={() => navigation.goBack()}
     hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
    >
     <Text style={styles.backText}>←</Text>
    </TouchableOpacity>
    <Text style={styles.toolbarTitle}>{appTitle}</Text>
   </View>

   {loading ? (
    <View style={styles.progressWrap}>
     <ActivityIndicator size="large" color={COLORS.colorDialogButton} />
    </View>
   ) : null}

   <KeyboardAvoidingView
    style={styles.flex}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
   >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <ScrollView
      style={styles.formScroll}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
     >
      <TextInput
       label="Llave de ingreso"
       value={keyAccess}
       onChangeText={setKeyAccess}
       mode="outlined"
       style={styles.input}
       autoCapitalize="none"
       autoCorrect={false}
       editable={!loading}
       theme={inputTheme}
      />

      <TextInput
       label="Email"
       value={email}
       onChangeText={setEmail}
       mode="outlined"
       style={styles.input}
       autoCapitalize="none"
       autoCorrect={false}
       editable={!loading}
       keyboardType="email-address"
       theme={inputTheme}
      />

      <TextInput
       label="Nombre"
       value={name}
       onChangeText={setName}
       mode="outlined"
       style={styles.input}
       autoCapitalize="none"
       autoCorrect={false}
       editable={!loading}
       theme={inputTheme}
      />

      <TextInput
       label="Telefono"
       value={phone}
       onChangeText={setPhone}
       mode="outlined"
       style={styles.input}
       autoCapitalize="none"
       autoCorrect={false}
       editable={!loading}
       keyboardType="phone-pad"
       theme={inputTheme}
      />

      <TextInput
       label="Password"
       value={password}
       onChangeText={setPassword}
       secureTextEntry
       mode="outlined"
       style={styles.input}
       editable={!loading}
       theme={inputTheme}
      />

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <TouchableOpacity
       style={[styles.registerButton, loading ? styles.registerButtonDisabled : null]}
       activeOpacity={0.85}
       disabled={loading}
       onPress={handleRegister}
      >
       <Text style={styles.registerButtonText}>Registrarse</Text>
      </TouchableOpacity>
     </ScrollView>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  </View>
 );
}

const styles = StyleSheet.create({
 screen: {
  flex: 1,
  backgroundColor: COLORS.background,
 },
 flex: {
  flex: 1,
 },
 toolbar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.colorPrimaryChange,
  paddingHorizontal: 18,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
 },
 backButton: {
  width: 36,
  height: 36,
  alignItems: 'flex-start',
  justifyContent: 'center',
  marginRight: 8,
 },
 backText: {
  color: COLORS.white,
  fontSize: 28,
  fontFamily: 'OpenSansRegular',
 },
 toolbarTitle: {
  color: COLORS.white,
  fontSize: DIMENS.titleText,
  fontFamily: 'OpenSansRegular',
 },
 progressWrap: {
  paddingTop: 8,
  paddingBottom: 8,
  alignItems: 'center',
  justifyContent: 'center',
 },
 formScroll: {
  flex: 1,
 },
 formContent: {
  paddingLeft: DIMENS.activityHorizontalMargin,
  paddingRight: DIMENS.activityHorizontalMargin,
  paddingTop: DIMENS.activityVerticalMargin,
  paddingBottom: DIMENS.activityVerticalMargin,
 },
 input: {
  marginBottom: 10,
  backgroundColor: COLORS.background,
 },
 errorText: {
  marginTop: 2,
  color: COLORS.red,
  fontSize: DIMENS.valueText,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 registerButton: {
  minHeight: DIMENS.heightButton,
  marginTop: 16,
  borderRadius: 8,
  backgroundColor: COLORS.colorDialogButton,
  alignItems: 'center',
  justifyContent: 'center',
 },
 registerButtonDisabled: {
  opacity: 0.72,
 },
 registerButtonText: {
  color: COLORS.white,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
});
