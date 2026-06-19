import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppTopBar from '../../../core/components/AppTopBar';
import GainsTab from '../components/GainsTab';
import MoneyMovementsTab from '../components/MoneyMovementsTab';
import styles from './StatisticsScreen.styles';

type StatisticsTab = 'gain' | 'money';

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<StatisticsTab>('gain');

  return (
    <View style={styles.screen}>
      <AppTopBar title="Resultados" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'gain' ? styles.tabBtnActive : null]}
          onPress={() => setTab('gain')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 'gain' ? styles.tabTextActive : null]}>Ganancias</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'money' ? styles.tabBtnActive : null]}
          onPress={() => setTab('money')}
          activeOpacity={0.85}
        >
          <Text style={[styles.tabText, tab === 'money' ? styles.tabTextActive : null]}>
            Movimientos de dinero
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {tab === 'gain' ? <GainsTab /> : <MoneyMovementsTab />}
      </View>
    </View>
  );
}
