import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DateChip from '../../accounts/components/DateChip';
import { dateHelper } from '../../../helpers/dateHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import type { ReportBalanceDetailByCoin } from '../services/boxBalanceService';

type Props = {
 item: ReportBalanceDetailByCoin;
};

const formatFixed1 = (value: unknown) => {
 const n = Number(value ?? 0);
 return Number.isFinite(n) ? n.toFixed(1) : '0.0';
};

export default function BalanceCoinDayCard({ item }: Props) {
 const [boxExpanded, setBoxExpanded] = useState(false);
 const [pendingsExpanded, setPendingsExpanded] = useState(false);

 const operationsTotal = Number(item.res_caja_general ?? 0) + Number(item.sum_extr ?? 0) + Number(item.sum_gasto ?? 0);
 const outputsTotal = Number(item.sum_gasto ?? 0) + Number(item.sum_extr ?? 0);
 const pendingsTotal =
  Number(item.sum_pendients_day ?? 0) +
  Number(item.sum_pendients_ret_acc ?? 0) -
  Number(item.sum_pendients_dep_acc ?? 0);

 return (
  <View style={styles.balanceCoinDayWrap}>
   <View style={styles.coinDateChipWrap}>
    <DateChip label={dateHelper.onlyDayMonth(item.item_created)} />
   </View>

   <TouchableOpacity style={styles.balanceCoinToggleRow} activeOpacity={0.85} onPress={() => setBoxExpanded((prev) => !prev)}>
    <View style={styles.balanceCoinLabelSide}>
     <Image
      source={require('../../../../assets/images/ui/downop.png')}
      style={[styles.balanceCoinArrow, boxExpanded ? styles.balanceCoinArrowOpen : null]}
     />
     <Text style={styles.balanceCoinLabel}>Caja total</Text>
    </View>
    <Text style={styles.balanceCoinValue}>{formatFixed1(item.res_caja_general)}</Text>
   </TouchableOpacity>

   {boxExpanded ? (
    <View style={styles.balanceCoinDetailGroup}>
     <View style={styles.balanceCoinSubRow}>
      <Text style={styles.balanceCoinSubLabel}>+ Operaciones</Text>
      <Text style={styles.balanceCoinSubValue}>{formatFixed1(operationsTotal)}</Text>
     </View>
     <View style={styles.balanceCoinSubRow}>
      <Text style={styles.balanceCoinSubLabel}>- Gastos / Extr</Text>
      <Text style={styles.balanceCoinSubValue}>{formatFixed1(outputsTotal)}</Text>
     </View>
    </View>
   ) : null}

   <View style={styles.balanceCoinLine} />

   <View style={styles.balanceCoinPlainRow}>
    <Text style={styles.balanceCoinPlainLabel}>+ Retiros</Text>
    <Text style={styles.balanceCoinPlainValue}>{formatFixed1(item.sum_ret_acc)}</Text>
   </View>

   <View style={styles.balanceCoinLine} />

   <View style={styles.balanceCoinPlainRow}>
    <Text style={styles.balanceCoinPlainLabel}>- Depositos</Text>
    <Text style={styles.balanceCoinPlainValue}>{formatFixed1(item.sum_dep_acc)}</Text>
   </View>

   <View style={styles.balanceCoinLine} />

   <TouchableOpacity
    style={styles.balanceCoinToggleRow}
    activeOpacity={0.85}
    onPress={() => setPendingsExpanded((prev) => !prev)}
   >
    <View style={styles.balanceCoinLabelSide}>
     <Image
      source={require('../../../../assets/images/ui/downop.png')}
      style={[styles.balanceCoinArrow, pendingsExpanded ? styles.balanceCoinArrowOpen : null]}
     />
     <Text style={styles.balanceCoinLabel}>+ Pendientes</Text>
    </View>
    <Text style={styles.balanceCoinValue}>{formatFixed1(pendingsTotal)}</Text>
   </TouchableOpacity>

   {pendingsExpanded ? (
    <View style={styles.balanceCoinDetailGroup}>
     <View style={styles.balanceCoinSubRow}>
      <Text style={styles.balanceCoinSubLabel}>+ Caja total</Text>
      <Text style={styles.balanceCoinSubValue}>{formatFixed1(item.sum_pendients_day)}</Text>
     </View>
     <View style={styles.balanceCoinSubRow}>
      <Text style={styles.balanceCoinSubLabel}>+ Retiros ctas</Text>
      <Text style={styles.balanceCoinSubValue}>{formatFixed1(item.sum_pendients_ret_acc)}</Text>
     </View>
     <View style={styles.balanceCoinSubRow}>
      <Text style={styles.balanceCoinSubLabel}>- Depósitos ctas</Text>
      <Text style={styles.balanceCoinSubValue}>{formatFixed1(item.sum_pendients_dep_acc)}</Text>
     </View>
    </View>
   ) : null}

   <View style={styles.balanceCoinLine} />
  </View>
 );
}
