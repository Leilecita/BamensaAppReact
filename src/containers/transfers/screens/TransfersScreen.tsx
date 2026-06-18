import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import AppDialog from '../../../core/components/AppDialog';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { useToast } from '../../../core/feedback/ToastContext';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { dateHelper } from '../../../helpers/dateHelper';
import { fetchAccounts, fetchSimpleAccounts, ReportAccount } from '../../accounts/services/accountService';
import ChangeStateItemDialog from '../../accounts/components/ChangeStateItemDialog';
import { changeStateItem, ReportItemOperation } from '../../accounts/services/accountItemsOperationService';
import { useCoins } from '../../coins/hooks/useCoins';
import { Coin } from '../../coins/services/coinService';
import { deleteOperation } from '../../operations/services/operationService';
import TransferCreateConfirmDialog from '../components/TransferCreateConfirmDialog';
import TransferDeleteOperationDialog from '../components/TransferDeleteOperationDialog';
import TransferInfoDialog from '../components/TransferInfoDialog';
import { useTransfers } from '../hooks/useTransfers';
import { createTransfer, ReportTransfer, ReportItemTransfer } from '../services/transferService';
import { getFilterFlagSourceByShortName, getFlagSourceByShortName } from '../../../helpers/flagHelper';
import styles from './TransfersScreen.styles';

type TransferType = 'emitida' | 'recibida';
type InputMethod = 'percent' | 'amount';
type PickerTarget = 'coin' | 'account1' | 'account2' | 'commission1' | 'commission2';
type PickerAnchor = { x: number; y: number; width: number; height: number };
type OperationState = typeof APP_CONSTANTS.STATE_DONE | typeof APP_CONSTANTS.STATE_PENDIENT;

const DEFAULT_CASH_ACCOUNT: ReportAccount = {
  account: {
    id: APP_CONSTANTS.CUENTA_CAJA_GENERAL,
    firstName: APP_CONSTANTS.CUENTA_CAJA_GENERAL_NOMBRE,
    lastName: '',
    name: APP_CONSTANTS.CUENTA_CAJA_GENERAL_NOMBRE,
    category: APP_CONSTANTS.CATEGORY_PERSONAL,
    color: '#9D92B6',
    phone: '',
    protectedAccount: 'true',
  },
  balance: [],
  raw: null,
};

const parseDecimal = (value: string) => {
  const parsed = Number(String(value).replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatAmountDisplay = (value: number) => String(Math.round(Number(value || 0)));

const formatReportAmount = (item: ReportItemTransfer) => {
  const value = item.debit > 0 ? item.debit : item.credit;
  return Math.trunc(Number(value || 0)).toLocaleString('en-US');
};

const getReportSign = (item: ReportItemTransfer) => (item.debit > 0 ? '-' : '+');

const formatCommission = (value: number) => {
  const rounded = Math.round(Number(value || 0) * 10) / 10;
  if (!rounded) return '';
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const mapTransferItemToOperationItem = (item: ReportItemTransfer): ReportItemOperation => ({
  id: item.id,
  coin_id: item.coin_id,
  operation_id: item.operation_id,
  account_id: item.account_id,
  coin: item.coin,
  debit: item.debit,
  credit: item.credit,
  balance: 0,
  state: item.state || APP_CONSTANTS.STATE_DONE,
  user_name: item.user_name,
  client_name_account: item.client_name_account,
  operation_type: item.operation_type,
  observation: item.observation,
  nota: item.nota,
  created: item.created,
  commission: item.commission,
});

const showMessage = (message: string, showToast: (message: string, durationMs?: number) => void) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  showToast(message);
};

function PickerDialog({
  visible,
  title,
  query,
  onChangeQuery,
  accounts,
  coins,
  target,
  loading,
  onClose,
  onSelectAccount,
  onSelectCoin,
}: {
  visible: boolean;
  title: string;
  query: string;
  onChangeQuery: (value: string) => void;
  accounts: ReportAccount[];
  coins: Coin[];
  target: PickerTarget;
  loading: boolean;
  onClose: () => void;
  onSelectAccount: (item: ReportAccount) => void;
  onSelectCoin: (item: Coin) => void;
}) {
  const isCoinPicker = target === 'coin';

  return (
    <AppDialog
      visible={visible}
      onClose={onClose}
      backdropStyle={isCoinPicker ? styles.coinPickerBackdrop : styles.pickerBackdrop}
      cardStyle={isCoinPicker ? styles.coinPickerCard : styles.pickerCard}
      keyboardAware
      keyboardGap={12}
    >
      {!isCoinPicker ? (
        <>
          <Text style={styles.pickerTitle}>{title}</Text>
          <View style={styles.pickerSearchRow}>
            <TextInput
              value={query}
              onChangeText={onChangeQuery}
              placeholder="Buscar"
              placeholderTextColor="#B4AFC3"
              style={styles.pickerSearchInput}
            />
            <Pressable style={styles.pickerCloseInlineBtn} onPress={onClose}>
              <Text style={styles.pickerCloseInlineText}>×</Text>
            </Pressable>
          </View>
        </>
      ) : null}

      {isCoinPicker ? (
        <FlatList
          data={coins}
          keyExtractor={(item) => String(item.id)}
          style={styles.coinPickerList}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.coinPickerEmpty}>
              {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
              <Text style={styles.coinPickerEmptyText}>
                {loading ? 'Cargando monedas...' : 'No hay monedas para mostrar'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.coinPickerRow} activeOpacity={0.8} onPress={() => onSelectCoin(item)}>
              <Image source={getFlagSourceByShortName(item.short_name)} style={styles.coinPickerFlag} />
              <Text style={styles.coinPickerText}>{item.short_name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={(item) => String(item.account.id)}
          style={styles.pickerList}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
              <Text style={styles.emptyText}>
                {loading ? 'Buscando cuentas...' : 'No se encontraron cuentas.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pickerItem} activeOpacity={0.85} onPress={() => onSelectAccount(item)}>
              <View style={styles.pickerItemRow}>
                <View style={styles.pickerAvatar}>
                  <Image source={require('../../../../assets/images/ui/bblanco.png')} style={styles.pickerAvatarBg} />
                  <Text style={styles.pickerAvatarText}>
                    {item.account.firstName?.trim()?.charAt(0)?.toUpperCase()
                      || item.account.name?.trim()?.charAt(0)?.toUpperCase()
                      || 'A'}
                  </Text>
                </View>
                <View style={styles.pickerItemMainInfo}>
                  <Text style={styles.pickerItemText}>{item.account.name || '-'}</Text>
                  <Text style={styles.pickerItemSubText}>{item.account.category || '-'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </AppDialog>
  );
}

function CompactAccountDropdown({
  visible,
  anchor,
  accounts,
  onClose,
  onSelect,
}: {
  visible: boolean;
  anchor: PickerAnchor | null;
  accounts: ReportAccount[];
  onClose: () => void;
  onSelect: (item: ReportAccount) => void;
}) {
  if (!visible || !anchor) return null;

  return (
    <View style={styles.emitidaPickerOverlay} pointerEvents="box-none">
      <Pressable style={styles.emitidaPickerBackdropInline} onPress={onClose} />
      <View
        style={[
          styles.emitidaPickerCard,
          {
            left: Math.max(14, anchor.x + 8),
            top: anchor.y + anchor.height - 2,
          },
        ]}
      >
        <FlatList
          data={accounts}
          keyExtractor={(item) => String(item.account.id)}
          style={styles.emitidaPickerList}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.emitidaPickerItem}
              activeOpacity={0.85}
              onPress={() => onSelect(item)}
            >
              <View style={styles.pickerItemRow}>
                <View style={styles.pickerAvatar}>
                  <Image source={require('../../../../assets/images/ui/bblanco.png')} style={styles.pickerAvatarBg} />
                  <Text style={styles.pickerAvatarText}>
                    {item.account.firstName?.trim()?.charAt(0)?.toUpperCase()
                      || item.account.name?.trim()?.charAt(0)?.toUpperCase()
                      || 'A'}
                  </Text>
                </View>
                <View style={styles.pickerItemMainInfo}>
                  <Text style={styles.pickerItemText}>{item.account.name || '-'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

function TransferReportCard({
  item,
  onPressStateItem,
  onDeleteOperation,
}: {
  item: ReportTransfer;
  onPressStateItem: (item: ReportItemTransfer) => void;
  onDeleteOperation: (item: ReportTransfer) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const accountOne = item.item_one?.id > -1 ? item.item_one : null;
  const commissionOne = item.item_two?.id > -1 ? item.item_two : null;
  const accountTwo = item.item_three?.id > -1 ? item.item_three : null;
  const commissionTwo = item.item_four?.id > -1 ? item.item_four : null;

  if (!accountOne) return null;

  return (
    <TouchableOpacity style={styles.reportCard} activeOpacity={0.95} onPress={() => setExpanded((prev) => !prev)}>
      <View style={styles.reportRow}>
        <Text style={styles.reportName} numberOfLines={1}>{accountOne.client_name_account || '-'}</Text>
        <View style={styles.reportCommissionSpacer} />
        <View style={styles.reportSignWrap}>
          <Text style={styles.reportSign}>{getReportSign(accountOne)}</Text>
          {accountOne.state === APP_CONSTANTS.STATE_PENDIENT ? (
            <TouchableOpacity
              style={styles.reportStateButton}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={(event) => {
                event.stopPropagation();
                onPressStateItem(accountOne);
              }}
            >
              <Image
                source={require('../../../../assets/images/ui/pendsan.png')}
                style={styles.reportStateIcon}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.reportAmountWrap}>
          <Text style={styles.reportAmount}>{formatReportAmount(accountOne)}</Text>
          <Image source={getFilterFlagSourceByShortName(accountOne.coin || 'ARS')} style={styles.reportFlag} />
        </View>
      </View>

      {commissionOne ? (
        <View style={styles.reportSmallRow}>
          <Text style={styles.reportMetaName} numberOfLines={1}>{commissionOne.client_name_account || '-'}</Text>
          <View style={styles.reportMetaCommissionWrap}>
            <Text style={styles.reportMetaCommission}>{formatCommission(commissionOne.commission)}</Text>
            {commissionOne.commission > 0 ? <Text style={styles.reportMetaPercent}> %</Text> : null}
          </View>
          <Text style={styles.reportSign}>{getReportSign(commissionOne)}</Text>
          <View style={styles.reportMetaAmountWrap}>
            <Text style={styles.reportMetaAmount}>{formatReportAmount(commissionOne)}</Text>
            <Image source={getFilterFlagSourceByShortName(commissionOne.coin || 'ARS')} style={styles.reportFlag} />
          </View>
        </View>
      ) : null}

      {commissionTwo ? (
        <View style={styles.reportSmallRow}>
          <Text style={styles.reportMetaName} numberOfLines={1}>{commissionTwo.client_name_account || '-'}</Text>
          <View style={styles.reportMetaCommissionWrap}>
            <Text style={styles.reportMetaCommission}>{formatCommission(commissionTwo.commission)}</Text>
            {commissionTwo.commission > 0 ? <Text style={styles.reportMetaPercent}> %</Text> : null}
          </View>
          <Text style={styles.reportSign}>{getReportSign(commissionTwo)}</Text>
          <View style={styles.reportMetaAmountWrap}>
            <Text style={styles.reportMetaAmount}>{formatReportAmount(commissionTwo)}</Text>
            <Image source={getFilterFlagSourceByShortName(commissionTwo.coin || 'ARS')} style={styles.reportFlag} />
          </View>
        </View>
      ) : null}

      {accountTwo ? (
        <>
          <View style={styles.reportDivider} />
          <View style={styles.reportBottomRow}>
            <Text style={styles.reportName} numberOfLines={1}>{accountTwo.client_name_account || '-'}</Text>
            <View style={styles.reportCommissionSpacer} />
            <View style={styles.reportSignWrap}>
              <Text style={styles.reportSign}>{getReportSign(accountTwo)}</Text>
              {accountTwo.state === APP_CONSTANTS.STATE_PENDIENT ? (
                <TouchableOpacity
                  style={styles.reportStateButton}
                  activeOpacity={0.8}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={(event) => {
                    event.stopPropagation();
                    onPressStateItem(accountTwo);
                  }}
                >
                  <Image
                    source={require('../../../../assets/images/ui/pendsan.png')}
                    style={styles.reportStateIcon}
                  />
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={styles.reportAmountWrap}>
              <Text style={styles.reportAmount}>{formatReportAmount(accountTwo)}</Text>
              <Image source={getFilterFlagSourceByShortName(accountTwo.coin || 'ARS')} style={styles.reportFlag} />
            </View>
          </View>
        </>
      ) : null}

      {expanded ? (
        <View style={styles.reportExpandedRow}>
          <View style={styles.reportExpandedDateWrap}>
            <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.reportExpandedDateIcon} />
            <Text style={styles.reportExpandedDate}>{dateHelper.onlyDate(item.operation_created) || '-'}</Text>
          </View>
          <TouchableOpacity
            style={styles.reportMoreInfoRow}
            activeOpacity={0.85}
            onPress={() => setInfoVisible(true)}
          >
            <Image source={require('../../../../assets/images/ui/info.png')} style={styles.reportMoreInfoIcon} />
            <Text style={styles.reportMoreInfoText}>mas info</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TransferInfoDialog
        visible={infoVisible}
        item={item}
        onClose={() => setInfoVisible(false)}
        onPressDelete={() => {
          setInfoVisible(false);
          setDeleteVisible(true);
        }}
      />
      <TransferDeleteOperationDialog
        visible={deleteVisible}
        item={item}
        onClose={() => setDeleteVisible(false)}
        onConfirm={async (transfer) => {
          await onDeleteOperation(transfer);
          setDeleteVisible(false);
        }}
      />
    </TouchableOpacity>
  );
}

export default function TransfersScreen() {
  const { userId, userName } = useContext(AuthContext);
  const { showToast } = useToast();
  const { navigateTo } = useSideMenu();
  const { coins } = useCoins();
  const { transfers, loading, loadingMore, error, loadMore, reload } = useTransfers();
  const windowHeight = Dimensions.get('window').height;
  const sheetHeight = Math.min(windowHeight * 0.56, 500);
  const sheetPeek = 96;

  const [transferType, setTransferType] = useState<TransferType>('emitida');
  const [inputMethod, setInputMethod] = useState<InputMethod>('percent');
  const [showClientAccountField, setShowClientAccountField] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetScrollOffset, setSheetScrollOffset] = useState(0);

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [account1, setAccount1] = useState<ReportAccount | null>(null);
  const [account2, setAccount2] = useState<ReportAccount | null>(null);
  const [commission1, setCommission1] = useState<ReportAccount | null>(null);
  const [commission2, setCommission2] = useState<ReportAccount | null>(DEFAULT_CASH_ACCOUNT);

  const [generalAmount, setGeneralAmount] = useState('');
  const [amountAccount1, setAmountAccount1] = useState('');
  const [amountAccount2, setAmountAccount2] = useState('');
  const [amountCommission1, setAmountCommission1] = useState('');
  const [amountCommission2, setAmountCommission2] = useState('');
  const [percentage1, setPercentage1] = useState('');
  const [percentage2, setPercentage2] = useState('');
  const [account1State, setAccount1State] = useState<OperationState>(APP_CONSTANTS.STATE_DONE);
  const [account2State, setAccount2State] = useState<OperationState>(APP_CONSTANTS.STATE_DONE);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>('account1');
  const [pickerQuery, setPickerQuery] = useState('');
  const [pickerAnchor, setPickerAnchor] = useState<PickerAnchor | null>(null);
  const [accounts, setAccounts] = useState<ReportAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const account1Ref = useRef<any>(null);
  const commission1Ref = useRef<any>(null);
  const commission2Ref = useRef<any>(null);
  const compactPickerVisible =
    pickerVisible
    && ['account1', 'commission1', 'commission2'].includes(pickerTarget)
    && !!pickerAnchor;
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmObservation, setConfirmObservation] = useState('');
  const [saving, setSaving] = useState(false);
  const [changingStateItem, setChangingStateItem] = useState<ReportItemOperation | null>(null);

  useEffect(() => {
    if (!selectedCoin && coins.length > 0) {
      setSelectedCoin(
        coins.find((coin) => coin.short_name === 'USD')
        ?? coins[0]
        ?? null,
      );
    }
  }, [coins, selectedCoin]);

  const loadAccounts = async (query: string) => {
    setLoadingAccounts(true);
    try {
      const useSimpleAccounts =
        ['account1', 'commission1', 'commission2'].includes(pickerTarget);

      const data = useSimpleAccounts
        ? await fetchSimpleAccounts({
            page: 0,
            query,
            category: 'transfer',
          })
        : await fetchAccounts({
            page: 0,
            query,
            category: APP_CONSTANTS.TYPE_ALL,
          });
      setAccounts(data);
    } catch {
      setAccounts([]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (!pickerVisible || pickerTarget === 'coin') return;
    loadAccounts(pickerQuery.trim().toLowerCase());
  }, [pickerVisible, pickerQuery, pickerTarget, transferType]);

  const resetFields = (nextType = transferType, nextMethod = inputMethod) => {
    setGeneralAmount('');
    setAmountAccount1('');
    setAmountAccount2('');
    setAmountCommission1('');
    setAmountCommission2('');
    setPercentage1('');
    setPercentage2('');
    setAccount1State(APP_CONSTANTS.STATE_DONE);
    setAccount2State(APP_CONSTANTS.STATE_DONE);
    setAccount1(null);
    setAccount2(null);
    setCommission1(null);
    setCommission2(DEFAULT_CASH_ACCOUNT);
    setShowClientAccountField(false);

    if (nextType === 'emitida') {
      setInputMethod(nextMethod);
    } else {
      setInputMethod('percent');
    }
  };

  const handleChangeType = (nextType: TransferType) => {
    if (transferType === nextType) return;
    setTransferType(nextType);
    resetFields(nextType, nextType === 'emitida' ? inputMethod : 'percent');
  };

  const handleChangeMethod = (nextMethod: InputMethod) => {
    if (inputMethod === nextMethod) return;
    setInputMethod(nextMethod);
    resetFields('emitida', nextMethod);
  };

  const fieldConfig = useMemo(() => {
    const isEmitida = transferType === 'emitida';
    const isPercentMode = isEmitida && inputMethod === 'percent';
    const isAmountMode = isEmitida && inputMethod === 'amount';
    const isRecibida = transferType === 'recibida';

    return {
      generalEnabled: isPercentMode,
      account1Enabled: isAmountMode || isRecibida,
      account2Enabled: isRecibida && showClientAccountField,
      commission1AmountEnabled: isAmountMode || isRecibida,
      commission2AmountEnabled: isAmountMode || isRecibida,
      percentage1Enabled: isPercentMode,
      percentage2Enabled: isPercentMode,
      showMethodSwitch: isEmitida,
      showClientAccountAdd: isRecibida && !showClientAccountField,
      showClientAccountField: isRecibida && showClientAccountField,
      signs: isRecibida
        ? { account1: '-', commission1: '-', commission2: '+', account2: '+' }
        : { account1: '+', commission1: '+', commission2: '+', account2: '+' },
    };
  }, [transferType, inputMethod, showClientAccountField]);

  useEffect(() => {
    if (transferType === 'emitida' && inputMethod === 'percent') {
      if (generalAmount.trim() && percentage1.trim() && percentage2.trim()) {
        const total = parseDecimal(generalAmount);
        const p1 = parseDecimal(percentage1);
        const p2 = parseDecimal(percentage2);
        const c1 = p1 * total / 100;
        const c2 = p2 * total / 100;
        const a1 = total - c1 - c2;

        setAmountCommission1(formatAmountDisplay(c1));
        setAmountCommission2(formatAmountDisplay(c2));
        setAmountAccount1(formatAmountDisplay(a1));
      } else {
        setAmountCommission1('');
        setAmountCommission2('');
        setAmountAccount1('');
      }
    }
  }, [transferType, inputMethod, generalAmount, percentage1, percentage2]);

  useEffect(() => {
    if (transferType === 'emitida' && inputMethod === 'amount') {
      if (amountAccount1.trim() && amountCommission1.trim() && amountCommission2.trim()) {
        const a1 = parseDecimal(amountAccount1);
        const c1 = parseDecimal(amountCommission1);
        const c2 = parseDecimal(amountCommission2);
        const total = a1 + c1 + c2;
        const p1 = a1 === 0 ? 0 : c1 * 100 / a1;
        const p2 = a1 === 0 ? 0 : c2 * 100 / a1;

        setGeneralAmount(formatAmountDisplay(total));
        setPercentage1(formatAmountDisplay(p1));
        setPercentage2(formatAmountDisplay(p2));
      } else {
        setGeneralAmount('');
        setPercentage1('');
        setPercentage2('');
      }
    }
  }, [transferType, inputMethod, amountAccount1, amountCommission1, amountCommission2]);

  useEffect(() => {
    if (transferType === 'recibida') {
      if (amountAccount1.trim() && amountCommission1.trim()) {
        const a1 = parseDecimal(amountAccount1);
        const c1 = parseDecimal(amountCommission1);
        const percent = a1 + c1 === 0 ? 0 : c1 / (a1 + c1) * 100;
        setPercentage1(formatAmountDisplay(percent));
        setPercentage2(formatAmountDisplay(percent));
        setAmountCommission2(formatAmountDisplay(c1));
      } else {
        setPercentage1('');
        setPercentage2('');
        setAmountCommission2('');
      }
    }
  }, [transferType, amountAccount1, amountCommission1]);

  const openPicker = (target: PickerTarget, anchorRef?: React.RefObject<any>) => {
    const isCompactTarget = ['account1', 'commission1', 'commission2'].includes(target);

    setPickerTarget(target);
    setPickerQuery('');
    if (isCompactTarget && anchorRef?.current) {
      anchorRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
        setPickerAnchor({ x, y, width, height });
        setPickerVisible(true);
      });
      return;
    }
    setPickerAnchor(null);
    setPickerVisible(true);
  };

  const handleSelectAccount = (item: ReportAccount) => {
    if (pickerTarget === 'account1') {
      setAccount1(item);
      setCommission1(item);
      setCommission2(DEFAULT_CASH_ACCOUNT);
    } else if (pickerTarget === 'account2') {
      setAccount2(item);
    } else if (pickerTarget === 'commission1') {
      setCommission1(item);
    } else if (pickerTarget === 'commission2') {
      setCommission2(item);
    }
    setPickerVisible(false);
  };

  const handleSelectCoin = (item: Coin) => {
    setSelectedCoin(item);
    setPickerVisible(false);
  };

  const clearTransferForm = () => {
    resetFields(transferType, inputMethod);
    setConfirmObservation('');
  };

  const buildTransferInfo = () => {
    const items: string[] = [];
    const coinId = selectedCoin?.id || 0;

    const pushItem = ({
      accountId,
      amount,
      sign,
      state,
      commission,
      order,
    }: {
      accountId: number;
      amount: string;
      sign: '+' | '-';
      state: string;
      commission: number;
      order: number;
    }) => {
      if (accountId <= 0 || !amount.trim()) return;
      const parsedAmount = parseDecimal(amount);
      if (!parsedAmount) return;
      const credit = sign === '+' ? parsedAmount : 0;
      const debit = sign === '-' ? parsedAmount : 0;
      items.push(`${credit} ${debit} ${state} ${coinId} ${accountId} ${commission} ${order}`);
    };

    pushItem({
      accountId: account1?.account.id || 0,
      amount: amountAccount1,
      sign: fieldConfig.signs.account1 as '+' | '-',
      state: account1State,
      commission: 0,
      order: 1,
    });

    pushItem({
      accountId: commission1?.account.id || 0,
      amount: amountCommission1,
      sign: fieldConfig.signs.commission1 as '+' | '-',
      state: APP_CONSTANTS.STATE_DONE,
      commission: parseDecimal(percentage1),
      order: 2,
    });

    pushItem({
      accountId: account2?.account.id || 0,
      amount: amountAccount2,
      sign: fieldConfig.signs.account2 as '+' | '-',
      state: account2State,
      commission: 0,
      order: 3,
    });

    pushItem({
      accountId: commission2?.account.id || 0,
      amount: amountCommission2,
      sign: fieldConfig.signs.commission2 as '+' | '-',
      state: APP_CONSTANTS.STATE_DONE,
      commission: parseDecimal(percentage2),
      order: 4,
    });

    return items.join(';');
  };

  const getTransferValidationMessage = (info: string) => {
    if (!info.length) return 'Existen campos sin completar';

    if ((account1?.account.id ? !amountAccount1.trim() : !!amountAccount1.trim())) {
      return 'Cuenta 1 y monto deben estar completos';
    }

    if ((commission1?.account.id ? !amountCommission1.trim() : !!amountCommission1.trim())) {
      return 'Comision y monto deben estar completos';
    }

    if ((commission2?.account.id ? !amountCommission2.trim() : !!amountCommission2.trim())) {
      return 'Comision y monto deben estar completos';
    }

    if ((account2?.account.id ? !amountAccount2.trim() : !!amountAccount2.trim())) {
      return 'Cuenta 2 y monto deben estar completos';
    }

    return 'valido';
  };

  const buildDefaultObservation = () => {
    return ` COBRA: ${selectedCoin?.short_name || ''} ${amountAccount1.trim()} + ${amountCommission1.trim()} REMITE`;
  };

  const handleOpenConfirm = () => {
    const info = buildTransferInfo();
    const validationMessage = getTransferValidationMessage(info);
    if (validationMessage !== 'valido') {
      showMessage(validationMessage, showToast);
      return;
    }
    setConfirmObservation(buildDefaultObservation());
    setConfirmVisible(true);
  };

  const handleSave = async () => {
    const info = buildTransferInfo();
    const validationMessage = getTransferValidationMessage(info);
    if (validationMessage !== 'valido') {
      showMessage(validationMessage, showToast);
      return;
    }
    if (!userId) {
      showMessage('No se pudo identificar el usuario actual', showToast);
      return;
    }

    setSaving(true);
    try {
      await createTransfer({
        info_items: info,
        observation: `${transferType}-${confirmObservation.trim()}`,
        user_id: userId,
      });
      setConfirmVisible(false);
      clearTransferForm();
      showMessage('Se ha creado la transferencia con exito', showToast);
      await reload();
    } catch (error: any) {
      showMessage(error?.message || 'No se pudo crear la transferencia', showToast);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChangedState = async ({ id, state }: { id: number; state: string }) => {
    await changeStateItem(id, state);
    setChangingStateItem(null);
    await reload();
  };

  const handleDeleteTransfer = async (item: ReportTransfer) => {
    await deleteOperation(item.operation_id);
    showMessage('Se ha eliminado la transferencia', showToast);
    await reload();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.leftButton} activeOpacity={0.8} onPress={() => navigateTo('home')}>
          <Text style={styles.topBarArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Transferencias</Text>
        <TouchableOpacity activeOpacity={0.85} onPress={handleOpenConfirm}>
          <Image source={require('../../../../assets/images/ui/savewhite.png')} style={styles.topBarSave} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.formWrap}>
          <View style={styles.typeSwitchWrap}>
            <View style={styles.typeSwitch}>
              <TouchableOpacity
                style={[styles.typeSwitchHalf, transferType === 'emitida' ? styles.typeSwitchHalfActive : null]}
                activeOpacity={0.85}
                onPress={() => handleChangeType('emitida')}
              >
                <Text style={[styles.typeSwitchText, transferType !== 'emitida' ? styles.typeSwitchTextInactive : null]}>
                  emitida
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeSwitchHalf, transferType === 'recibida' ? styles.typeSwitchHalfActive : null]}
                activeOpacity={0.85}
                onPress={() => handleChangeType('recibida')}
              >
                <Text style={[styles.typeSwitchText, transferType !== 'recibida' ? styles.typeSwitchTextInactive : null]}>
                  recibida
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.amountCard, !fieldConfig.generalEnabled ? styles.amountCardDisabled : null]}>
            <TouchableOpacity style={styles.coinButton} activeOpacity={0.85} onPress={() => openPicker('coin')}>
              <Image source={getFlagSourceByShortName(selectedCoin?.short_name || 'USD')} style={styles.coinFlag} />
              <Text style={styles.coinLabel}>{selectedCoin?.short_name || 'USD'}</Text>
            </TouchableOpacity>
            <View style={styles.amountDivider} />
            <View style={styles.amountInputWrap}>
              <TextInput
                value={generalAmount}
                onChangeText={setGeneralAmount}
                editable={fieldConfig.generalEnabled}
                keyboardType="decimal-pad"
                style={[styles.amountInput, !fieldConfig.generalEnabled ? styles.amountInputDisabled : null]}
              />
            </View>
          </View>

          {fieldConfig.showMethodSwitch ? (
            <View style={styles.methodSwitchWrap}>
              <View style={styles.methodSwitch}>
                <TouchableOpacity
                  style={[styles.methodHalf, inputMethod === 'percent' ? styles.methodHalfActive : null]}
                  activeOpacity={0.85}
                  onPress={() => handleChangeMethod('percent')}
                >
                  <Text style={[styles.methodText, inputMethod === 'percent' ? styles.methodTextActive : null]}>%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.methodHalf, inputMethod === 'amount' ? styles.methodHalfActive : null]}
                  activeOpacity={0.85}
                  onPress={() => handleChangeMethod('amount')}
                >
                  <Text style={[styles.methodText, inputMethod === 'amount' ? styles.methodTextActive : null]}>$</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={styles.fieldGroup}>
            <TouchableOpacity ref={account1Ref} style={styles.accountHeaderRow} activeOpacity={0.85} onPress={() => openPicker('account1', account1Ref)}>
              <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountIcon} />
              <Text style={[styles.accountHeaderText, !account1?.account.id ? styles.accountHeaderPlaceholder : null]}>
                {account1?.account.name || 'cuenta'}
              </Text>
              <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountHeaderArrow} />
            </TouchableOpacity>
            <View style={[styles.moneyRow, fieldConfig.account1Enabled ? styles.moneyRowActive : null]}>
              <Text style={styles.signText}>{fieldConfig.signs.account1}</Text>
              <TextInput
                value={amountAccount1}
                onChangeText={setAmountAccount1}
                editable={fieldConfig.account1Enabled}
                keyboardType="decimal-pad"
                style={[styles.moneyInput, !fieldConfig.account1Enabled ? styles.moneyInputDisabled : null]}
              />
              <TouchableOpacity
                style={styles.stateButton}
                activeOpacity={0.85}
                onPress={() => setAccount1State((current) => current === APP_CONSTANTS.STATE_PENDIENT ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT)}
              >
                <Image
                  source={
                    account1State === APP_CONSTANTS.STATE_PENDIENT
                      ? require('../../../../assets/images/ui/pendsan.png')
                      : require('../../../../assets/images/ui/donesan.png')
                  }
                  style={styles.stateIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <TouchableOpacity ref={commission1Ref} style={styles.accountHeaderRow} activeOpacity={0.85} onPress={() => openPicker('commission1', commission1Ref)}>
              <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountIcon} />
              <Text style={[styles.accountHeaderText, !commission1?.account.id ? styles.accountHeaderPlaceholder : null]}>
                {commission1?.account.name || 'comision 1'}
              </Text>
              <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountHeaderArrow} />
            </TouchableOpacity>
            <View style={styles.dualMoneyRow}>
              <View style={[styles.percentBox, fieldConfig.percentage1Enabled ? styles.percentBoxActive : null]}>
                <Text style={styles.percentPrefix}>%</Text>
                <TextInput
                  value={percentage1}
                  onChangeText={setPercentage1}
                  editable={fieldConfig.percentage1Enabled}
                  keyboardType="decimal-pad"
                  placeholder="comision"
                  placeholderTextColor="#C6BCDA"
                  style={[styles.percentInput, !fieldConfig.percentage1Enabled ? styles.percentInputDisabled : null]}
                />
              </View>
              <View style={[styles.dualAmountBox, fieldConfig.commission1AmountEnabled ? styles.dualAmountBoxActive : null]}>
                <Text style={styles.signText}>{fieldConfig.signs.commission1}</Text>
                <TextInput
                  value={amountCommission1}
                  onChangeText={setAmountCommission1}
                  editable={fieldConfig.commission1AmountEnabled}
                  keyboardType="decimal-pad"
                  style={[styles.dualAmountInput, !fieldConfig.commission1AmountEnabled ? styles.dualAmountInputDisabled : null]}
                />
              </View>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <TouchableOpacity ref={commission2Ref} style={styles.accountHeaderRow} activeOpacity={0.85} onPress={() => openPicker('commission2', commission2Ref)}>
              <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountIcon} />
              <Text style={[styles.accountHeaderText, !commission2?.account.id ? styles.accountHeaderPlaceholder : null]}>
                {commission2?.account.name || 'comision 2'}
              </Text>
              <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountHeaderArrow} />
            </TouchableOpacity>
            <View style={styles.dualMoneyRow}>
              <View style={[styles.percentBox, fieldConfig.percentage2Enabled ? styles.percentBoxActive : null]}>
                <Text style={styles.percentPrefix}>%</Text>
                <TextInput
                  value={percentage2}
                  onChangeText={setPercentage2}
                  editable={fieldConfig.percentage2Enabled}
                  keyboardType="decimal-pad"
                  placeholder="comision"
                  placeholderTextColor="#C6BCDA"
                  style={[styles.percentInput, !fieldConfig.percentage2Enabled ? styles.percentInputDisabled : null]}
                />
              </View>
              <View style={[styles.dualAmountBox, fieldConfig.commission2AmountEnabled ? styles.dualAmountBoxActive : null]}>
                <Text style={styles.signText}>{fieldConfig.signs.commission2}</Text>
                <TextInput
                  value={amountCommission2}
                  onChangeText={setAmountCommission2}
                  editable={fieldConfig.commission2AmountEnabled}
                  keyboardType="decimal-pad"
                  style={[styles.dualAmountInput, !fieldConfig.commission2AmountEnabled ? styles.dualAmountInputDisabled : null]}
                />
              </View>
            </View>
          </View>

          {fieldConfig.showClientAccountAdd ? (
            <TouchableOpacity style={styles.clientAddRow} activeOpacity={0.85} onPress={() => setShowClientAccountField(true)}>
              <Image source={require('../../../../assets/images/ui/addaccount.png')} style={styles.clientAddIcon} />
              <Text style={styles.clientAddText}>cuenta cliente</Text>
            </TouchableOpacity>
          ) : null}

          {fieldConfig.showClientAccountField ? (
            <View style={styles.fieldGroup}>
              <TouchableOpacity style={styles.accountHeaderRow} activeOpacity={0.85} onPress={() => openPicker('account2')}>
                <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountIcon} />
                <Text style={[styles.accountHeaderText, !account2?.account.id ? styles.accountHeaderPlaceholder : null]}>
                  {account2?.account.name || 'cuenta cliente'}
                </Text>
                <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountHeaderArrow} />
              </TouchableOpacity>
              <View style={[styles.moneyRow, fieldConfig.account2Enabled ? styles.moneyRowActive : null]}>
                <Text style={styles.signText}>{fieldConfig.signs.account2}</Text>
                <TextInput
                  value={amountAccount2}
                  onChangeText={setAmountAccount2}
                  editable={fieldConfig.account2Enabled}
                  keyboardType="decimal-pad"
                  style={[styles.moneyInput, !fieldConfig.account2Enabled ? styles.moneyInputDisabled : null]}
                />
              <TouchableOpacity
                style={styles.stateButton}
                activeOpacity={0.85}
                onPress={() => setAccount2State((current) => current === APP_CONSTANTS.STATE_PENDIENT ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT)}
              >
                <Image
                  source={
                    account2State === APP_CONSTANTS.STATE_PENDIENT
                      ? require('../../../../assets/images/ui/pendsan.png')
                      : require('../../../../assets/images/ui/donesan.png')
                  }
                  style={styles.stateIcon}
                />
              </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={styles.actionsRow}>
            <View style={styles.actionHalf}>
              <TouchableOpacity style={styles.clearBtn} activeOpacity={0.85} onPress={() => resetFields()}>
                <Image source={require('../../../../assets/images/ui/limpiar.png')} style={styles.clearIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <AppBottomSheet
        height={sheetHeight}
        peekHeight={sheetPeek}
        arrowSource={require('../../../../assets/images/ui/arrowsan.png')}
        dragOn="both"
        disableBodyDragWhenExpanded
        bodyScrollOffset={sheetScrollOffset}
        bodyCollapseThreshold={80}
        onExpandedChange={setSheetExpanded}
        containerStyle={styles.sheetWrap}
        bodyStyle={styles.sheetBody}
      >
        <FlatList
          data={transfers}
          keyExtractor={(item) => String(item.operation_id)}
          renderItem={({ item }) => (
            <TransferReportCard
              item={item}
              onPressStateItem={(transferItem) => setChangingStateItem(mapTransferItemToOperationItem(transferItem))}
              onDeleteOperation={handleDeleteTransfer}
            />
          )}
          scrollEnabled={sheetExpanded}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          onScroll={(event) => {
            setSheetScrollOffset(event.nativeEvent.contentOffset.y);
          }}
          scrollEventThrottle={16}
          onEndReached={loadMore}
          onEndReachedThreshold={0.35}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
              <Text style={error ? styles.errorText : styles.emptyText}>
                {loading
                  ? 'Cargando transferencias...'
                  : error
                    ? 'No se pudieron cargar las transferencias'
                    : 'No hay transferencias para mostrar'}
              </Text>
              {error ? (
                <TouchableOpacity onPress={reload} activeOpacity={0.8} style={styles.retryBtn}>
                  <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          }
          ListFooterComponent={!loading && loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
        />
      </AppBottomSheet>

      <CompactAccountDropdown
        visible={compactPickerVisible}
        anchor={pickerAnchor}
        accounts={accounts}
        onClose={() => {
          setPickerVisible(false);
          setPickerAnchor(null);
        }}
        onSelect={(item) => {
          handleSelectAccount(item);
          setPickerAnchor(null);
        }}
      />

      <PickerDialog
        visible={pickerVisible && !compactPickerVisible}
        title={pickerTarget === 'coin' ? 'Seleccionar moneda' : 'Seleccionar cuenta'}
        query={pickerQuery}
        onChangeQuery={setPickerQuery}
        accounts={accounts}
        coins={coins.filter((coin) => {
          const search = pickerQuery.trim().toLowerCase();
          if (!search) return true;
          return coin.short_name.toLowerCase().includes(search) || coin.name.toLowerCase().includes(search);
        })}
        target={pickerTarget}
        loading={loadingAccounts}
        onClose={() => {
          setPickerVisible(false);
          setPickerAnchor(null);
        }}
        onSelectAccount={handleSelectAccount}
        onSelectCoin={handleSelectCoin}
      />

      <TransferCreateConfirmDialog
        visible={confirmVisible}
        saving={saving}
        observation={confirmObservation}
        dateText={dateHelper.getActualDateToShow()}
        userName={userName || ''}
        onChangeObservation={setConfirmObservation}
        onCopy={() => {
          const textToCopy = confirmObservation.trim();
          if (!textToCopy) return;
          Clipboard.setString(textToCopy);
          showMessage('El texto ha sido copiado', showToast);
        }}
        onClose={() => setConfirmVisible(false)}
        onConfirm={handleSave}
      />

      <ChangeStateItemDialog
        visible={!!changingStateItem}
        item={changingStateItem}
        onClose={() => setChangingStateItem(null)}
        onSave={handleSaveChangedState}
      />
    </View>
  );
}
