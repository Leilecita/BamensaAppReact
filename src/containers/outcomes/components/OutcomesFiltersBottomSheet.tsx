import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import { GroupByType } from '../services/outcomeService';

type Props = {
 height: number;
 peekHeight: number;
 groupBy: GroupByType;
 onChangeGroupBy: (next: GroupByType) => void;
 coins: Array<{ id: number; short_name: string }>;
 selectedCoinId: number;
 onChangeCoinId: (coinId: number) => void;
};

type GroupFilter = {
 key: GroupByType;
 label: string;
 icon: any;
 useTint?: boolean;
};

const GROUP_FILTERS: GroupFilter[] = [
 { key: 'all', label: 'Todos', icon: require('../../../../assets/images/ui/filtall.png') },
 { key: 'day', label: 'dia', icon: require('../../../../assets/images/ui/buttonbshadow.png'), useTint: true },
 { key: 'month', label: 'mes', icon: require('../../../../assets/images/ui/buttonbshadow.png'), useTint: true },
];

export default function OutcomesFiltersBottomSheet({
 height,
 peekHeight,
 groupBy,
 onChangeGroupBy,
 coins,
 selectedCoinId,
 onChangeCoinId,
}: Props) {
 return (
  <AppBottomSheet
   height={height}
   peekHeight={peekHeight}
   arrowSource={require('../../../../assets/images/ui/arrowsan.png')}
   dragOn="both"
   containerStyle={styles.bottomSheet}
   bodyStyle={styles.sheetBody}
  >
   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.groupRow}
   >
    {GROUP_FILTERS.map((filter) => {
      const selected = groupBy === filter.key;
      return (
       <TouchableOpacity
        key={filter.key}
        style={styles.groupItem}
        activeOpacity={0.8}
        onPress={() => onChangeGroupBy(filter.key)}
       >
        <Image
         source={filter.icon}
         style={[
          styles.groupIcon,
          filter.useTint ? styles.groupIconTint : null,
          selected ? styles.groupIconActive : null,
         ]}
        />
        <Text style={[styles.groupLabel, selected ? styles.groupLabelActive : null]}>{filter.label}</Text>
       </TouchableOpacity>
      );
    })}
   </ScrollView>

   <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.coinsRow}
   >
    {coins.map((coin) => {
      const selected = selectedCoinId === coin.id;
      return (
       <TouchableOpacity
        key={coin.id}
        style={styles.coinItem}
        activeOpacity={0.8}
        onPress={() => onChangeCoinId(coin.id)}
       >
        <Image source={getFilterFlagSourceByShortName(coin.short_name)} style={[styles.coinIcon, selected ? styles.coinIconActive : null]} />
        <Text style={[styles.coinLabel, selected ? styles.coinLabelActive : null]}>{coin.short_name}</Text>
       </TouchableOpacity>
      );
    })}
   </ScrollView>
  </AppBottomSheet>
 );
}

const styles = StyleSheet.create({
 bottomSheet: {
  backgroundColor: 'transparent',
 },
 sheetBody: {
  flex: 1,
  backgroundColor: COLORS.background_bottom_sheet,
  borderTopLeftRadius: 10,
  borderTopRightRadius: 10,
 },
 groupRow: {
  paddingTop: 8,
  paddingHorizontal: 6,
 },
 groupItem: {
  width: 78,
  alignItems: 'center',
  paddingHorizontal: 6,
 },
 groupIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  opacity: 0.6,
 },
 groupIconTint: {
  tintColor: COLORS.colorPrimaryDarkLetter,
 },
 groupIconActive: {
  opacity: 1,
 },
 groupLabel: {
  marginTop: 4,
  width: 65,
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.textDetailBottom,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
  textTransform: 'lowercase',
 },
 groupLabelActive: {
  color: COLORS.colorPrimaryDarkLetter,
 },
 coinsRow: {
  paddingTop: 8,
  paddingHorizontal: 8,
  paddingRight: 80,
 },
 coinItem: {
  width: 74,
  alignItems: 'center',
  marginRight: 8,
 },
 coinIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  opacity: 0.45,
 },
 coinIconActive: {
  opacity: 1,
 },
 coinLabel: {
  marginTop: 4,
  width: 65,
  color: COLORS.colorPrimaryIntLetter,
  fontSize: DIMENS.generalText,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
  textTransform: 'uppercase',
 },
 coinLabelActive: {
  color: COLORS.colorPrimaryDarkLetter,
 },
});

