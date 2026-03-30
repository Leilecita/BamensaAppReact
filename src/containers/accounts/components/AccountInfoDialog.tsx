import React from 'react';
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import styles from './AccountInfoDialog.styles';

export type AccountInfoRow = {
 label: string;
 value: string;
};

type Props = {
 visible: boolean;
 rows: AccountInfoRow[];
 onClose: () => void;
};

export default function AccountInfoDialog({ visible, rows, onClose }: Props) {
 return (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
   <Pressable style={styles.infoBackdrop} onPress={onClose}>
    <Pressable style={styles.infoCard} onPress={() => {}}>
     <Text style={styles.infoTitle}>Información cuenta</Text>

     <View style={styles.infoTable}>
      {rows.map((row) => (
       <View key={row.label} style={styles.infoRow}>
        <Text style={styles.infoLabel}>{`${row.label} `}</Text>
        <View style={styles.infoDivider} />
        <Text style={styles.infoValue}>{row.value}</Text>
       </View>
      ))}
     </View>

     <View style={styles.infoActionsRow}>
      <TouchableOpacity activeOpacity={0.8}>
       <Image source={require('../../../../assets/images/ui/editsan.png')} style={styles.infoActionIcon} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.8}>
       <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.infoActionIcon} />
      </TouchableOpacity>
     </View>
    </Pressable>
   </Pressable>
  </Modal>
 );
}

