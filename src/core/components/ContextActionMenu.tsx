import React from 'react';
import { Modal, Pressable, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';

type MenuItem = {
 label: string;
 onPress: () => void;
};

type Props = {
 visible: boolean;
 top: number;
 left?: number;
 onClose: () => void;
 items: MenuItem[];
 cardStyle?: StyleProp<ViewStyle>;
 itemStyle?: StyleProp<ViewStyle>;
 textStyle?: StyleProp<TextStyle>;
};

export default function ContextActionMenu({
 visible,
 top,
 left = 0,
 onClose,
 items,
 cardStyle,
 itemStyle,
 textStyle,
}: Props) {
 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.backdrop} onPress={onClose}>
    <Pressable style={[styles.card, { top, left }, cardStyle]} onPress={() => { }}>
     {items.map((item) => (
      <TouchableOpacity
       key={item.label}
       style={[styles.item, itemStyle]}
       activeOpacity={0.8}
       onPress={() => {
        onClose();
        item.onPress();
       }}
      >
       <Text style={[styles.text, textStyle]}>{item.label}</Text>
      </TouchableOpacity>
     ))}
    </Pressable>
   </Pressable>
  </Modal>
 );
}

const styles = StyleSheet.create({
 backdrop: {
  flex: 1,
  backgroundColor: 'transparent',
 },
 card: {
  position: 'absolute',
  width: 170,
  minHeight: 116,
  borderRadius: 10,
  backgroundColor: COLORS.white,
  paddingVertical: 2,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  elevation: 8,
 },
 item: {
  minHeight: 56,
  justifyContent: 'center',
  paddingHorizontal: 22,
 },
 text: {
  color: COLORS.colorPrimaryIntLetter,
  fontSize: 21,
  fontFamily: 'OpenSansRegular',
 },
});
