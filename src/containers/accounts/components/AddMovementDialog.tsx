import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import styles from './AddMovementDialog.styles';

type Props = {
  visible: boolean;
  coinOptions: string[];
  onClose: () => void;
};

const OP_TYPES = ['deposito', 'retiro'] as const;

function formatToday() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export default function AddMovementDialog({ visible, coinOptions, onClose }: Props) {
  const [opTypeIndex, setOpTypeIndex] = useState(0);
  const [coinIndex, setCoinIndex] = useState(0);
  const [coinListVisible, setCoinListVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [observation, setObservation] = useState('');

  const opType = OP_TYPES[opTypeIndex] ?? OP_TYPES[0];
  const activeCoin = useMemo(() => coinOptions[coinIndex] ?? 'ARS', [coinIndex, coinOptions]);

  useEffect(() => {
    if (!coinOptions.length) return;
    const usdIndex = coinOptions.findIndex((coin) => coin === 'USD');
    setCoinIndex(usdIndex >= 0 ? usdIndex : 0);
  }, [coinOptions, visible]);

  const handleToggleType = () => {
    setOpTypeIndex((prev) => (prev + 1) % OP_TYPES.length);
  };

  const handleChangeCoin = () => setCoinListVisible((prev) => !prev);

  const handleSave = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <TouchableOpacity style={styles.typeRow} activeOpacity={0.8} onPress={handleToggleType}>
            <Text style={styles.typeText}>{opType}</Text>
            <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.typeIcon} />
          </TouchableOpacity>

          <View style={styles.fieldsWrap}>
            <View style={styles.bigRow}>
              <View style={styles.coinSide}>
                <TouchableOpacity onPress={handleChangeCoin} activeOpacity={0.8} style={styles.coinBtn}>
                  <View style={styles.coinInline}>
                    <Image source={getFilterFlagSourceByShortName(activeCoin)} style={styles.coinFlag} />
                    <Text style={styles.coinBtnText}>{activeCoin}</Text>
                  </View>
                </TouchableOpacity>
                {coinListVisible ? (
                  <View style={styles.coinListCard}>
                    <ScrollView style={styles.coinListScroll} nestedScrollEnabled>
                      {coinOptions.map((coin, index) => (
                        <TouchableOpacity
                          key={`${coin}-${index}`}
                          style={styles.coinListRow}
                          activeOpacity={0.8}
                          onPress={() => {
                            setCoinIndex(index);
                            setCoinListVisible(false);
                          }}
                        >
                          <Image source={getFilterFlagSourceByShortName(coin)} style={styles.coinListFlag} />
                          <Text style={styles.coinListText}>{coin}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
              <View style={styles.dottedDivider} />
              <Text style={styles.plusText}>{opType === 'retiro' ? '-' : '+'}</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder=""
                placeholderTextColor="#9892a8"
                keyboardType="decimal-pad"
                style={styles.amountInput}
              />
              <View style={styles.stateSide}>
                <View style={styles.stateBadge}>
                  <Image source={require('../../../../assets/images/ui/donesan.png')} style={styles.stateIcon} />
                </View>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Fecha</Text>
              <View style={styles.dottedDivider} />
              <View style={styles.fieldValueWrap}>
                <Text style={styles.fieldValueText}>{formatToday()}</Text>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Observación</Text>
              <View style={styles.dottedDivider} />
              <View style={styles.fieldValueWrap}>
                <TextInput
                  value={observation}
                  onChangeText={setObservation}
                  placeholder=""
                  placeholderTextColor="#9892a8"
                  style={styles.fieldInput}
                />
              </View>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.saveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
