import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountsScreen from '../../containers/accounts/screens/AccountsScreen';
import InformationByAccountScreen from '../../containers/accounts/screens/InformationByAccountScreen';
import CoinsScreen from '../../containers/coins/screens/CoinsScreen';
import HomeScreen from '../../containers/home/screens/HomeScreen';
import OperationsScreen from '../../containers/operations/screens/OperationsScreen';
import AppShell from './AppShell';
import { AppRoute } from './SideMenuContext';

export type HomeSelectedAccount = {
 id: number;
 name: string;
};

export type AccountCoinBalanceParam = {
 coin_id: number;
 coin_short_name: string;
 balance: number;
};

export type AppStackParamList = {
 home: { selectedAccount?: HomeSelectedAccount } | undefined;
 operations: undefined;
 coins: undefined;
 accounts: undefined;
 informationByAccount: {
  accountId: number;
  accountName: string;
  balances?: AccountCoinBalanceParam[];
 };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

function ScreenWithShell({ children }: { children: React.ReactNode }) {
 return (
  <AppShell>
   {children}
  </AppShell>
 );
}

export default function AppStack() {
 return (
  <Stack.Navigator initialRouteName="home" screenOptions={{ headerShown: false }}>
   <Stack.Screen name="home">
    {() => (
     <ScreenWithShell>
      <HomeScreen />
     </ScreenWithShell>
    )}
   </Stack.Screen>
   <Stack.Screen name="operations">
    {() => (
     <ScreenWithShell>
      <OperationsScreen />
     </ScreenWithShell>
    )}
   </Stack.Screen>
   <Stack.Screen name="coins">
    {() => (
     <ScreenWithShell>
      <CoinsScreen />
     </ScreenWithShell>
    )}
   </Stack.Screen>
   <Stack.Screen name="accounts">
    {() => (
     <ScreenWithShell>
      <AccountsScreen />
     </ScreenWithShell>
    )}
   </Stack.Screen>
   <Stack.Screen name="informationByAccount">
    {() => (
     <ScreenWithShell>
      <InformationByAccountScreen />
     </ScreenWithShell>
    )}
   </Stack.Screen>
  </Stack.Navigator>
 );
}
