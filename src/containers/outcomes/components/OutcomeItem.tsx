import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ReportOutcome } from '../services/outcomeService';
import styles from '../screens/OutcomesScreen.styles';

type Props = {
 item: ReportOutcome;
 onLongPress?: (item: ReportOutcome) => void;
};

export default function OutcomeItem({ item, onLongPress }: Props) {
 const [expanded, setExpanded] = useState(false);
 const hour = useMemo(() => {
  const value = String(item.created ?? '');
  const [, time] = value.split(' ');
  if (!time) return '';
  return time.slice(0, 5);
 }, [item.created]);

 return (
  <TouchableOpacity
   style={styles.rowWrap}
   activeOpacity={0.88}
   onPress={() => setExpanded((prev) => !prev)}
   onLongPress={() => onLongPress?.(item)}
  >
   <View style={styles.rowShell}>
    <View style={styles.rowContent}>
     <View style={styles.rowLine}>
        <Text style={styles.rowDescription} numberOfLines={1}>
         {item.description || '-'}
        </Text>
      <Text style={styles.rowCoin}>{item.coin_name || 'ARS'}</Text>
      <Text style={styles.rowValue}>{Number(item.value ?? 0).toFixed(1)}</Text>
     </View>

     {expanded ? (
      <View style={styles.rowInfoUser}>
       <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.rowInfoUserIcon} />
       <Text style={styles.rowInfoUserText}>{item.user_name || ''}</Text>
       {hour ? <Text style={styles.rowInfoUserText}>{hour}</Text> : null}
       {hour ? <Text style={styles.rowInfoUserText}>hs</Text> : null}
      </View>
     ) : null}
    </View>
   </View>

   <View style={styles.rowDivider} />
  </TouchableOpacity>
 );
}
