import React, { useContext, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppTopBar from '../../../core/components/AppTopBar';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { AuthContext } from '../../../contexts/AuthContext';
import styles from './InformationBoxBalanceScreen.styles';
import InformationBoxBalancePlaceholderTab from './tabs/InformationBoxBalancePlaceholderTab';
import InformationBoxBalanceTotalTab from './tabs/InformationBoxBalanceTotalTab';

type BoxBalanceRoute = RouteProp<AppStackParamList, 'boxBalance'>;
type BoxBalanceNav = NativeStackNavigationProp<AppStackParamList, 'boxBalance'>;
type InformationTab = 'box' | 'coins' | 'balance';

const TAB_LABELS: Record<InformationTab, string> = {
 box: 'caja total',
 coins: 'saldo monedas',
 balance: 'balances',
};

export default function InformationBoxBalanceScreen() {
 const navigation = useNavigation<BoxBalanceNav>();
 const route = useRoute<BoxBalanceRoute>();
 const { userRole } = useContext(AuthContext);
 const isAdmin = String(userRole ?? '').trim().toLowerCase() === 'admin';
 const initialTab = route.params?.initialTab ?? 'box';
 const safeInitialTab: InformationTab =
  initialTab === 'balance' && !isAdmin ? 'box' : initialTab;
 const [tab, setTab] = useState<InformationTab>(safeInitialTab);

 const availableTabs = useMemo<InformationTab[]>(
  () => (isAdmin ? ['box', 'coins', 'balance'] : ['box', 'coins']),
  [isAdmin],
 );

 return (
  <View style={styles.screen}>
   <AppTopBar title="Caja y balance" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

   <View style={styles.tabsRow}>
    {availableTabs.map((tabKey) => (
     <TouchableOpacity
      key={tabKey}
      style={[styles.tabBtn, tab === tabKey ? styles.tabBtnActive : null]}
      activeOpacity={0.85}
      onPress={() => setTab(tabKey)}
     >
      <Text style={[styles.tabText, tab === tabKey ? styles.tabTextActive : null]}>{TAB_LABELS[tabKey]}</Text>
     </TouchableOpacity>
    ))}
   </View>

   {tab === 'box' ? <InformationBoxBalanceTotalTab /> : null}
   {tab === 'coins' ? (
    <InformationBoxBalancePlaceholderTab
     title="Saldo monedas"
     description="La estructura del segundo tab ya quedó montada dentro de Cajas. Falta conectar su contenido específico."
    />
   ) : null}
   {tab === 'balance' ? (
    <InformationBoxBalancePlaceholderTab
     title="Balances"
     description="Este tab quedó reservado para el flujo admin, igual que en Android."
    />
   ) : null}
  </View>
 );
}
