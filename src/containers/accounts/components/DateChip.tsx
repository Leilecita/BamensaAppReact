import React from 'react';
import { Text, View } from 'react-native';
import styles from './DateChip.styles';

type DateChipProps = {
 label: string;
};

export default function DateChip({ label }: DateChipProps) {
 return (
  <View style={styles.wrap}>
   <Text style={styles.text}>{label}</Text>
  </View>
 );
}
