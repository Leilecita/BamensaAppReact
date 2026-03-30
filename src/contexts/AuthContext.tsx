import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthContextType = {
 userToken: string | null;
 userRole: string | null;
 userName: string | null;
 userId: number | null;
 signIn: (token: string, name: string, id: number, role?: string) => Promise<void>;
 signOut: () => void;
};

export const AuthContext = createContext<AuthContextType>({
 userToken: null,
 userRole: null,
 userName: null,
 userId: null,
 signIn: async () => {},
 signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
 const [userToken, setUserToken] = useState<string | null>(null);
 const [userRole, setUserRole] = useState<string | null>(null);
 const [userName, setUserName] = useState<string | null>(null);
 const [userId, setUserId] = useState<number | null>(null);

 useEffect(() => {
  const loadAuth = async () => {
   const token = await AsyncStorage.getItem('userToken');
   const role = await AsyncStorage.getItem('userRole');
   const name = await AsyncStorage.getItem('userName');
   const id = await AsyncStorage.getItem('userId');

   setUserToken(token);
   setUserRole(role);
   setUserName(name);
   setUserId(id ? Number(id) : null);
  };

  loadAuth();
 }, []);

 const signIn = async (
  token: string,
  userName: string,
  userId: number,
  role: string = ''
 ) => {
  await AsyncStorage.setItem('userToken', token);
  await AsyncStorage.setItem('userRole', role);
  await AsyncStorage.setItem('userName', userName);
  await AsyncStorage.setItem('userId', userId.toString());

  setUserToken(token);
  setUserRole(role);
  setUserName(userName);
  setUserId(userId);
 };

 const signOut = async () => {
  await AsyncStorage.clear();

  setUserToken(null);
  setUserRole(null);
  setUserName(null);
  setUserId(null);
 };

 return (
  <AuthContext.Provider
   value={{ userToken, userRole, userName, userId, signIn, signOut }}
  >
   {children}
  </AuthContext.Provider>
 );
};
