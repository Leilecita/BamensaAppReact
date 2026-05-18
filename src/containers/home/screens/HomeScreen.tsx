import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useCoins } from '../../coins/hooks/useCoins';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { BASE_URL } from '../../../core/services/axiosClient';
import { getAppVariant } from '../../../core/theme/appVariant';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import AppDatePicker from '../../../core/components/AppDatePicker';
import AppTopBar from '../../../core/components/AppTopBar';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { AuthContext } from '../../../contexts/AuthContext';
import { dateHelper } from '../../../helpers/dateHelper';
import { flagHelper, getFlagSourceByShortName } from '../../../helpers/flagHelper';
import OperationCard from '../../operations/components/OperationCard';
import {
  affectClientOperationAndSync,
  deleteOperation,
  postOperation,
  ReportOperation,
  updateOperationObservation,
} from '../../operations/services/operationService';
import { useOperations } from '../../operations/hooks/useOperations';
import { changeStateItem } from '../../accounts/services/accountItemsOperationService';
import styles from './HomeScreen.styles';

type OperationState = typeof APP_CONSTANTS.STATE_DONE | typeof APP_CONSTANTS.STATE_PENDIENT;
type OperationType = typeof APP_CONSTANTS.TYPE_COMPRA | typeof APP_CONSTANTS.TYPE_VENTA;
type CoinCode = string;
type OperationPayload = {
  type: string;
  exchange: number;
  created: string;
  observation: string;
  account_id: number;
  user_id: number;
  in_coin_id: number;
  in_account_id: number;
  in_state: OperationState;
  amount_credit: number;
  out_coin_id: number;
  out_account_id: number;
  out_state: OperationState;
  amount_debit: number;
  nota: string;
  operation_id_ant: number;
};

export default function HomeScreen() {
  const appVariant = getAppVariant();
  const appTitle =
    appVariant === 'fisherton'
      ? APP_CONSTANTS.NAME_FISHERTON
      : appVariant === 'mendoza'
        ? APP_CONSTANTS.NAME_MENDOZA
        : APP_CONSTANTS.NAME_BAMENSA;
  const route = useRoute<RouteProp<AppStackParamList, 'home'>>();
  const { openMenu, navigateTo } = useSideMenu();
  const { userName, userId } = useContext(AuthContext);
  const { operations, loading, loadMore, loadingMore, error, reload } = useOperations();
  const [inAmount, setInAmount] = useState('');
  const [outAmount, setOutAmount] = useState('');
  const [exchangeValue, setExchangeValue] = useState('');
  const [operationType, setOperationType] = useState<OperationType>(APP_CONSTANTS.TYPE_COMPRA);
  const [inCoin, setInCoin] = useState<CoinCode>('USD');
  const [outCoin, setOutCoin] = useState<CoinCode>('ARS');
  const [coinPickerVisible, setCoinPickerVisible] = useState(false);
  const [coinPickerTarget, setCoinPickerTarget] = useState<'in' | 'out'>('in');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [confirmObservation, setConfirmObservation] = useState('');
  const [confirmDate, setConfirmDate] = useState('');
  const [confirmCreatedPayload, setConfirmCreatedPayload] = useState('');
  const [confirmDatePickerVisible, setConfirmDatePickerVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const [selectedAccountName, setSelectedAccountName] = useState('');
  const [affectIn, setAffectIn] = useState(false);
  const [affectOut, setAffectOut] = useState(false);
  const [lastEditedAmountField, setLastEditedAmountField] = useState<'in' | 'out'>('in');
  const [inState, setInState] = useState<OperationState>(APP_CONSTANTS.STATE_DONE);
  const [outState, setOutState] = useState<OperationState>(APP_CONSTANTS.STATE_DONE);
  const [affectConfirmVisible, setAffectConfirmVisible] = useState(false);
  const [affectConfirmType, setAffectConfirmType] = useState<'affect_in' | 'affect_out' | null>(null);
  const [listOptionsVisible, setListOptionsVisible] = useState(false);
  const [savingOperation, setSavingOperation] = useState(false);
  const { coins, loadingCoins, coinsError, reloadCoins } = useCoins();
  const inAmountRef = useRef<TextInput>(null);
  const outAmountRef = useRef<TextInput>(null);
  const exchangeRef = useRef<TextInput>(null);

  const windowHeight = Dimensions.get('window').height;
  const sheetHeight = Math.min(windowHeight * 0.64, 560);
  const sheetPeek = 90;

  const pairCoin1 = operationType === APP_CONSTANTS.TYPE_COMPRA ? inCoin : outCoin;
  const pairCoin2 = operationType === APP_CONSTANTS.TYPE_COMPRA ? outCoin : inCoin;

  const parseNumber = (value: string): number | null => {
    const normalized = value.trim().replace(',', '.');
    if (!normalized) return null;
    const n = Number(normalized);
    return Number.isFinite(n) ? n : null;
  };

  const formatNumber = (value: number) => {
    const rounded = Math.round((value + Number.EPSILON) * 100) / 100;
    return String(rounded);
  };

  const formatDialogOutAmount = (value: string) => {
    const parsed = parseNumber(value);
    if (parsed === null) return value || '0';
    return parsed.toFixed(1);
  };

  const buildOperationPayload = (obs: string, created: string): OperationPayload => {
    const noteParts: string[] = [];

    if (affectIn) {
      noteParts.push('*ACI');
    }
    if (affectOut) {
      noteParts.push('*ACO');
    }

    return {
      type: operationType,
      exchange: parseNumber(exchangeValue) ?? 0,
      created,
      observation: obs,
      account_id: selectedAccountId ?? APP_CONSTANTS.CUENTA_VARIOS,
      user_id: userId ?? 0,
      in_coin_id: flagHelper.getId(inCoin, coins),
      in_account_id: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
      in_state: inState,
      amount_credit: parseNumber(inAmount) ?? 0,
      out_coin_id: flagHelper.getId(outCoin, coins),
      out_account_id: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
      out_state: outState,
      amount_debit: parseNumber(outAmount) ?? 0,
      nota: noteParts.join(''),
      operation_id_ant: -1,
    };
  };

  const computeOutFromIn = (inText: string, exText: string): string => {
    const inN = parseNumber(inText);
    const exN = parseNumber(exText);
    if (inN === null || exN === null || exN === 0) return '';
    const result =
      operationType === APP_CONSTANTS.TYPE_COMPRA ? inN * exN : inN / exN;
    return Number.isFinite(result) ? formatNumber(result) : '';
  };

  const computeInFromOut = (outText: string, exText: string): string => {
    const outN = parseNumber(outText);
    const exN = parseNumber(exText);
    if (outN === null || exN === null || exN === 0) return '';
    const result =
      operationType === APP_CONSTANTS.TYPE_COMPRA ? outN / exN : outN * exN;
    return Number.isFinite(result) ? formatNumber(result) : '';
  };

  const handleInChange = (text: string) => {
    setLastEditedAmountField('in');
    setInAmount(text);
    setOutAmount(computeOutFromIn(text, exchangeValue));
  };

  const handleOutChange = (text: string) => {
    setLastEditedAmountField('out');
    setOutAmount(text);
    setInAmount(computeInFromOut(text, exchangeValue));
  };

  const handleExchangeChange = (text: string) => {
    setExchangeValue(text);

    if (lastEditedAmountField === 'in') {
      setOutAmount(computeOutFromIn(inAmount, text));
      return;
    }

    setInAmount(computeInFromOut(outAmount, text));
  };

  const handleCleanInputs = () => {
    setInAmount('');
    setOutAmount('');
    setExchangeValue('');
    setLastEditedAmountField('in');
    inAmountRef.current?.blur();
    outAmountRef.current?.blur();
    exchangeRef.current?.blur();
  };

  const checkCompleteInfo = () => {
    if (!inAmount.trim() || !outAmount.trim() || !exchangeValue.trim()) {
      return false;
    }

    const inNum = parseNumber(inAmount);
    const outNum = parseNumber(outAmount);
    const exNum = parseNumber(exchangeValue);

    return inNum !== null && outNum !== null && exNum !== null;
  };

  const checkOrder = () => {
    const out = outCoin.trim();
    const input = inCoin.trim();

    if ((out === 'ARS' || out === 'USD') && (input === 'ARS' || input === 'USD')) {
      if (operationType === APP_CONSTANTS.TYPE_VENTA && out !== 'USD') {
        return false;
      }

      if (operationType === APP_CONSTANTS.TYPE_COMPRA && input !== 'USD') {
        return false;
      }
    }

    return true;
  };

  const handlePressConfirm = () => {
    if (!checkCompleteInfo()) {
      Alert.alert(
        'Datos incompletos',
        'Completá monto entrada, monto salida y valor de cambio para continuar.'
      );
      return;
    }

    if (!checkOrder()) {
      Alert.alert(
        'Error en el orden de carga',
        'Si es una VENTA la moneda que sale debe ser USD. Si es una COMPRA la moneda que entra debe ser USD.'
      );
      return;
    }

    const actualPayloadDate = dateHelper.getActualDate(new Date());
    const actualDialogDate = dateHelper.getActualDateToShow(new Date());
    setConfirmCreatedPayload(actualPayloadDate);
    setConfirmDate(actualDialogDate);
    setConfirmObservation('');
    setConfirmDialogVisible(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogVisible(false);
    setConfirmDatePickerVisible(false);
  };

  const cleanAffectClient = () => {
    setAffectIn(false);
    setAffectOut(false);
  };

  const cleanSelectedAccount = () => {
    setSelectedAccountId(null);
    setSelectedAccountName('');
    cleanAffectClient();
  };

  const resetOperationStates = () => {
    setInState(APP_CONSTANTS.STATE_DONE);
    setOutState(APP_CONSTANTS.STATE_DONE);
  };

  const cleanAllFields = () => {
    handleCleanInputs();
    resetOperationStates();
    cleanSelectedAccount();

    setAffectConfirmVisible(false);
    setAffectConfirmType(null);
    setConfirmObservation('');
  };

  const handleConfirmDialogAccept = async () => {
    if (savingOperation) return;
    const operationPayload = buildOperationPayload(
      confirmObservation.trim(),
      confirmCreatedPayload || dateHelper.getActualDate(new Date())
    );
    setSavingOperation(true);
    try {
      await postOperation(operationPayload);
      setConfirmDialogVisible(false);
      cleanAllFields();
      await reload();
      Alert.alert('Listo', 'Operación guardada correctamente.');
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo guardar la operación');
    } finally {
      setSavingOperation(false);
    }
  };

  const handleToggleOperationType = () => {
    const hasUSD = coins.some((c) => c.short_name === 'USD');
    const hasARS = coins.some((c) => c.short_name === 'ARS');
    const defaultIn = hasUSD ? 'USD' : coins[0]?.short_name || 'USD';
    const defaultOut = hasARS ? 'ARS' : coins[1]?.short_name || coins[0]?.short_name || 'ARS';

    if (operationType === APP_CONSTANTS.TYPE_COMPRA) {
      setOperationType(APP_CONSTANTS.TYPE_VENTA);
      setInCoin(defaultOut);
      setOutCoin(defaultIn);
    } else {
      setOperationType(APP_CONSTANTS.TYPE_COMPRA);
      setInCoin(defaultIn);
      setOutCoin(defaultOut);
    }
    setLastEditedAmountField('in');
    handleCleanInputs();
  };

  const openCoinPicker = (target: 'in' | 'out') => {
    setCoinPickerTarget(target);
    setCoinPickerVisible(true);
  };

  const closeCoinPicker = () => {
    setCoinPickerVisible(false);
  };

  const getFirstDifferentCoin = (excluded: string) => {
    const firstDifferent = coins.find((c) => c.short_name !== excluded)?.short_name;
    return firstDifferent ?? excluded;
  };

  const handleSelectCoin = (selected: string) => {
    if (coinPickerTarget === 'in') {
      setInCoin(selected);
      if (selected === outCoin && coins.length > 1) {
        setOutCoin(getFirstDifferentCoin(selected));
      }
    } else {
      setOutCoin(selected);
      if (selected === inCoin && coins.length > 1) {
        setInCoin(getFirstDifferentCoin(selected));
      }
    }
    closeCoinPicker();
  };

  useEffect(() => {
    const accountId = route.params?.selectedAccount?.id;
    const accountName = route.params?.selectedAccount?.name?.trim();
    if (typeof accountId === 'number') {
      setSelectedAccountId(accountId);
    }
    if (accountName) {
      setSelectedAccountName(accountName);
    }
  }, [route.params?.selectedAccount?.id, route.params?.selectedAccount?.name]);

  const handleClearSelectedAccount = () => {
    cleanSelectedAccount();
  };

  const handleToggleAffectIn = () => {
    if (!selectedAccountId) return;
    if (inState === APP_CONSTANTS.STATE_PENDIENT) {
      Alert.alert('Operación pendiente', 'No puede afectar a un cliente si la operación de entrada está pendiente.');
      return;
    }
    if (affectIn) {
      setAffectIn(false);
      return;
    }
    setAffectConfirmType('affect_in');
    setAffectConfirmVisible(true);
  };

  const handleToggleAffectOut = () => {
    if (!selectedAccountId) return;
    if (outState === APP_CONSTANTS.STATE_PENDIENT) {
      Alert.alert('Operación pendiente', 'No puede afectar a un cliente si la operación de salida está pendiente.');
      return;
    }
    if (affectOut) {
      setAffectOut(false);
      return;
    }
    setAffectConfirmType('affect_out');
    setAffectConfirmVisible(true);
  };

  const closeAffectConfirm = () => {
    setAffectConfirmVisible(false);
    setAffectConfirmType(null);
  };

  const handleAcceptAffectConfirm = () => {
    if (affectConfirmType === 'affect_in') {
      setAffectIn(true);
    }
    if (affectConfirmType === 'affect_out') {
      setAffectOut(true);
    }
    closeAffectConfirm();
  };

  const handleDeleteOperation = async (operation: ReportOperation) => {
    try {
      await deleteOperation(operation.operation_id);
      await reload();
      Alert.alert('Listo', 'Se ha eliminado la operación');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar la operación');
    }
  };

  const handleChangeItemState = async ({ itemId, nextState }: { itemId: number; nextState: string }) => {
    await changeStateItem(itemId, nextState);
  };

  const handleUpdateOperation = async ({
    operation,
    observation,
  }: {
    operation: ReportOperation;
    observation: string;
  }) => {
    await updateOperationObservation({
      id: operation.operation_id,
      observation,
      nota: operation.nota ?? '',
    });
  };

  const handleAffectClient = async ({
    operation,
    side,
  }: {
    operation: ReportOperation;
    side: 'in' | 'out';
  }) => {
    if (!userId) {
      throw new Error('No se pudo identificar el usuario actual.');
    }

    await affectClientOperationAndSync({
      operation,
      side,
      userId,
    });
    await reload();
  };

  useEffect(() => {
    if (!coins.length) return;
    flagHelper.setCoins(coins);
    const usd = coins.find((c) => c.short_name === 'USD')?.short_name;
    const ars = coins.find((c) => c.short_name === 'ARS')?.short_name;

    if (!usd && !ars) {
      setInCoin(coins[0].short_name);
      setOutCoin(coins[1]?.short_name || coins[0].short_name);
      return;
    }

    setInCoin(usd || coins[0].short_name);
    setOutCoin(ars || coins[1]?.short_name || coins[0].short_name);
  }, [coins]);

  return (
    <View style={styles.screen}>
      <AppTopBar title={appTitle} leftSymbol="☰" onPressLeft={openMenu} />
      <View style={styles.optionsMenuWrap}>
        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setListOptionsVisible((prev) => !prev)}
          activeOpacity={0.85}
        >
          <Image source={require('../../../../assets/images/ui/optsan.png')} style={styles.optionsButtonIcon} />
        </TouchableOpacity>

        {listOptionsVisible ? (
          <View style={styles.optionsList}>
            <TouchableOpacity
              style={styles.optionsListItem}
              activeOpacity={0.85}
              onPress={() => {
                setListOptionsVisible(false);
                navigateTo('operations');
              }}
            >
              <Text style={styles.optionsListItemText}>Operaciones</Text>
              <Image source={require('../../../../assets/images/ui/logo55.png')} style={styles.optionsListItemIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsListItem}
              activeOpacity={0.85}
              onPress={() => {
                setListOptionsVisible(false);
                navigateTo('outcomes');
              }}
            >
              <Text style={styles.optionsListItemText}>Gastos</Text>
              <Image source={require('../../../../assets/images/ui/logo55.png')} style={styles.optionsListItemIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsListItem}
              activeOpacity={0.85}
              onPress={() => {
                setListOptionsVisible(false);
                Alert.alert('Caja F', 'Pantalla pendiente en React Native.');
              }}
            >
              <Text style={styles.optionsListItemText}>Caja F</Text>
              <Image source={require('../../../../assets/images/ui/logo55.png')} style={styles.optionsListItemIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsListItem}
              activeOpacity={0.85}
              onPress={() => {
                setListOptionsVisible(false);
                Alert.alert('Caja', 'Pantalla pendiente en React Native.');
              }}
            >
              <Text style={styles.optionsListItemText}>Caja</Text>
              <Image source={require('../../../../assets/images/ui/logo55.png')} style={styles.optionsListItemIcon} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerHalfLeft} onPress={handleToggleOperationType} activeOpacity={0.8}>
            <Text style={styles.operationType}>{operationType}</Text>
            <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.arrowDownIcon} />
          </TouchableOpacity>
          <View style={styles.headerHalfRight}>
            <Text style={styles.coinPair}>
              {pairCoin1} con {pairCoin2}
            </Text>
          </View>
        </View>

        <View style={styles.formArea}>
          <View style={styles.verticalGuide} />

          <View style={styles.cardFrame}>
            <View style={styles.cardLine}>
              <TouchableOpacity
                style={styles.cardSectionLeft}
                onPress={() => openCoinPicker('in')}
                activeOpacity={0.8}
              >
                <View style={styles.coinInline}>
                  {getFlagSourceByShortName(inCoin) ? (
                    <Image source={getFlagSourceByShortName(inCoin)!} style={styles.coinFlag} />
                  ) : null}
                  <Text style={styles.coinLabel}>{inCoin}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.centerGutter} />
              <View style={styles.operatorWrap}>
                <Text style={styles.operator}>+</Text>
              </View>
              <View style={styles.cardSectionRight}>
                <TextInput
                  ref={inAmountRef}
                  style={styles.inputMock}
                  value={inAmount}
                  onChangeText={handleInChange}
                  keyboardType="decimal-pad"
                  placeholder=""
                  placeholderTextColor="#b9b6be"
                />
              </View>
              <View style={styles.stateWrap}>
                <TouchableOpacity
                  style={styles.statePill}
                  activeOpacity={0.8}
                  onPress={() =>
                    setInState((prev) =>
                      prev === APP_CONSTANTS.STATE_PENDIENT
                        ? APP_CONSTANTS.STATE_DONE
                        : APP_CONSTANTS.STATE_PENDIENT
                    )
                  }
                >
                  <Image
                    source={
                      inState === APP_CONSTANTS.STATE_PENDIENT
                        ? require('../../../../assets/images/ui/pendsan.png')
                        : require('../../../../assets/images/ui/donesan.png')
                    }
                    style={styles.stateImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {selectedAccountId ? (
              <TouchableOpacity
                style={[styles.affectBubble, styles.affectBubbleIn]}
                onPress={handleToggleAffectIn}
                activeOpacity={0.85}
              >
                <Image
                  source={
                    affectIn
                      ? require('../../../../assets/images/ui/saleccliente2.png')
                      : require('../../../../assets/images/ui/salecliente.png')
                  }
                  style={styles.affectBubbleImg}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.middleRowWrap}>
            <View style={styles.middleRow}>
              <View style={styles.middleLeft}>
                <Image source={require('../../../../assets/images/ui/arrdownsan.png')} style={styles.midArrowImg} />
              </View>
              <View style={styles.centerGutter} />
              <View style={styles.middleRight}>
                <Image source={require('../../../../assets/images/ui/arrowupsan.png')} style={styles.midArrowImg} />
                <TextInput
                  ref={exchangeRef}
                  style={styles.exchangeInputMock}
                  value={exchangeValue}
                  onChangeText={handleExchangeChange}
                  keyboardType="decimal-pad"
                  placeholder=""
                  placeholderTextColor="#b9b6be"
                />
              </View>
            </View>
          </View>

          <View style={styles.cardFrame}>
            <View style={styles.cardLine}>
              <TouchableOpacity
                style={styles.cardSectionLeft}
                onPress={() => openCoinPicker('out')}
                activeOpacity={0.8}
              >
                <View style={styles.coinInline}>
                  {getFlagSourceByShortName(outCoin) ? (
                    <Image source={getFlagSourceByShortName(outCoin)!} style={styles.coinFlag} />
                  ) : null}
                  <Text style={styles.coinLabel}>{outCoin}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.centerGutter} />
              <View style={styles.operatorWrap}>
                <Text style={styles.operator}>−</Text>
              </View>
              <View style={styles.cardSectionRight}>
                <TextInput
                  ref={outAmountRef}
                  style={styles.inputMock}
                  value={outAmount}
                  onChangeText={handleOutChange}
                  keyboardType="decimal-pad"
                  placeholder=""
                  placeholderTextColor="#b9b6be"
                />
              </View>
              <View style={styles.stateWrap}>
                <TouchableOpacity
                  style={styles.statePill}
                  activeOpacity={0.8}
                  onPress={() =>
                    setOutState((prev) =>
                      prev === APP_CONSTANTS.STATE_PENDIENT
                        ? APP_CONSTANTS.STATE_DONE
                        : APP_CONSTANTS.STATE_PENDIENT
                    )
                  }
                >
                  <Image
                    source={
                      outState === APP_CONSTANTS.STATE_PENDIENT
                        ? require('../../../../assets/images/ui/pendsan.png')
                        : require('../../../../assets/images/ui/donesan.png')
                    }
                    style={styles.stateImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {selectedAccountId ? (
              <TouchableOpacity
                style={[styles.affectBubble, styles.affectBubbleOut]}
                onPress={handleToggleAffectOut}
                activeOpacity={0.85}
              >
                <Image
                  source={
                    affectOut
                      ? require('../../../../assets/images/ui/entraccliente.png')
                      : require('../../../../assets/images/ui/entraccliente2.png')
                  }
                  style={styles.affectBubbleImg}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={styles.cleanRateRow}>
          <View style={styles.cleanSide}>
            <TouchableOpacity onPress={handleCleanInputs} activeOpacity={0.8} style={styles.cleanButton}>
              <Image source={require('../../../../assets/images/ui/limpiar.png')} style={styles.cleanImg} />
            </TouchableOpacity>
          </View>
          <View style={styles.rateSide}>
            <View style={styles.rateTextRow}>
              <Text style={styles.rateText}>
                {pairCoin1} 1 = {pairCoin2}{' '}
              </Text>
              <Text style={styles.rateValueText}>{exchangeValue || '1'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.confirmRow}>
          <View style={[styles.clientGhost, selectedAccountId ? styles.clientGhostSelected : null]}>
            <View style={[styles.clientBox, selectedAccountId ? styles.clientBoxSelected : null]}>
              <Text style={styles.clientGhostText} numberOfLines={2}>
                {selectedAccountName}
              </Text>
              {selectedAccountId ? (
                <TouchableOpacity
                  style={styles.clearClientBtn}
                  activeOpacity={0.8}
                  onPress={handleClearSelectedAccount}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.clearClientText}>x</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={handlePressConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmText}>confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.fabColumn}>
        <TouchableOpacity style={styles.fab} onPress={() => navigateTo('accounts')} activeOpacity={0.8}>
          <Image source={require('../../../../assets/images/ui/addpersonsan.png')} style={styles.fabImg} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} onPress={() => navigateTo('createAccount')} activeOpacity={0.8}>
          <Image source={require('../../../../assets/images/ui/addaccount.png')} style={styles.fabImg} />
        </TouchableOpacity>
      </View>

      {__DEV__ ? (
        <View style={styles.devBaseUrlWrap}>
          <Text style={styles.devBaseUrlText}>{BASE_URL}</Text>
        </View>
      ) : null}

      <AppBottomSheet
        height={sheetHeight}
        peekHeight={sheetPeek}
        arrowSource={require('../../../../assets/images/ui/arrowsan.png')}
        dragOn="both"
        disableBodyDragWhenExpanded
        containerStyle={styles.sheet}
        bodyStyle={styles.sheetBody}
      >
        {error ? (
          <View style={styles.center}>
            <Text style={styles.errorTitle}>No se pudieron cargar las operaciones</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={reload} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={operations}
            keyExtractor={(item) => item.operation_id.toString()}
            renderItem={({ item }) => (
              <OperationCard
                operation={item}
                onDeleteOperation={handleDeleteOperation}
                onChangeItemState={handleChangeItemState}
                onUpdateOperation={handleUpdateOperation}
                onAffectClient={handleAffectClient}
              />
            )}
            onEndReached={loadMore}
            onEndReachedThreshold={0.45}
            contentContainerStyle={styles.sheetListContent}
            ListEmptyComponent={
              <View style={styles.emptyWrap}>
                {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
                <Text style={styles.emptyText}>
                  {loading ? 'Cargando operaciones...' : 'No hay operaciones para mostrar.'}
                </Text>
              </View>
            }
            ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
          />
        )}
      </AppBottomSheet>

      <Modal
        visible={confirmDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseConfirmDialog}
      >
        <Pressable style={styles.confirmDialogBackdrop} onPress={handleCloseConfirmDialog}>
          <Pressable style={styles.confirmDialogCard} onPress={() => { }}>
            <View style={styles.confirmDialogHeader}>
              <Text style={styles.confirmDialogType}>{operationType.toUpperCase()}</Text>
            </View>

            <View style={styles.confirmDialogBody}>
              <View style={styles.confirmSummaryCard}>
                <View style={styles.confirmSummaryCol}>
                  <Text style={styles.confirmSummaryMain}>
                    <Text style={styles.confirmSummaryCode}>{inCoin} </Text>
                    <Text style={styles.confirmSummaryNumber}>{inAmount || '0'}</Text>
                  </Text>
                  <View style={styles.confirmSummarySubRowLeft}>
                    {inState === APP_CONSTANTS.STATE_PENDIENT ? (
                      <Image
                        source={require('../../../../assets/images/ui/pendsan.png')}
                        style={styles.confirmSummaryStateInline}
                      />
                    ) : null}
                    <Text style={[styles.confirmSummarySub, styles.confirmSummarySubLeftText]}>
                      {selectedAccountName?.trim() || 'Varios'}
                    </Text>
                  </View>
                </View>
                <Image
                  source={
                    operationType === APP_CONSTANTS.TYPE_COMPRA
                      ? require('../../../../assets/images/ui/log8.png')
                      : require('../../../../assets/images/ui/log9.png')
                  }
                  style={styles.confirmSummaryArrowImg}
                />
                <View style={styles.confirmSummaryColRight}>
                  <Text style={styles.confirmSummaryMain}>
                    <Text style={styles.confirmSummaryCode}>{outCoin} </Text>
                    <Text style={styles.confirmSummaryNumber}>{formatDialogOutAmount(outAmount)}</Text>
                  </Text>
                  <View style={styles.confirmSummarySubRowRight}>
                    <Text style={[styles.confirmSummarySub, styles.confirmSummarySubRightText]}>
                      {pairCoin1} 1 = {pairCoin2} {exchangeValue || '1'}
                    </Text>
                    {outState === APP_CONSTANTS.STATE_PENDIENT ? (
                      <Image
                        source={require('../../../../assets/images/ui/pendsan.png')}
                        style={styles.confirmSummaryStateInline}
                      />
                    ) : null}
                  </View>
                </View>

                {affectIn ? (
                  <View style={styles.confirmAffectInWrap}>
                    <Image
                      source={require('../../../../assets/images/ui/saleccliente2.png')}
                      style={styles.confirmAffectIcon}
                    />
                  </View>
                ) : null}

                {affectOut ? (
                  <View style={styles.confirmAffectOutWrap}>
                    <Image
                      source={require('../../../../assets/images/ui/entraccliente.png')}
                      style={styles.confirmAffectIcon}
                    />
                  </View>
                ) : null}
              </View>

              <View style={styles.confirmMetaRow}>
                <View style={styles.confirmMetaIconCol}>
                  <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.confirmMetaIcon} />
                </View>
                <View style={styles.confirmMetaContent}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => setConfirmDatePickerVisible(true)}>
                    <Text style={styles.confirmMetaText}>{confirmDate}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.confirmMetaRow}>
                <View style={styles.confirmMetaIconCol}>
                  <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.confirmMetaIcon} />
                </View>
                <View style={styles.confirmMetaContent}>
                  <Text style={styles.confirmMetaText}>{userName || '-'}</Text>
                </View>
              </View>

              <View style={styles.confirmMetaRow}>
                <View style={styles.confirmMetaIconCol}>
                  <Image source={require('../../../../assets/images/ui/documento.png')} style={styles.confirmMetaIcon} />
                </View>
                <View style={styles.confirmMetaContent}>
                  <TextInput
                    value={confirmObservation}
                    onChangeText={setConfirmObservation}
                    placeholder="agregar observacion"
                    placeholderTextColor="#8f8f97"
                    style={styles.confirmDialogObsInput}
                  />
                </View>
              </View>
            </View>

            <View style={styles.confirmDialogActions}>
              <TouchableOpacity onPress={handleCloseConfirmDialog} style={styles.confirmDialogCancel}>
                <Text style={styles.confirmDialogCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmDialogAccept}
                style={styles.confirmDialogAccept}
                disabled={savingOperation}
              >
                <Text style={styles.confirmDialogAcceptText}>
                  {savingOperation ? 'Guardando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <AppDatePicker
        visible={confirmDatePickerVisible}
        value={new Date()}
        onCancel={() => setConfirmDatePickerVisible(false)}
        onConfirm={(selectedDate) => {
          const time = dateHelper.getOnlyTime(dateHelper.getActualDate(new Date())) || '00:00:00';
          const yyyy = String(selectedDate.getFullYear());
          const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
          const dd = String(selectedDate.getDate()).padStart(2, '0');
          const nextPayload = `${yyyy}-${mm}-${dd} ${time}`;

          setConfirmCreatedPayload(nextPayload);
          setConfirmDate(dateHelper.getActualDateToShow(new Date(nextPayload.replace(' ', 'T'))));
          setConfirmDatePickerVisible(false);
        }}
      />

      <Modal visible={coinPickerVisible} transparent animationType="fade" onRequestClose={closeCoinPicker}>
        <Pressable style={styles.coinPickerBackdrop} onPress={closeCoinPicker}>
          <Pressable
            style={[
              styles.coinPickerCard,
              coinPickerTarget === 'in' ? styles.coinPickerCardIn : styles.coinPickerCardOut,
            ]}
            onPress={() => { }}
          >
            <FlatList
              data={coins}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.coinPickerEmpty}>
                  {loadingCoins ? <ActivityIndicator size="small" color="#6f6392" /> : null}
                  <Text style={styles.coinPickerEmptyText}>
                    {loadingCoins
                      ? 'Cargando monedas...'
                      : coinsError
                        ? 'No se pudieron cargar las monedas'
                        : 'No hay monedas para mostrar'}
                  </Text>
                  {coinsError ? <Text style={styles.coinPickerErrorDetail}>{coinsError}</Text> : null}
                  {coinsError ? (
                    <TouchableOpacity style={styles.coinPickerRetryBtn} onPress={reloadCoins} activeOpacity={0.8}>
                      <Text style={styles.coinPickerRetryText}>Reintentar</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.coinPickerRow}
                  activeOpacity={0.8}
                  onPress={() => handleSelectCoin(item.short_name)}
                >
                  {getFlagSourceByShortName(item.short_name) ? (
                    <Image source={getFlagSourceByShortName(item.short_name)} style={styles.coinPickerFlag} />
                  ) : null}
                  <Text style={styles.coinPickerText}>{item.short_name}</Text>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={affectConfirmVisible} transparent animationType="fade" onRequestClose={closeAffectConfirm}>
        <Pressable style={styles.affectConfirmBackdrop} onPress={closeAffectConfirm}>
          <Pressable style={styles.affectConfirmCard} onPress={() => { }}>
            <Text style={styles.affectConfirmTitle}>Afecta cliente</Text>
            <Text style={styles.affectConfirmText}>
              {affectConfirmType === 'affect_in' ? (
                <>
                  {'Se efectuará el '}
                  <Text style={styles.affectConfirmTextStrong}>{`retiro de ${inAmount || '0'} ${inCoin}`}</Text>
                  {' de la cuenta del cliente luego de confirmar la operación.'}
                </>
              ) : (
                <>
                  {'Se efectuará el '}
                  <Text style={styles.affectConfirmTextStrong}>{`depósito de ${outAmount || '0'} ${outCoin}`}</Text>
                  {' en la cuenta del cliente luego de confirmar la operación.'}
                </>
              )}
            </Text>

            <View style={styles.affectConfirmActions}>
              <TouchableOpacity style={styles.affectConfirmCancelBtn} onPress={closeAffectConfirm} activeOpacity={0.8}>
                <Text style={styles.affectConfirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.affectConfirmOkBtn} onPress={handleAcceptAffectConfirm} activeOpacity={0.8}>
                <Text style={styles.affectConfirmOkText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
}
