import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import AppDatePicker from '../../../core/components/AppDatePicker';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import api from '../../../core/services/axiosClient';
import { AuthContext } from '../../../contexts/AuthContext';
import { dateHelper } from '../../../helpers/dateHelper';
import { getFilterFlagSourceByShortName } from '../../../helpers/flagHelper';
import {
  saveInversaOperationInBamensaOriginalApp,
  createMovement,
  shouldApplyFishertonMirrorRule,
} from '../services/accountMovementService';
import styles from './AddMovementDialog.styles';

type CoinOption = {
  id: number;
  shortName: string;
};

type Props = {
  visible: boolean;
  accountId: number;
  coinOptions: string[];
  coinsCatalog: CoinOption[];
  onClose: () => void;
  onSaved?: (payload: { coinId: number; coinShortName: string }) => Promise<void> | void;
};

const OP_TYPES = [APP_CONSTANTS.TYPE_DEPOSITO, APP_CONSTANTS.TYPE_RETIRO] as const;

const toDate = (value?: string): Date => {
  if (!value) return new Date();
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;
  const normalized = new Date(String(value).replace(' ', 'T'));
  if (!Number.isNaN(normalized.getTime())) return normalized;
  return new Date();
};

export default function AddMovementDialog({
  visible,
  accountId,
  coinOptions,
  coinsCatalog,
  onClose,
  onSaved,
}: Props) {
  const { userId } = useContext(AuthContext);
  const [opTypeIndex, setOpTypeIndex] = useState(0);
  const [coinIndex, setCoinIndex] = useState(0);
  const [coinListVisible, setCoinListVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [observation, setObservation] = useState('');
  const [created, setCreated] = useState(() => dateHelper.getActualDate());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [state, setState] = useState<typeof APP_CONSTANTS.STATE_DONE | typeof APP_CONSTANTS.STATE_PENDIENT>(
    APP_CONSTANTS.STATE_DONE,
  );
  const [saving, setSaving] = useState(false);
  const amountInputRef = React.useRef<TextInput>(null);

  const opType = OP_TYPES[opTypeIndex] ?? OP_TYPES[0];
  const activeCoin = useMemo(() => coinOptions[coinIndex] ?? 'ARS', [coinIndex, coinOptions]);

  const isFishertonSpecial = useMemo(() => {
    return shouldApplyFishertonMirrorRule(api.defaults.baseURL, accountId);
  }, [accountId]);

  useEffect(() => {
    if (!coinOptions.length) return;
    const usdIndex = coinOptions.findIndex((coin) => coin === 'USD');
    setCoinIndex(usdIndex >= 0 ? usdIndex : 0);
    setOpTypeIndex(0);
    setAmount('');
    setObservation('');
    setCreated(dateHelper.getActualDate());
    setDatePickerVisible(false);
    setState(APP_CONSTANTS.STATE_DONE);
    setCoinListVisible(false);
  }, [coinOptions, visible]);

  const handleToggleType = () => {
    setOpTypeIndex((prev) => (prev + 1) % OP_TYPES.length);
  };

  const handleChangeCoin = () => {
    setCoinListVisible((prev) => {
      const nextVisible = !prev;
      if (nextVisible) {
        Keyboard.dismiss();
      }
      return nextVisible;
    });
  };

  const handleSave = async () => {
    const numericAmount = Number(amount.trim().replace(',', '.'));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Dato inválido', 'Ingresá un monto mayor a 0.');
      return;
    }

    const selectedCoinId =
      coinsCatalog.find((coin) => coin.shortName === activeCoin)?.id ?? 0;

    if (!selectedCoinId) {
      Alert.alert('Moneda inválida', 'No se pudo identificar la moneda seleccionada.');
      return;
    }

    setSaving(true);
    try {
      console.log('[AddMovementDialog] device now', new Date().toString());
      console.log('[AddMovementDialog] helper actual date', dateHelper.getActualDate());
      console.log('[AddMovementDialog] created state', created);

      const payload = {
        type: opType,
        coinId: selectedCoinId,
        amount: numericAmount,
        observation: observation.trim(),
        created: created.trim(),
        accountId,
        userId: userId ?? 0,
        state,
      };

      console.log('[AddMovementDialog] payload', payload);

      await createMovement(payload);

      if (isFishertonSpecial) {
        await saveInversaOperationInBamensaOriginalApp(payload);
      }

      await onSaved?.({ coinId: selectedCoinId, coinShortName: activeCoin });
      onClose();
    } catch (e: any) {
      Alert.alert('Error al guardar', e?.message || 'No se pudo guardar el movimiento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppDialog
      visible={visible}
      onClose={onClose}
      keyboardAware
      keyboardGap={14}
      backdropStyle={styles.backdrop}
      cardStyle={styles.card}
    >
      <TouchableOpacity style={styles.typeRow} activeOpacity={0.8} onPress={handleToggleType}>
        <Text style={styles.typeText}>{opType}</Text>
        <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.typeIcon} />
      </TouchableOpacity>

      {isFishertonSpecial ? <Text style={styles.onlyFishertonNote}>Solo Fisherton</Text> : null}

      <View style={styles.fieldsWrap}>
        <View style={[styles.bigRow, coinListVisible ? styles.bigRowOpen : null]}>
          <View style={[styles.coinSide, coinListVisible ? styles.coinSideOpen : null]}>
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
                        requestAnimationFrame(() => {
                          amountInputRef.current?.focus();
                        });
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
          <Text style={styles.plusText}>{opType === APP_CONSTANTS.TYPE_RETIRO ? '-' : '+'}</Text>
          <TextInput
            ref={amountInputRef}
            value={amount}
            onChangeText={setAmount}
            placeholder=""
            placeholderTextColor="#9892a8"
            keyboardType="decimal-pad"
            style={styles.amountInput}
          />
          <View style={styles.stateSide}>
            <TouchableOpacity style={styles.stateBadge} activeOpacity={0.8} onPress={() => setState((prev) => (prev === APP_CONSTANTS.STATE_PENDIENT ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT))}>
              <Image
                source={
                  state === APP_CONSTANTS.STATE_PENDIENT
                    ? require('../../../../assets/images/ui/pendsan.png')
                    : require('../../../../assets/images/ui/donesan.png')
                }
                style={styles.stateIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.fieldRow} activeOpacity={0.8} onPress={() => setDatePickerVisible(true)}>
          <Text style={styles.fieldLabel}>Fecha</Text>
          <View style={styles.dottedDivider} />
          <View style={styles.fieldValueWrap}>
            <Text style={styles.fieldValueText}>{dateHelper.onlyDate(dateHelper.changeFormatDate(created))}</Text>
          </View>
        </TouchableOpacity>

        {!isFishertonSpecial ? (
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
        ) : null}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8} disabled={saving}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Guardar</Text>}
        </TouchableOpacity>
      </View>

      <AppDatePicker
        visible={datePickerVisible}
        value={toDate(created)}
        onCancel={() => setDatePickerVisible(false)}
        onConfirm={(nextDate) => {
          const time = dateHelper.getOnlyTime(dateHelper.getActualDate()) || '00:00:00';
          const yyyy = nextDate.getFullYear();
          const month = String(nextDate.getMonth() + 1).padStart(2, '0');
          const day = String(nextDate.getDate()).padStart(2, '0');
          const selectedDate = `${yyyy}-${month}-${day} ${time}`;
          setCreated(selectedDate);
          setDatePickerVisible(false);
        }}
      />
    </AppDialog>
  );
}
