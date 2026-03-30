import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppBottomSheet from './AppBottomSheet';
import { DIMENS } from '../constants/dimensions';
import { getFilterFlagSourceByShortName } from '../../helpers/flagHelper';

export type QuickFilterOption = {
 key: string;
 label: string;
 icon: any;
 iconSize?: number;
};

export type CoinFilterOption = {
 key: string;
 coinId: number;
 shortName: string;
 icon: any;
};

export const OPERATIONS_QUICK_FILTERS: QuickFilterOption[] = [
 {
  key: 'all',
  label: 'Todos',
  icon: require('../../../assets/images/ui/filtall.png'),
 },
 {
  key: 'buy',
  label: 'compra',
  icon: require('../../../assets/images/ui/filtbuy.png'),
 },
 {
  key: 'sale',
  label: 'venta',
  icon: require('../../../assets/images/ui/venta.png'),
 },
 {
  key: 'pend',
  label: 'pend',
  icon: require('../../../assets/images/ui/pendsan.png'),
 },
 {
  key: 'done',
  label: 'done',
  icon: require('../../../assets/images/ui/donesan.png'),
 },
 {
  key: 'usr',
  label: 'usr',
  icon: require('../../../assets/images/ui/sessionviol.png'),
  iconSize: 45,
 },
];

type Props = {
 height: number;
 peekHeight: number;
 quickFilters: QuickFilterOption[];
 selectedQuickFilter: string;
 onSelectQuickFilter: (key: string) => void;
 coinFilters?: CoinFilterOption[];
 coinsSource?: Array<{ id: number; short_name: string }>;
 selectedCoinId?: number;
 onSelectCoinId?: (coinId: number) => void;
 contentBottomPadding?: number;
};

export default function OperationsFiltersBottomSheet({
 height,
 peekHeight,
 quickFilters,
 selectedQuickFilter,
 onSelectQuickFilter,
 coinFilters,
 coinsSource,
 selectedCoinId,
 onSelectCoinId,
 contentBottomPadding = 0,
}: Props) {
 const resolvedCoinFilters: CoinFilterOption[] = React.useMemo(() => {
  if (coinFilters?.length) return coinFilters;
  if (!coinsSource?.length) return [];

  return coinsSource
   .filter((coin) => Boolean(coin.short_name))
   .map((coin) => ({
    key: `coin-${coin.id}`,
    coinId: coin.id,
    shortName: coin.short_name,
    icon: getFilterFlagSourceByShortName(coin.short_name),
   }));
 }, [coinFilters, coinsSource]);

 const hasCoinFilters = Boolean(resolvedCoinFilters.length && onSelectCoinId);

 return (
  <AppBottomSheet
   height={height}
   peekHeight={peekHeight}
   arrowSource={require('../../../assets/images/ui/arrowsan.png')}
   dragOn="both"
   containerStyle={styles.bottomSheet}
   bodyStyle={styles.sheetBody}
  >
   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.quickFilterScroll}
    contentContainerStyle={styles.filterRow}
   >
    {quickFilters.map((filter) => {
     const selected = filter.key === selectedQuickFilter;
     return (
      <TouchableOpacity
       key={filter.key}
       style={styles.filterItem}
       activeOpacity={0.8}
       onPress={() => onSelectQuickFilter(filter.key)}
      >
       <Image
        source={filter.icon}
        style={[
         styles.filterIcon,
         { width: filter.iconSize ?? 40, height: filter.iconSize ?? 40 },
         selected ? styles.filterIconActive : null,
        ]}
       />
       <Text style={[styles.filterLabel, selected ? styles.filterLabelActive : null]}>{filter.label}</Text>
      </TouchableOpacity>
     );
    })}
   </ScrollView>

   <View
    style={[
     styles.sheetContentPlaceholder,
     hasCoinFilters ? styles.sheetContentWithCoins : styles.sheetContentNoCoins,
     { paddingBottom: contentBottomPadding },
    ]}
   >
    {hasCoinFilters ? (
     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coinFilterScroll} contentContainerStyle={styles.coinFilterRow}>
      {resolvedCoinFilters.map((coin) => {
       const selected = selectedCoinId === coin.coinId;
       return (
        <TouchableOpacity
         key={coin.key}
         style={styles.coinFilterItem}
         activeOpacity={0.8}
         onPress={() => onSelectCoinId!(coin.coinId)}
        >
         <Image source={coin.icon} style={[styles.coinFilterIcon, selected ? styles.coinFilterIconActive : null]} />
         <Text style={[styles.coinFilterLabel, selected ? styles.coinFilterLabelActive : null]}>{coin.shortName}</Text>
        </TouchableOpacity>
       );
      })}
     </ScrollView>
    ) : null}
   </View>
  </AppBottomSheet>
 );
}

const styles = StyleSheet.create({
 bottomSheet: {
  backgroundColor: 'transparent',
 },
 sheetBody: {
  flex: 1,
  backgroundColor: '#ededf2',
  borderTopLeftRadius: 14,
  borderTopRightRadius: 14,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 8,
 },
 filterRow: {
  marginTop: 16,
  minHeight: 0,
  paddingHorizontal: 8,
  alignItems: 'flex-start',
  paddingTop: 0,
  paddingBottom: 0,
 },
 quickFilterScroll: {
  width: '100%',
  maxHeight: 110,
 },
 filterItem: {
  width: 77,
  paddingHorizontal: 6,
  paddingTop: 0,
  paddingBottom: 2,
  marginRight: 2,
  alignItems: 'center',
  justifyContent: 'flex-start',
 },
 filterIcon: {
  width: 40,
  height: 40,
  opacity: 0.7,
  resizeMode: 'contain',
 },
 filterIconActive: {
  opacity: 1,
 },
 filterLabel: {
  marginTop: 4,
  color: '#5d537e',
  width: 65,
  paddingTop: 2,
  fontSize: DIMENS.textDetailBottom,
  lineHeight: DIMENS.textDetailBottom + 4,
  fontFamily: 'OpenSansLight',
  textAlign: 'center',
  textTransform: 'lowercase',
 },
 filterLabelActive: {
  color: '#4f426b',
 },
 sheetContentPlaceholder: {
  paddingTop: 0,
 },
 sheetContentWithCoins: {
  flex: 0,
 },
 sheetContentNoCoins: {
  flex: 1,
 },
 coinFilterRow: {
  paddingHorizontal: 8,
  marginTop: 0,
  alignItems: 'flex-start',
  paddingTop: 0,
  paddingBottom: 0,
 },
 coinFilterScroll: {
  width: '100%',
 },
 coinFilterItem: {
  width: 77,
  paddingHorizontal: 6,
  paddingTop: 0,
  paddingBottom: 2,
  marginRight: 0,
  alignItems: 'center',
  justifyContent: 'flex-start',
 },
 coinFilterIcon: {
  width: 40,
  height: 40,
  opacity: 0.45,
  resizeMode: 'contain',
 },
 coinFilterIconActive: {
  opacity: 1,
 },
 coinFilterLabel: {
  marginTop: 2,
  width: 65,
  color: '#8c88a3',
  fontSize: DIMENS.textDetailBottom,
  lineHeight: DIMENS.textDetailBottom + 4,
  fontFamily: 'OpenSansLight',
  textAlign: 'center',
  textTransform: 'uppercase',
 },
 coinFilterLabelActive: {
  color: '#4f426b',
 },
});
