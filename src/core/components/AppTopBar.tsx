import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';

type AppTopBarProps = {
 title: string;
 leftSymbol: string;
 onPressLeft: () => void;
};

export default function AppTopBar({ title, leftSymbol, onPressLeft }: AppTopBarProps) {
 return (
  <View style={styles.topBar}>
   <TouchableOpacity onPress={onPressLeft} activeOpacity={0.8}>
    <Text style={styles.menuIcon}>{leftSymbol}</Text>
   </TouchableOpacity>
   <Text style={styles.topTitle}>{title}</Text>
  </View>
 );
}

const styles = StyleSheet.create({
 topBar: {
  height: 102,
  paddingTop: 34,
  paddingHorizontal: 22,
  backgroundColor: COLORS.colorPrimaryChange,
  flexDirection: 'row',
  alignItems: 'center',
 },
 menuIcon: {
  color: COLORS.white,
  fontSize: 30,
  marginRight: 22,
 },
 topTitle: {
  color: COLORS.white,
  fontSize: 22,
  fontFamily: 'OpenSansRegular',
 },
});
