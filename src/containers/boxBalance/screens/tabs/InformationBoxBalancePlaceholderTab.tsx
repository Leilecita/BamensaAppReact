import React from 'react';
import { Text, View } from 'react-native';
import styles from '../InformationBoxBalanceScreen.styles';

type Props = {
 title: string;
 description: string;
};

export default function InformationBoxBalancePlaceholderTab({ title, description }: Props) {
 return (
  <View style={styles.placeholderWrap}>
   <Text style={styles.placeholderTitle}>{title}</Text>
   <Text style={styles.placeholderText}>{description}</Text>
  </View>
 );
}
