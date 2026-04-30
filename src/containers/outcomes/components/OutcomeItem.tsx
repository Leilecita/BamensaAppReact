import React from 'react';
import { Image, Text, View } from 'react-native';
import { ReportOutcome } from '../services/outcomeService';
import styles from '../screens/OutcomesScreen.styles';

type Props = {
 item: ReportOutcome;
};

export default function OutcomeItem({ item }: Props) {
 const showUserLine = false;

 return (
  <View style={styles.rowWrap}>
    <View style={styles.rowShell}>
     <View style={styles.rowContent}>
      <View style={styles.rowLine}>
        <Text style={styles.rowDescription} numberOfLines={1}>
         {item.description || '-'}
        </Text>
      <Text style={styles.rowCoin}>{item.coin_name || 'ARS'}</Text>
      <Text style={styles.rowValue}>{Number(item.value ?? 0).toFixed(1)}</Text>
     </View>

     {showUserLine ? (
      <View style={styles.rowInfoUser}>
       <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.rowInfoUserIcon} />
       <Text style={styles.rowInfoUserText}>{item.user_name || ''}</Text>
      </View>
     ) : null}
    </View>
   </View>

   <View style={styles.rowDivider} />
  </View>
 );
}
