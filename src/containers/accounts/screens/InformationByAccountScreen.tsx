import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppTopBar from '../../../core/components/AppTopBar';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import InformationByAccountOperationsTab from './tabs/InformationByAccountOperationsTab';
import InformationByAccountSummaryTab from './tabs/InformationByAccountSummaryTab';
import styles from './InformationByAccountScreen.styles';

type InfoByAccountRoute = RouteProp<AppStackParamList, 'informationByAccount'>;
type InfoByAccountNav = NativeStackNavigationProp<AppStackParamList, 'informationByAccount'>;
type InformationTab = 'operations' | 'summary';

export default function InformationByAccountScreen() {
 const navigation = useNavigation<InfoByAccountNav>();
 const route = useRoute<InfoByAccountRoute>();
 const [tab, setTab] = useState<InformationTab>('operations');

 const accountId = route.params.accountId;
 const accountName = route.params.accountName;
 const balances = route.params.balances ?? [];

 const title = useMemo(() => `Movimientos ${accountName}`, [accountName]);

 return (
  <View style={styles.screen}>
   <AppTopBar title={title} leftSymbol="←" onPressLeft={() => navigation.goBack()} />

   <View style={styles.tabsRow}>
    <TouchableOpacity
     style={[styles.tabBtn, tab === 'operations' ? styles.tabBtnActive : null]}
     activeOpacity={0.85}
     onPress={() => setTab('operations')}
    >
     <Text style={[styles.tabText, tab === 'operations' ? styles.tabTextActive : null]}>operaciones</Text>
    </TouchableOpacity>
    <TouchableOpacity
     style={[styles.tabBtn, tab === 'summary' ? styles.tabBtnActive : null]}
     activeOpacity={0.85}
     onPress={() => setTab('summary')}
    >
     <Text style={[styles.tabText, tab === 'summary' ? styles.tabTextActive : null]}>resumen de cuenta</Text>
    </TouchableOpacity>
   </View>

   {tab === 'operations' ? (
    <InformationByAccountOperationsTab accountId={accountId} balances={balances} />
   ) : (
    <InformationByAccountSummaryTab accountId={accountId} balances={balances} />
   )}
  </View>
 );
}
