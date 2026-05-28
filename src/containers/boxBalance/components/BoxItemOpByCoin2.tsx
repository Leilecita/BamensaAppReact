import React, { useState } from 'react';
import { GestureResponderEvent, Image, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { dateHelper } from '../../../helpers/dateHelper';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import type { ReportItemOperation } from '../../accounts/services/accountItemsOperationService';
import styles from './BoxItemOpByCoin2.styles';

type Props = {
 item: ReportItemOperation;
 onLongPress?: (item: ReportItemOperation, anchorY: number) => void;
};

const capitalizeWord = (text?: string) => {
 const value = String(text ?? '').trim();
 if (!value) return '-';
 return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function BoxItemOpByCoin2({ item, onLongPress }: Props) {
 const [expanded, setExpanded] = useState(false);
 const createdHour = dateHelper.onlyHourMinut(dateHelper.getOnlyTime(item.created)) || '--:--';
 const observation = String(item.observation ?? '').trim();
 const accountName =
  item.operation_type === 'gasto' || item.operation_type === 'extraccion'
   ? observation || item.client_name_account || '-'
   : item.client_name_account || '-';

 const isCredit = Number(item.credit ?? 0) > 0;
 const amount = isCredit ? Number(item.credit ?? 0) : Number(item.debit ?? 0);
 const amountText = `${isCredit ? '+' : '-'}${formatAmount1Decimal(amount)}`;
 const amountStyle = isCredit ? styles.amountPlus : styles.amountMinus;

 const pending = item.state === APP_CONSTANTS.STATE_PENDIENT;
 const isFishertonMirrorObservation = !pending && (observation === 'balanceFisherton' || observation === 'opFisherton');
 const hasBalanceObservation = !pending && observation === 'balance';
 const showStateIcon = pending || hasBalanceObservation || isFishertonMirrorObservation;
 const stateIcon = pending
  ? require('../../../../assets/images/ui/pendsan.png')
  : isFishertonMirrorObservation
   ? require('../../../../assets/app-icons/logo_ic_fisherton4_round.png')
   : require('../../../../assets/images/ui/bal2.png');

 const showObs = observation.length > 0;

 return (
  <TouchableOpacity
   style={styles.linear}
   activeOpacity={0.85}
   onPress={() => setExpanded((prev) => !prev)}
   onLongPress={(event: GestureResponderEvent) => onLongPress?.(item, event.nativeEvent.pageY)}
  >
   <View style={styles.rel}>
    <View style={styles.mainRow}>
     <View style={styles.leftCol}>
      <View style={styles.topRow}>
       <View style={styles.typeWrap}>
        <Text style={styles.type} numberOfLines={1} ellipsizeMode="tail">
         {capitalizeWord(item.operation_type)}
        </Text>
       </View>

       <Image source={stateIcon} style={[styles.stateIm, !showStateIcon ? styles.stateHidden : null]} />

       <View style={styles.amountWrap}>
        <Text style={[styles.amount, amountStyle]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.55}>
         {amountText}
        </Text>
       </View>
      </View>

      {expanded ? (
       <View style={styles.lineInfoBox}>
        <Text style={styles.accountText}>{accountName}</Text>
       </View>
      ) : null}

      {expanded ? (
       <View style={styles.lineInfoAccounts}>
        <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.metaIcon} />
        <Text style={styles.metaUserText}>{item.user_name || '-'}</Text>
        <Text style={styles.metaUserText}>{createdHour}</Text>
        <Text style={styles.metaUserText}>hs</Text>
       </View>
      ) : null}

      {expanded && showObs ? (
       <View style={styles.lineInfoObs}>
        <Image source={require('../../../../assets/images/ui/documento.png')} style={styles.metaIcon} />
        <Text style={styles.metaText}>{observation}</Text>
       </View>
      ) : null}
     </View>

     <View style={styles.balanceDivider}>
      {Array.from({ length: expanded ? 18 : 10 }).map((_, index) => (
       <View key={index} style={styles.balanceDividerDot} />
      ))}
     </View>

     <View style={styles.balanceWrap}>
      <Text style={styles.balance} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.55}>
       {formatAmount1Decimal(item.balance)}
      </Text>
     </View>
    </View>
   </View>

   <View style={styles.div} />
  </TouchableOpacity>
 );
}
