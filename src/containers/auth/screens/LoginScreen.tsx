import React, { useState, useContext } from 'react';
import {
 StyleSheet,
 Text,
 View,
 TouchableOpacity,
 KeyboardAvoidingView,
 TouchableWithoutFeedback,
 Keyboard,
 Platform,
 ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axiosClient from '../../../core/services/axiosClient';
import { AuthContext } from '../../../contexts/AuthContext';

export default function LoginScreen() {
 const { top } = useSafeAreaInsets();
 const { signIn } = useContext(AuthContext);

 const [username, setUsername] = useState('');
 const [password, setPassword] = useState('');
 const [errorMsg, setErrorMsg] = useState('');

 const handleLogin = async () => {
  if (!username || !password) {
   setErrorMsg('Completar usuario y contraseña');
   return;
  }

 try {
   const response = await axiosClient.get('/login.php', {
    params: {
     name: username.trim(),
     hash_password: password.trim(),
     method: 'login',
    },
   });

   console.log('LOGIN RESPONSE:', response.data);

   const token = response.data?.token ?? response.data?.data?.token;
   const name = response.data?.name ?? response.data?.data?.name ?? username.trim();
   const id = Number(response.data?.id ?? response.data?.data?.id ?? 0);
   const role = response.data?.level ?? response.data?.data?.level ?? '';

   if (token) {
    signIn(
     token,
     name,
     id,
     role
    );
   } else {
    setErrorMsg(response.data?.message || 'Usuario o contraseña incorrectos');
   }
  } catch (error: any) {
   console.log('LOGIN ERROR:', error?.response?.data || error);
   const serverMessage = error?.response?.data?.message;
   const status = error?.response?.status;
   setErrorMsg(
    serverMessage ||
     (status ? `Error ${status} al iniciar sesión` : 'Error de conexión')
   );
  }
 };

 return (
  <View style={{ flex: 1 }}>
   {/* HEADER */}
   <View style={[styles.topBar, { paddingTop: top }]}>
    <Text style={styles.topBarTitle}>Bamensa</Text>
   </View>

   <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
   >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
     <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
       value={username}
       onChangeText={setUsername}
       mode="outlined"
       style={styles.input}
       placeholder="Usuario"
       autoCapitalize="none"
      />

      <TextInput
       value={password}
       onChangeText={setPassword}
       secureTextEntry
       mode="outlined"
       style={styles.input}
       placeholder="Contraseña"
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
       <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

     </ScrollView>
    </TouchableWithoutFeedback>
   </KeyboardAvoidingView>
  </View>
 );
}

const styles = StyleSheet.create({
 topBar: {
  backgroundColor: '#145A41',
  paddingVertical: 16,
  alignItems: 'center',
 },
 topBarTitle: {
  color: '#fff',
  fontSize: 18,
 },
 container: {
  padding: 25,
  flexGrow: 1,
  justifyContent: 'center',
 },
 title: {
  fontSize: 26,
  marginBottom: 30,
  textAlign: 'center',
 },
 input: {
  marginTop: 15,
 },
 button: {
  marginTop: 30,
  backgroundColor: '#1E7F5C',
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
 },
 buttonText: {
  color: '#fff',
  fontSize: 16,
 },
 error: {
  color: 'red',
  marginTop: 10,
  textAlign: 'center',
 },
});
