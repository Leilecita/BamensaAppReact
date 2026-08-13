import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AccountsScreen from '../../containers/accounts/screens/AccountsScreen';
import CreateAccountScreen from '../../containers/accounts/screens/CreateAccountScreen';
import CreateBalanceScreen from '../../containers/boxBalance/screens/CreateBalanceScreen';
import InformationBoxBalanceFishertonScreen from '../../containers/boxBalanceFisherton/screens/InformationBoxBalanceFishertonScreen';
import InformationByAccountScreen from '../../containers/accounts/screens/InformationByAccountScreen';
import DivisionBalanceScreen from '../../containers/boxBalance/screens/DivisionBalanceScreen';
import InformationBoxBalanceScreen from '../../containers/boxBalance/screens/InformationBoxBalanceScreen';
import CoinsScreen from '../../containers/coins/screens/CoinsScreen';
import ChecksScreen from '../../containers/checks/screens/ChecksScreen';
import HomeScreen from '../../containers/home/screens/HomeScreen';
import HomeScreenNew from '../../containers/home/screens/HomeScreenNew';
import OperationsScreen from '../../containers/operations/screens/OperationsScreen';
import OutcomesScreen from '../../containers/outcomes/screens/OutcomesScreen';
import StatisticsScreen from '../../containers/statistics/screens/StatisticsScreen';
import TransfersScreen from '../../containers/transfers/screens/TransfersScreen';
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
  homeNew: { selectedAccount?: HomeSelectedAccount } | undefined;
  operations: undefined;
  statistics: undefined;
  coins: undefined;
  accounts: undefined;
  createAccount: undefined;
  outcomes: undefined;
  checks: undefined;
  transfers: undefined;
  boxBalance:
  | {
    initialTab?: 'box' | 'coins' | 'balance';
  }
  | undefined;
  boxBalanceFisherton:
  | {
    initialTab?: 'box' | 'coins' | 'balance';
  }
  | undefined;
  createBalance: undefined;
  divisionBalance: {
    balanceId: number;
    result: number;
    dateBalance: string;
    partners?: any[];
  };
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
    <Stack.Navigator initialRouteName="homeNew" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home">
        {() => (
          <ScreenWithShell>
            <HomeScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="homeNew">
        {() => (
          <ScreenWithShell>
            <HomeScreenNew />
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
      <Stack.Screen name="statistics">
        {() => (
          <ScreenWithShell>
            <StatisticsScreen />
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
      <Stack.Screen name="createAccount">
        {() => (
          <ScreenWithShell>
            <CreateAccountScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="outcomes">
        {() => (
          <ScreenWithShell>
            <OutcomesScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="checks">
        {() => (
          <ScreenWithShell>
            <ChecksScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="transfers">
        {() => (
          <ScreenWithShell>
            <TransfersScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="boxBalance">
        {() => (
          <ScreenWithShell>
            <InformationBoxBalanceScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="boxBalanceFisherton">
        {() => (
          <ScreenWithShell>
            <InformationBoxBalanceFishertonScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="createBalance">
        {() => (
          <ScreenWithShell>
            <CreateBalanceScreen />
          </ScreenWithShell>
        )}
      </Stack.Screen>
      <Stack.Screen name="divisionBalance">
        {() => (
          <ScreenWithShell>
            <DivisionBalanceScreen />
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
