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
   <TouchableOpacity onPress={onPressLeft} activeOpacity={0.8} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={styles.leftButton}>
    <Text style={styles.menuIcon}>{leftSymbol}</Text>
   </TouchableOpacity>
   <Text style={styles.topTitle}>{title}</Text>
  </View>
 );
}

const styles = StyleSheet.create({
 topBar: {
  height: 98,
  paddingTop: 37,
  paddingHorizontal: 22,
  backgroundColor: COLORS.colorPrimaryChange,
  flexDirection: 'row',
  alignItems: 'center',
 },
 leftButton: {
  minWidth: 34,
  minHeight: 34,
  alignItems: 'center',
  justifyContent: 'center',
 },
 menuIcon: {
  color: COLORS.topBarText,
  fontSize: 30,
  marginRight: 22,
 },
 topTitle: {
  color: COLORS.topBarText,
  fontSize: 22,
  fontFamily: 'OpenSansRegular',
 },
});
