import React, { useMemo, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import { ReportItemOperation } from '../services/accountItemsOperationService';
import styles from './ItemOpByCoin2.styles';

type ItemOpByCoin2Props = {
 item: ReportItemOperation;
};

const capitalizeWord = (text?: string) => {
 const value = String(text ?? '').trim();
 if (!value) return '-';
 return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getHourMinutes = (created?: string) => {
 if (!created) return '--:--';
 const parts = created.split(' ');
 if (parts.length < 2) return '--:--';
 const h = parts[1]?.split(':');
 if (h.length < 2) return '--:--';
 return `${h[0]}:${h[1]}`;
};

export default function ItemOpByCoin2({ item }: ItemOpByCoin2Props) {
 const [expanded, setExpanded] = useState(false);
 const dividerDots = expanded ? 18 : 10;

 const isCredit = item.credit > 0;
 const amount = isCredit ? item.credit : item.debit;
 const amountText = `${isCredit ? '+' : '-'}${formatAmount1Decimal(amount)}`;
 const amountStyle = isCredit ? styles.amountPlus : styles.amountMinus;

 const pending = item.state === APP_CONSTANTS.STATE_PENDIENT;
 const showAffect = item.nota?.includes(APP_CONSTANTS.AFFECT_ACO) || item.nota?.includes(APP_CONSTANTS.AFFECT_ACI);
 const affectIcon = item.nota?.includes(APP_CONSTANTS.AFFECT_ACO)
  ? require('../../../../assets/images/ui/entraccliente.png')
  : require('../../../../assets/images/ui/saleccliente2.png');

 const showObs = useMemo(() => !!String(item.observation ?? '').trim(), [item.observation]);

 return (
  <TouchableOpacity style={styles.linear} activeOpacity={0.85} onPress={() => setExpanded((prev) => !prev)}>
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
        source={require('../../../../assets/images/ui/pendsan.png')}
        style={[styles.stateIm, !pending ? styles.stateHidden : null]}
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
        <Text style={styles.metaText}>{item.user_name || '-'}</Text>
        <Text style={styles.metaText}>{getHourMinutes(item.created)}</Text>
        <Text style={styles.metaText}>hs</Text>
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
