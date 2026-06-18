import React, { Fragment } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import DateChip from '../../accounts/components/DateChip';
import { dateHelper } from '../../../helpers/dateHelper';
import { valuesHelper } from '../../../helpers/valuesHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import type { ReportBalanceDetailTotalBox } from '../services/boxBalanceService';

type Props = {
 items: ReportBalanceDetailTotalBox[];
 loading: boolean;
 error: string | null;
 onRetry: () => void;
};

export default function CoinMovementSummary({ items, loading, error, onRetry }: Props) {
 if (loading) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <ActivityIndicator size="small" color="#6f6392" />
   </View>
  );
 }

 if (error) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <Text style={styles.coinDetailEmptyText}>No se pudo cargar la vista resumen</Text>
    <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
     <Text style={styles.coinDetailRetryText}>Reintentar</Text>
    </TouchableOpacity>
   </View>
  );
 }

 if (!items.length) {
  return (
   <View style={styles.coinDetailEmptyWrap}>
    <Text style={styles.coinDetailEmptyText}>Sin datos de resumen en esta moneda</Text>
   </View>
  );
 }

 return (
  <View style={styles.summaryInnerList}>
   {items.map((item, index) => {
    const caja = Number(item.res_caja_general ?? 0) + Number(item.sum_extr ?? 0) + Number(item.sum_gasto ?? 0);

    return (
     <Fragment key={`${item.item_created}-${index}`}>
      <View style={styles.coinDateChipWrap}>
       <DateChip label={dateHelper.onlyDayMonth(item.item_created)} />
      </View>

      <View style={styles.summaryInnerCard}>
       <View style={styles.summaryInnerRow}>
        <Text style={styles.summaryInnerLabel}>Caja diaria total</Text>
        <Text style={styles.summaryInnerValue}>{valuesHelper.getBigNumb(item.res_caja_general)}</Text>
       </View>
       <View style={styles.summaryInnerDivider} />

       <View style={styles.summaryInnerRow}>
        <Text style={styles.summaryInnerLabel}>Operaciones</Text>
        <Text style={styles.summaryInnerValue}>{valuesHelper.getBigNumb(caja)}</Text>
       </View>
       <View style={styles.summaryInnerDivider} />

       <View style={styles.summaryInnerRow}>
        <Text style={styles.summaryInnerLabel}>Gastos / Extr</Text>
        <Text style={styles.summaryInnerValue}>
         {valuesHelper.getBigNumb(Number(item.sum_gasto ?? 0) + Number(item.sum_extr ?? 0))}
        </Text>
       </View>
       <View style={styles.summaryInnerDivider} />

       <View style={styles.summaryInnerRow}>
        <Text style={styles.summaryInnerLabel}>Pendientes</Text>
        <Text style={styles.summaryInnerValue}>{valuesHelper.getBigNumb(item.res_caja_general_pendients)}</Text>
       </View>
      </View>
     </Fragment>
    );
   })}
  </View>
 );
}
