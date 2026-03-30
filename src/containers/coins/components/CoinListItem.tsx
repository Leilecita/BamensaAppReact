import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Coin } from '../services/coinService';
import { getFlagSourceByShortName } from '../../../helpers/flagHelper';

type CoinListItemProps = {
 coin: Coin;
 onPress?: (coin: Coin) => void;
 showDivider?: boolean;
};

export default function CoinListItem({
 coin,
 onPress,
 showDivider = true,
}: CoinListItemProps) {
 const content = (
  <View>
   <View style={styles.row}>
    <Image source={getFlagSourceByShortName(coin.short_name)} style={styles.flag} />
    <View style={styles.content}>
     <Text style={styles.shortName}>{coin.short_name}</Text>
     <Text style={styles.name}>{coin.name || '-'}</Text>
    </View>
   </View>
   {showDivider ? <View style={styles.divider} /> : null}
  </View>
 );

 if (!onPress) return content;

 return (
  <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(coin)}>
   {content}
  </TouchableOpacity>
 );
}

const styles = StyleSheet.create({
 row: {
  minHeight: 56,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
 },
 flag: {
  width: 36,
  height: 36,
  resizeMode: 'contain',
  opacity: 0.9,
  marginRight: 12,
 },
 content: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
 },
 shortName: {
  width: 72,
  color: '#4f4677',
  fontSize: 16,
  fontFamily: 'OpenSansRegular',
  textTransform: 'uppercase',
 },
 name: {
  flex: 1,
  color: '#7a7291',
  fontSize: 16,
  fontFamily: 'OpenSansRegular',
 },
 divider: {
  marginLeft: 12,
  marginRight: 12,
  height: 1,
  backgroundColor: '#d8d2e7',
  opacity: 0.8,
 },
});
