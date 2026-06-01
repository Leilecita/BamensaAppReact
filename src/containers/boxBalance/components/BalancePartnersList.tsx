import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import { BalancePartner, normalizeBalancePartners } from '../services/boxBalanceService';

type Props = {
 items: any[];
 onPressState?: (partner: BalancePartner) => void;
};

const formatPercentage = (value: number | null) => {
 if (value === null) return '-';
 return Number.isInteger(value) ? String(value) : String(value);
};

export default function BalancePartnersList({ items, onPressState }: Props) {
 const partners: BalancePartner[] =
  items.length > 0 && !items[0]?.partner_balance && !items[0]?.account
   ? (items as BalancePartner[])
   : normalizeBalancePartners(items);

 if (!partners.length) {
  return (
   <View style={styles.balancePartnersEmptyWrap}>
    <Text style={styles.balancePartnersEmptyText}>Sin asignaciones para mostrar</Text>
   </View>
  );
 }

 return (
  <View style={styles.balancePartnersList}>
   {partners.map((partner, index) => (
    <View key={`${partner.name}-${index}`} style={styles.balancePartnerCardWrap}>
     <View style={styles.balancePartnerCard}>
      <View style={styles.balancePartnerNameBlock}>
       <Text style={styles.balancePartnerName}>{partner.name}</Text>
       {partner.surname ? <Text style={styles.balancePartnerSurname}>{partner.surname}</Text> : null}
      </View>

      <View style={styles.balancePartnerAmountBlock}>
       <Text
        style={[
         styles.balancePartnerAmount,
         partner.assigned === 'true'
          ? styles.balancePartnerAssignedValue
          : styles.balancePartnerPendingValue,
        ]}
       >
        {partner.value === null ? '-' : formatAmount1Decimal(partner.value)}
       </Text>
      </View>

      <View style={styles.balancePartnerPercentageBlock}>
       <Text
        style={[
         styles.balancePartnerPercentage,
         partner.assigned === 'true'
          ? styles.balancePartnerAssignedValue
          : styles.balancePartnerPendingValue,
        ]}
       >
        {formatPercentage(partner.participation)}
       </Text>
       <Text
        style={[
         styles.balancePartnerPercentSign,
         partner.assigned === 'true'
          ? styles.balancePartnerAssignedValue
          : styles.balancePartnerPendingValue,
        ]}
       >
        {' %'}
       </Text>
      </View>

      <TouchableOpacity
       style={styles.balancePartnerStateBlock}
       activeOpacity={0.85}
       onPress={() => onPressState?.(partner)}
      >
       <Image
        source={
         partner.assigned === 'true'
          ? require('../../../../assets/images/ui/donesan.png')
          : require('../../../../assets/images/ui/pendsan.png')
        }
        style={[
         styles.balancePartnerStateIcon,
         partner.assigned === 'true'
          ? styles.balancePartnerAssignedIcon
         : styles.balancePartnerPendingIcon,
        ]}
       />
      </TouchableOpacity>
     </View>
    </View>
   ))}
  </View>
 );
}
