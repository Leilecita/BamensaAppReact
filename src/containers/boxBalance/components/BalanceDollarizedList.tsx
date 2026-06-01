import React from 'react';
import { Image, Text, View } from 'react-native';
import { getFlagSourceByShortName } from '../../../helpers/flagHelper';
import { formatAmount1Decimal, formatRate1Decimal } from '../../../helpers/valuesHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import type { BalanceDolarizedCoin } from '../services/boxBalanceService';

type Props = {
 items: BalanceDolarizedCoin[];
};

export default function BalanceDollarizedList({ items }: Props) {
 return (
  <View style={styles.balanceDollarizedList}>
   {items.map((item, index) => (
    <View key={`${item.coin_short_name}-${index}`} style={styles.balanceDollarizedRow}>
     <View style={styles.balanceDollarizedCoinSide}>
      <Image source={getFlagSourceByShortName(item.coin_short_name)} style={styles.balanceDollarizedFlag} />
      <Text style={styles.balanceDollarizedCode}>{item.coin_short_name}</Text>
     </View>

     <Text style={styles.balanceDollarizedAmount}>{formatAmount1Decimal(item.amount)}</Text>

     <View style={styles.balanceDollarizedDivider}>
      {Array.from({ length: 6 }).map((_, dotIndex) => (
       <View key={dotIndex} style={styles.balanceDollarizedDividerDot} />
      ))}
     </View>

     <Text style={styles.balanceDollarizedRate}>{formatRate1Decimal(item.rate)}</Text>
    </View>
   ))}
  </View>
 );
}
