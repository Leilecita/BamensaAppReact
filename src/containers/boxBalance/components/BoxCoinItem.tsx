import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import { valuesHelper } from '../../../helpers/valuesHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import type { ReportBoxCoin } from '../services/boxBalanceService';

type Props = {
 item: ReportBoxCoin;
 expanded: boolean;
 selectedView: typeof APP_CONSTANTS.TYPE_VIEW_DETAIL | typeof APP_CONSTANTS.TYPE_VIEW_RESUM;
 onPress: () => void;
 detailContent: React.ReactNode;
 summaryContent: React.ReactNode;
};

export default function BoxCoinItem({
 item,
 expanded,
 selectedView,
 onPress,
 detailContent,
 summaryContent,
}: Props) {
 const showCollapsedBalance = !(expanded && selectedView === APP_CONSTANTS.TYPE_VIEW_RESUM);
 const showCollapsedPendings =
  selectedView === APP_CONSTANTS.TYPE_VIEW_RESUM && !expanded && Number(item.pendients ?? 0) !== 0;

 return (
  <View style={[styles.summaryCoinBlock, expanded ? styles.summaryCoinBlockExpanded : null]}>
   <TouchableOpacity
    style={[styles.summaryRow, expanded ? styles.summaryRowExpanded : null]}
    activeOpacity={0.85}
    onPress={onPress}
   >
    <View style={styles.summaryCoinSide}>
     <Image source={getFilterFlagSourceByShortName(item.coin_short_name)} style={styles.summaryFlag} />
     {!expanded ? <Text style={styles.summaryCoinCode}>{item.coin_short_name}</Text> : null}
    </View>

    {showCollapsedBalance ? (
     <Text style={styles.summaryAmount}>{valuesHelper.getBigNumb(item.balance)}</Text>
    ) : null}
   </TouchableOpacity>

   {showCollapsedPendings ? (
    <View style={styles.pendingRow}>
     <Text style={styles.pendingRowText}>{valuesHelper.getBigNumb(item.pendients)}</Text>
     <Image source={require('../../../../assets/images/ui/pendsan.png')} style={styles.pendingRowIcon} />
    </View>
   ) : null}

   {expanded ? (
    <View style={styles.expandedContentWrap}>
     {selectedView === APP_CONSTANTS.TYPE_VIEW_DETAIL ? (
      <View style={styles.coinDetailWrap}>
       <View style={styles.coinDetailHeader}>
        <Text style={styles.coinDetailHeaderCoin}>{item.coin_short_name}</Text>
        <Text style={styles.coinDetailHeaderMov}>MOVIMIENTOS</Text>
        <Text style={styles.coinDetailHeaderBalance}>SALDO</Text>
       </View>
       {detailContent}
      </View>
     ) : (
      <View style={styles.summaryGeneralWrap}>{summaryContent}</View>
     )}
    </View>
   ) : null}

   <View style={styles.summaryDivider} />
  </View>
 );
}
