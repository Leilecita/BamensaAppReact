import React, { useMemo, useState } from 'react';
import { GestureResponderEvent, Image, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { dateHelper } from '../../../helpers/dateHelper';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import { ReportItemOperation } from '../services/accountItemsOperationService';
import styles from './ItemOpByCoin2.styles';

type ItemOpByCoin2Props = {
 item: ReportItemOperation;
 onLongPress?: (item: ReportItemOperation, anchorY: number) => void;
};

const capitalizeWord = (text?: string) => {
 const value = String(text ?? '').trim();
 if (!value) return '-';
 return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export default function ItemOpByCoin2({ item, onLongPress }: ItemOpByCoin2Props) {
 const [expanded, setExpanded] = useState(false);
 const dividerDots = expanded ? 18 : 10;
 const createdHour = dateHelper.onlyHourMinut(dateHelper.getOnlyTime(item.created)) || '--:--';

 const isCredit = item.credit > 0;
 const amount = isCredit ? item.credit : item.debit;
 const amountText = `${isCredit ? '+' : '-'}${formatAmount1Decimal(amount)}`;
 const amountStyle = isCredit ? styles.amountPlus : styles.amountMinus;

 const pending = item.state === APP_CONSTANTS.STATE_PENDIENT;
 const observation = String(item.observation ?? '').trim();
 const isFishertonMirrorObservation = !pending && (observation === 'balanceFisherton' || observation === 'opFisherton');
 const hasBalanceObservation = !pending && observation.toLowerCase().includes('balance');
 const showStateIcon = pending || hasBalanceObservation || isFishertonMirrorObservation;
 const stateIcon = pending
  ? require('../../../../assets/images/ui/pendsan.png')
  : isFishertonMirrorObservation
   ? require('../../../../assets/app-icons/logo_ic_fisherton4_round.png')
   : hasBalanceObservation
    ? require('../../../../assets/images/ui/bal2.png')
    : require('../../../../assets/images/ui/pendsan.png');
 const showAffect = item.nota?.includes(APP_CONSTANTS.AFFECT_ACO) || item.nota?.includes(APP_CONSTANTS.AFFECT_ACI);
 const affectIcon = item.nota?.includes(APP_CONSTANTS.AFFECT_ACO)
  ? require('../../../../assets/images/ui/entraccliente.png')
  : require('../../../../assets/images/ui/saleccliente2.png');

 const showObs = useMemo(() => !!String(item.observation ?? '').trim(), [item.observation]);

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

       <Image
        source={stateIcon}
        style={[styles.stateIm, !showStateIcon ? styles.stateHidden : null]}
       />

       {showAffect ? <Image source={affectIcon} style={styles.stateImAffect} /> : null}

       <View style={styles.amountWrap}>
        <Text
         style={[styles.amount, amountStyle]}
         numberOfLines={1}
         adjustsFontSizeToFit
         minimumFontScale={0.55}
        >
         {amountText}
        </Text>
       </View>
      </View>

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
        <Text style={styles.metaText}>{item.observation}</Text>
       </View>
      ) : null}
     </View>

     <View style={styles.balanceDivider}>
      {Array.from({ length: dividerDots }).map((_, index) => (
       <View key={index} style={styles.balanceDividerDot} />
      ))}
     </View>
     <View style={styles.balanceWrap}>
      <Text
       style={styles.balance}
       numberOfLines={1}
       adjustsFontSizeToFit
       minimumFontScale={0.55}
      >
       {formatAmount1Decimal(item.balance)}
      </Text>
     </View>
    </View>
   </View>

   <View style={styles.div} />
  </TouchableOpacity>
 );
}
