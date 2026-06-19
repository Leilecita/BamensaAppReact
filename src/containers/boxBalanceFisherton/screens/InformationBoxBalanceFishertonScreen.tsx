import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppTopBar from '../../../core/components/AppTopBar';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import styles from './InformationBoxBalanceFishertonScreen.styles';
import InformationBoxBalanceFishertonBalancesTab from './tabs/InformationBoxBalanceFishertonBalancesTab';
import InformationBoxBalanceFishertonCoinsTab from './tabs/InformationBoxBalanceFishertonCoinsTab';
import InformationBoxBalanceFishertonTotalTab from './tabs/InformationBoxBalanceFishertonTotalTab';

type BoxBalanceFishertonRoute = RouteProp<AppStackParamList, 'boxBalance'>;
type BoxBalanceFishertonNav = NativeStackNavigationProp<AppStackParamList, 'boxBalance'>;
type InformationTab = 'box' | 'coins' | 'balance';

const TAB_LABELS: Record<InformationTab, string> = {
  box: 'caja total',
  coins: 'saldo monedas',
  balance: 'balances',
};

const AVAILABLE_TABS: InformationTab[] = ['box', 'coins', 'balance'];

export default function InformationBoxBalanceFishertonScreen() {
  const navigation = useNavigation<BoxBalanceFishertonNav>();
  const route = useRoute<BoxBalanceFishertonRoute>();
  const initialTab = route.params?.initialTab ?? 'box';
  const [tab, setTab] = useState<InformationTab>(initialTab);
  const [focusRefreshKey, setFocusRefreshKey] = useState(0);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useFocusEffect(
    useCallback(() => {
      setFocusRefreshKey((prev) => prev + 1);
    }, []),
  );

  return (
    <View style={styles.screen}>
      <AppTopBar title="Caja y balance Fisherton" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

      <View style={styles.tabsRow}>
        {AVAILABLE_TABS.map((tabKey) => (
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

      {tab === 'box' ? <InformationBoxBalanceFishertonTotalTab /> : null}
      {tab === 'coins' ? <InformationBoxBalanceFishertonCoinsTab /> : null}
      {tab === 'balance' ? (
        <InformationBoxBalanceFishertonBalancesTab refreshKey={focusRefreshKey} />
      ) : null}
    </View>
  );
}
