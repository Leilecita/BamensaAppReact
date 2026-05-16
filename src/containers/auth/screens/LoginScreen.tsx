import React, { useContext, useMemo, useState } from 'react';
import {
 ActivityIndicator,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import axiosClient from '../../../core/services/axiosClient';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';
import { getAppVariant } from '../../../core/theme/appVariant';
import { AuthContext } from '../../../contexts/AuthContext';

const getAppTitle = (): string => {
 const variant = getAppVariant();
 if (variant === 'fisherton') return APP_CONSTANTS.NAME_FISHERTON;
 if (variant === 'mendoza') return APP_CONSTANTS.NAME_MENDOZA;
 return APP_CONSTANTS.NAME_BAMENSA;
};

export default function LoginScreen() {
 const { top } = useSafeAreaInsets();
 const { signIn } = useContext(AuthContext);
 const appTitle = useMemo(() => getAppTitle(), []);

 const [username, setUsername] = useState('');
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

 const handleLogin = async () => {
  if (!username.trim() || !password.trim()) {
   setErrorMsg('Completar usuario y contraseña');
   return;
  }

  setLoading(true);
  setErrorMsg('');

  try {
   const response = await axiosClient.get('/login.php', {
    params: {
     name: username.trim(),
     hash_password: password.trim(),
     method: 'login',
    },
   });

   const token = response.data?.token ?? response.data?.data?.token;
   const name = response.data?.name ?? response.data?.data?.name ?? username.trim();
   const id = Number(response.data?.id ?? response.data?.data?.id ?? 0);
   const role = response.data?.level ?? response.data?.data?.level ?? '';

   if (!token) {
    setErrorMsg(response.data?.message || 'Usuario o contraseña incorrectos');
    return;
   }

   await signIn(token, name, id, role);
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
       ? 'Error interno del servidor al iniciar sesión'
       : status
        ? `Error ${status} al iniciar sesión`
        : 'Error de conexión'),
    );
   } else {
    setErrorMsg('Error inesperado al iniciar sesión');
   }
  } finally {
   setLoading(false);
  }
 };

 return (
  <View style={styles.screen}>
   <View style={[styles.toolbar, { paddingTop: top }]}>
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
       label="Name"
       value={username}
       onChangeText={setUsername}
       mode="outlined"
       style={styles.input}
       autoCapitalize="none"
       autoCorrect={false}
       editable={!loading}
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
       style={[styles.loginButton, loading ? styles.loginButtonDisabled : null]}
       activeOpacity={0.85}
       disabled={loading}
       onPress={handleLogin}
      >
       <Text style={styles.loginButtonText}>Iniciar sesion</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Si no estas registrado, haz click aqui</Text>
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
  minHeight: 56,
  justifyContent: 'center',
  backgroundColor: COLORS.colorPrimaryChange,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
 },
 toolbarTitle: {
  marginLeft: 8,
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
 loginButton: {
  minHeight: DIMENS.heightButton,
  marginTop: 16,
  borderRadius: 8,
  backgroundColor: COLORS.colorDialogButton,
  alignItems: 'center',
  justifyContent: 'center',
 },
 loginButtonDisabled: {
  opacity: 0.72,
 },
 loginButtonText: {
  color: COLORS.white,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 registerText: {
  marginTop: 40,
  color: COLORS.colorPrimaryDarkChange,
  fontSize: 16,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
});
