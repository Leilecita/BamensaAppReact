import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { AuthContext } from '../../../contexts/AuthContext';
import { fetchAccounts, type ReportAccount } from '../../accounts/services/accountService';
import { createCheck } from '../services/checkService';
import CheckCreateConfirmDialog from './CheckCreateConfirmDialog';
import styles from './CreateCheckTab.styles';

type Props = {
  onCreated?: () => void | Promise<void>;
};

type PickerTarget = 'client' | 'mutual';

const DEFAULT_MUTUAL_ACCOUNT_ID = 64;
const DEFAULT_MUTUAL_ACCOUNT_NAME = 'Patricio Pato Torrano';

const parseDecimal = (value: string) => {
  const parsed = Number(String(value).replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatAmountDisplay = (value: number) =>
  String(Math.round(Number(value || 0)));

const showMessage = (message: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
    return;
  }
  Alert.alert('Atención', message);
};

function AccountPickerDialog({
  visible,
  title,
  query,
  onChangeQuery,
  accounts,
  loading,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  query: string;
  onChangeQuery: (value: string) => void;
  accounts: ReportAccount[];
  loading: boolean;
  onSelect: (item: ReportAccount) => void;
  onClose: () => void;
}) {
  return (
    <AppDialog
      visible={visible}
      onClose={onClose}
      backdropStyle={styles.pickerBackdrop}
      cardStyle={styles.pickerCard}
      keyboardAware
      keyboardGap={12}
    >
      <Text style={styles.pickerTitle}>{title}</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Buscar"
          placeholderTextColor="#B4AFC3"
          style={styles.searchInput}
        />
        <Pressable style={styles.pickerCloseInlineBtn} onPress={onClose}>
          <Text style={styles.pickerCloseInlineText}>×</Text>
        </Pressable>
      </View>
      <FlatList
        data={accounts}
        keyExtractor={(item) => String(item.account.id)}
        style={styles.pickerList}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.pickerEmpty}>
            <Text style={styles.pickerEmptyText}>
              {loading ? 'Buscando cuentas...' : 'No se encontraron cuentas.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.pickerItem} activeOpacity={0.85} onPress={() => onSelect(item)}>
            <View style={styles.pickerItemInner}>
              <View style={styles.pickerItemCircle}>
                <Image
                  source={require('../../../../assets/images/ui/bblanco.png')}
                  style={[styles.pickerItemCircleImg, { tintColor: item.account.color || '#9D92B6' }]}
                />
                <Text style={styles.pickerItemCircleText}>
                  {item.account.firstName?.trim()?.charAt(0)?.toUpperCase()
                    || item.account.name?.trim()?.charAt(0)?.toUpperCase()
                    || 'A'}
                </Text>
              </View>

              <View style={styles.pickerItemMainInfo}>
                <Text style={styles.pickerItemText} numberOfLines={2}>
                  {item.account.name || '-'}
                </Text>
                <Text style={styles.pickerItemCategory}>
                  {item.account.category || '-'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </AppDialog>
  );
}

export default function CreateCheckTab({ onCreated }: Props) {
  const { userId } = useContext(AuthContext);
  const [generalAmount, setGeneralAmount] = useState('');
  const [mutualPercent, setMutualPercent] = useState('');
  const [bamPercent, setBamPercent] = useState('');
  const [observation, setObservation] = useState('');
  const [clientAccount, setClientAccount] = useState<ReportAccount | null>(null);
  const [mutualAccount, setMutualAccount] = useState<ReportAccount | null>({
    account: {
      id: DEFAULT_MUTUAL_ACCOUNT_ID,
      firstName: DEFAULT_MUTUAL_ACCOUNT_NAME,
      lastName: '',
      name: DEFAULT_MUTUAL_ACCOUNT_NAME,
      category: APP_CONSTANTS.TYPE_ALL,
      color: '#9D92B6',
      phone: '',
      protectedAccount: 'false',
    },
    balance: [],
    raw: null,
  });
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>('client');
  const [accountQuery, setAccountQuery] = useState('');
  const [accounts, setAccounts] = useState<ReportAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmObservation, setConfirmObservation] = useState('');
  const [saving, setSaving] = useState(false);

  const totalAmountValue = parseDecimal(generalAmount);
  const mutualPercentValue = parseDecimal(mutualPercent);
  const bamPercentValue = parseDecimal(bamPercent);

  const mutualCommissionAmount = totalAmountValue * mutualPercentValue / 100;
  const bamCommissionAmount = totalAmountValue * bamPercentValue / 100;
  const clientAmount = totalAmountValue - mutualCommissionAmount - bamCommissionAmount;
  const mutualAmount = totalAmountValue - mutualCommissionAmount;
  const canShowClientAmount =
    generalAmount.trim().length > 0 &&
    mutualPercent.trim().length > 0 &&
    bamPercent.trim().length > 0;
  const canShowMutualAmount =
    generalAmount.trim().length > 0 &&
    mutualPercent.trim().length > 0 &&
    !!mutualAccount?.account.id;

  const loadAccounts = async (query: string) => {
    setAccountsLoading(true);
    try {
      const data = await fetchAccounts({
        page: 0,
        query,
        category: APP_CONSTANTS.TYPE_ALL,
      });
      setAccounts(data);
    } catch {
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    if (!pickerVisible) return;
    loadAccounts(accountQuery.trim().toLowerCase());
  }, [pickerVisible, accountQuery]);

  const validationMessage = useMemo(() => {
    if (!generalAmount.trim()) return 'Ingresá el monto total del cheque';
    if (totalAmountValue <= 0) return 'Ingresá un monto total válido';
    if (!mutualPercent.trim() || !bamPercent.trim()) return 'Completá ambos porcentajes';
    if (!clientAccount?.account.id) return 'Seleccioná la cuenta cliente';
    if (!mutualAccount?.account.id) return 'Seleccioná la cuenta mutual';
    if (clientAmount <= 0 || mutualAmount <= 0) return 'Los importes calculados no son válidos';
    return '';
  }, [
    generalAmount,
    totalAmountValue,
    mutualPercent,
    bamPercent,
    clientAccount,
    mutualAccount,
    clientAmount,
    mutualAmount,
  ]);

  const handleClear = () => {
    setGeneralAmount('');
    setMutualPercent('');
    setBamPercent('');
    setObservation('');
    setConfirmObservation('');
    setClientAccount(null);
    setMutualAccount({
      account: {
        id: DEFAULT_MUTUAL_ACCOUNT_ID,
        firstName: DEFAULT_MUTUAL_ACCOUNT_NAME,
        lastName: '',
        name: DEFAULT_MUTUAL_ACCOUNT_NAME,
        category: APP_CONSTANTS.TYPE_ALL,
        color: '#9D92B6',
        phone: '',
        protectedAccount: 'false',
      },
      balance: [],
      raw: null,
    });
  };

  const openPicker = (target: PickerTarget) => {
    setPickerTarget(target);
    setAccountQuery('');
    setPickerVisible(true);
  };

  const handleSelectAccount = (account: ReportAccount) => {
    if (pickerTarget === 'client') {
      setClientAccount(account);
    } else {
      setMutualAccount(account);
    }
    setPickerVisible(false);
  };

  const handleOpenConfirm = () => {
    if (validationMessage) {
      showMessage(validationMessage);
      return;
    }
    setConfirmObservation(observation);
    setConfirmVisible(true);
  };

  const handleSave = async () => {
    if (validationMessage) {
      showMessage(validationMessage);
      return;
    }
    if (!userId) {
      showMessage('No se pudo identificar el usuario actual');
      return;
    }

    setSaving(true);
    try {
      await createCheck({
        total_amount: totalAmountValue,
        account_mutual_id: mutualAccount?.account.id || 0,
        account_client_id: clientAccount?.account.id || 0,
        amount_mutual: mutualAmount,
        amount_client: clientAmount,
        percentage_mutual: mutualPercentValue,
        percentage_bam: bamPercentValue,
        observation: confirmObservation.trim(),
        user_id: userId,
      });
      setConfirmVisible(false);
      handleClear();
      showMessage('Se ha creado el cheque con éxito');
      await onCreated?.();
    } catch (error: any) {
      showMessage(error?.message || 'No se pudo crear el cheque');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.totalCard}>
          <View style={styles.totalIconWrap}>
            <Image source={require('../../../../assets/images/ui/arg.png')} style={styles.totalFlag} />
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalInputWrap}>
            {!generalAmount.trim() ? (
              <Text pointerEvents="none" style={styles.totalPlaceholder}>
                monto total de cheques
              </Text>
            ) : null}
            <TextInput
              value={generalAmount}
              onChangeText={setGeneralAmount}
              style={styles.totalInput}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.percentBox}>
              <Image source={require('../../../../assets/images/ui/bammut.png')} style={styles.percentIcon} />
              <TextInput
                value={mutualPercent}
                onChangeText={setMutualPercent}
                placeholder="mutual"
                placeholderTextColor="#C6BCDA"
                style={styles.percentInput}
                keyboardType="decimal-pad"
              />
              <Text style={styles.percentText}>%</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountValue}>
                {mutualPercent.trim() && generalAmount.trim() ? formatAmountDisplay(mutualCommissionAmount) : ''}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.percentBox}>
              <Image source={require('../../../../assets/images/ui/baml.png')} style={styles.percentIcon} />
              <TextInput
                value={bamPercent}
                onChangeText={setBamPercent}
                placeholder="bam"
                placeholderTextColor="#C6BCDA"
                style={styles.percentInput}
                keyboardType="decimal-pad"
              />
              <Text style={styles.percentText}>%</Text>
            </View>
            <View style={styles.amountBox}>
              <Text style={styles.amountValue}>
                {bamPercent.trim() && generalAmount.trim() ? formatAmountDisplay(bamCommissionAmount) : ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.accountSelectorRow} activeOpacity={0.85} onPress={() => openPicker('client')}>
            <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountSelectorIcon} />
            <Text style={[styles.accountSelectorText, !clientAccount?.account.id ? styles.accountSelectorPlaceholder : null]}>
              {clientAccount?.account.name || 'cuenta cliente'}
            </Text>
            <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountSelectorArrow} />
          </TouchableOpacity>

          <View style={styles.amountWideBox}>
            <Text style={[styles.amountWidePrefix, styles.amountWidePrefixPositive]}>+</Text>
            <Text style={[styles.amountWideText, !canShowClientAmount ? styles.amountWidePlaceholder : null]}>
              {canShowClientAmount
                ? formatAmountDisplay(clientAmount)
                : 'monto a depositar cliente'}
            </Text>
          </View>

          <TouchableOpacity style={styles.accountSelectorRow} activeOpacity={0.85} onPress={() => openPicker('mutual')}>
            <Image source={require('../../../../assets/images/ui/usuviol.png')} style={styles.accountSelectorIcon} />
            <Text style={styles.accountSelectorText}>{mutualAccount?.account.name || 'cuenta mutual'}</Text>
            <Image source={require('../../../../assets/images/ui/downop.png')} style={styles.accountSelectorArrow} />
          </TouchableOpacity>

          <View style={styles.amountWideBox}>
            <Text style={[styles.amountWidePrefix, styles.amountWidePrefixNegative]}>-</Text>
            <Text style={[styles.amountWideText, !canShowMutualAmount ? styles.amountWidePlaceholder : null]}>
              {canShowMutualAmount
                ? formatAmountDisplay(mutualAmount)
                : 'monto a retirar mutual'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.actionHalf}>
            <TouchableOpacity style={styles.clearBtn} activeOpacity={0.85} onPress={handleClear}>
              <Image source={require('../../../../assets/images/ui/limpiar.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.actionHalf}>
            <TouchableOpacity style={styles.createBtn} activeOpacity={0.85} onPress={handleOpenConfirm}>
              <Image source={require('../../../../assets/images/ui/savewhite.png')} style={styles.createIcon} />
              <Text style={styles.createText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AccountPickerDialog
        visible={pickerVisible}
        title={pickerTarget === 'client' ? 'Seleccionar cuenta cliente' : 'Seleccionar cuenta mutual'}
        query={accountQuery}
        onChangeQuery={setAccountQuery}
        accounts={accounts}
        loading={accountsLoading}
        onSelect={handleSelectAccount}
        onClose={() => setPickerVisible(false)}
      />

      <CheckCreateConfirmDialog
        visible={confirmVisible}
        saving={saving}
        totalAmount={formatAmountDisplay(totalAmountValue)}
        mutualPercent={mutualPercentValue}
        mutualCommissionAmount={formatAmountDisplay(mutualCommissionAmount)}
        bamPercent={bamPercentValue}
        bamCommissionAmount={formatAmountDisplay(bamCommissionAmount)}
        clientAccountName={clientAccount?.account.name || '-'}
        clientAmount={formatAmountDisplay(clientAmount)}
        mutualAccountName={mutualAccount?.account.name || '-'}
        mutualAmount={formatAmountDisplay(mutualAmount)}
        observation={confirmObservation}
        onChangeObservation={setConfirmObservation}
        onClose={() => {
          if (saving) return;
          setConfirmVisible(false);
        }}
        onConfirm={handleSave}
      />
    </View>
  );
}
