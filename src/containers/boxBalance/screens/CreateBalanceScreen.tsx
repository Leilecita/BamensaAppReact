import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppDialog from '../../../core/components/AppDialog';
import AppTopBar from '../../../core/components/AppTopBar';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { AuthContext } from '../../../contexts/AuthContext';
import { getAppVariant } from '../../../core/theme/appVariant';
import { dateHelper } from '../../../helpers/dateHelper';
import { getFlagSourceByShortName } from '../../../helpers/flagHelper';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import styles from './InformationBoxBalanceScreen.styles';
import { fetchTotalBoxCoins } from '../services/boxBalanceService';
import {
 BalanceDraftRow,
 calculateTotalUsd,
 createDraftRows,
 getAutoUsdValue,
 hasAllRatesLoaded,
 parseNumberInput,
 saveCreateBalance,
} from '../services/createBalanceFlowService';

type CreateBalanceNav = NativeStackNavigationProp<AppStackParamList, 'createBalance'>;
type CreateBalanceRoute = RouteProp<AppStackParamList, 'createBalance'>;

const formatBalanceLikeAndroid = (value: number) => formatAmount1Decimal(value);

export default function CreateBalanceScreen() {
  const navigation = useNavigation<CreateBalanceNav>();
  useRoute<CreateBalanceRoute>();
  const { userId } = useContext(AuthContext);
  const isFisherton = getAppVariant() === 'fisherton';
  const [rows, setRows] = useState<BalanceDraftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [manualTotal, setManualTotal] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTotalBoxCoins();
        setRows(createDraftRows(data));
      } catch (e: any) {
        setError(e?.message || 'No se pudo cargar el balance');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const totalUsd = useMemo(() => calculateTotalUsd(rows), [rows]);
  const allRatesLoaded = useMemo(() => hasAllRatesLoaded(rows), [rows]);

  const updateRow = (coinId: number, key: 'rate', value: string) => {
    setRows((prev) =>
      prev.map((item) =>
        item.coin_id === coinId
          ? {
            ...item,
            [key]: value,
          }
          : item,
      ),
    );
  };

  const ensureReadyToSave = () => {
    if (!userId) {
      Alert.alert('Atención', 'No se pudo identificar el usuario actual.');
      return false;
    }

    if (!allRatesLoaded) {
      Alert.alert('Atención', 'Todos las monedas deben tener cargado su coeficiente');
      return false;
    }

    return true;
  };

  const handleSave = async (assignable: boolean, overriddenTotal?: number) => {
    if (!ensureReadyToSave()) return;

    try {
      setSaving(true);
      const gain = overriddenTotal ?? totalUsd;
      const createdDate = dateHelper.getActualDate();
      const created = await saveCreateBalance({
        rows,
        userId: Number(userId ?? 0),
        gain,
        assignable,
        isFisherton,
        createdDate,
      });

      if (assignable) {
        if (isFisherton) {
          navigation.goBack();
          return;
        }
        navigation.replace('divisionBalance', {
          balanceId: created.id,
          result: gain,
          dateBalance: created.created || createdDate,
          partners: [],
        });
        return;
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo crear el balance');
    } finally {
      setSaving(false);
    }
  };

  const openAssignDialog = () => {
    if (!ensureReadyToSave()) return;
    setManualTotal('');
    setSaveDialogVisible(true);
  };

  const confirmAssign = async () => {
    const nextTotal = parseNumberInput(manualTotal);
    if (nextTotal <= 0) {
      Alert.alert('Atención', 'Ingresá un total válido.');
      return;
    }

    setSaveDialogVisible(false);
    await handleSave(true, nextTotal);
  };

  return (
    <View style={styles.createBalanceScreen}>
      <AppTopBar title="Generar balance" leftSymbol="←" onPressLeft={() => navigation.goBack()} />

      <View style={styles.createBalanceHeaderBar}>
        <View style={styles.createBalanceHeaderTopRow}>
          <Text style={styles.createBalanceHeaderMainLabel}>Saldo</Text>
          <Text style={styles.createBalanceHeaderMainLabelSecondary}>Saldo</Text>
          <View style={styles.createBalanceHeaderInvisibleDivider} />
          <Text style={styles.createBalanceHeaderMainLabelRight}>Cambio</Text>
        </View>
        <View style={styles.createBalanceHeaderBottomRow}>
          <Text style={styles.createBalanceHeaderBottomSpacer}> </Text>
          <Text style={styles.createBalanceHeaderSubLabel}>en usd</Text>
          <View style={styles.createBalanceHeaderInvisibleDivider} />
          <Text style={styles.createBalanceHeaderSubLabelRight}>mayorista</Text>
        </View>
      </View>

      <View style={styles.createBalanceDateBar}>
        <Text style={styles.createBalanceDateText}>{dateHelper.onlyDateToShow(dateHelper.getActualDate())}</Text>
      </View>

      {loading ? (
        <View style={styles.createBalanceLoadingWrap}>
          <ActivityIndicator size="small" color="#6f6392" />
        </View>
      ) : error ? (
        <View style={styles.createBalanceLoadingWrap}>
          <Text style={styles.emptyText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => `${item.coin_id}-${item.coin_short_name}`}
          contentContainerStyle={styles.createBalanceListContent}
          renderItem={({ item }) => (
            <View style={styles.createBalanceItemWrap}>
              <View style={styles.createBalanceRow}>
                <View style={styles.createBalanceCoinBlock}>
                  <Image source={getFlagSourceByShortName(item.coin_short_name)} style={styles.createBalanceFlag} />
                  <Text style={styles.createBalanceCode}>{item.coin_short_name}</Text>
                </View>

                <View style={styles.createBalanceValuesWrap}>
                  <Text style={styles.createBalanceAmount}>{formatBalanceLikeAndroid(item.balance)}</Text>

                  <View style={styles.createBalanceInputCard}>
                    <Text style={styles.createBalanceInputLeft}>
                      {(() => {
                        const autoUsd = getAutoUsdValue(item.balance, item.coin_short_name, item.rate);
                        return autoUsd === null ? '' : formatAmount1Decimal(autoUsd);
                      })()}
                    </Text>
                    <View style={styles.createBalanceDivider}>
                      {Array.from({ length: 7 }).map((_, index) => (
                        <View key={index} style={styles.createBalanceDividerDot} />
                      ))}
                    </View>
                    <TextInput
                      value={item.rate}
                      onChangeText={(value) => updateRow(item.coin_id, 'rate', value)}
                      keyboardType="decimal-pad"
                      style={styles.createBalanceInputRight}
                      placeholder=""
                      placeholderTextColor="#bfb9cf"
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <View style={styles.createBalanceBottomPanel}>
        <View style={styles.createBalanceFooterWrap}>
          <View style={styles.createBalanceFooterRow}>
            <View style={styles.createBalanceFooterGhostCoinBlock}>
              <View style={styles.createBalanceFooterGhostFlag} />
              <Text style={styles.createBalanceFooterGhostCode}> </Text>
            </View>

            <View style={styles.createBalanceValuesWrap}>
              <Text style={styles.createBalanceTotalLabel}>Total</Text>

              <View style={styles.createBalanceInputCard}>
                <Text style={styles.createBalanceFooterValue}>
                  {totalUsd ? formatAmount1Decimal(totalUsd) : ''}
                </Text>
                <View style={styles.createBalanceDivider}>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <View key={index} style={styles.createBalanceDividerDot} />
                  ))}
                </View>
                <View style={styles.createBalanceFooterValueRight} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.createBalanceActionsRow}>
          <TouchableOpacity style={styles.createBalanceCloseBtn} activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <Text style={styles.createBalanceCloseText}>X</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createBalancePrimaryBtn}
            activeOpacity={0.85}
            disabled={saving}
            onPress={() => void handleSave(false)}
          >
            <Text style={styles.createBalancePrimaryText}>Guardar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createBalancePrimaryBtnWide}
            activeOpacity={0.85}
            disabled={saving}
            onPress={openAssignDialog}
          >
            <Text style={styles.createBalancePrimaryText}>Guardar y asignar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AppDialog
        visible={saveDialogVisible}
        onClose={() => setSaveDialogVisible(false)}
        keyboardAware
        cardStyle={styles.createBalanceEditDialogCard}
        backdropStyle={styles.balanceDivisionDialogBackdrop}
      >
    <View style={styles.createBalanceEditDialogBody}>
      <View style={styles.createBalanceEditDialogAmountRow}>
        <Text style={styles.createBalanceEditDialogCurrency}>USD</Text>
        <Text style={styles.createBalanceEditDialogAmountValue}>{formatAmount1Decimal(totalUsd)}</Text>
      </View>

      {isFisherton ? (
        <Text style={styles.createBalanceEditDialogFishertonNote}>
          Esta operación realizará un DEPOSITO en la cuenta Sucursal Centro de la APP Fisherton y un
          RETIRO en la cuenta Sucursal Fisherton de la App Principal
        </Text>
      ) : null}

      <View style={styles.createBalanceEditDialogInputCard}>
            <Text style={styles.createBalanceEditDialogInputLabel}>Redondear a</Text>
            <View style={styles.createBalanceEditDialogDivider}>
              {Array.from({ length: 7 }).map((_, index) => (
                <View key={index} style={styles.createBalanceEditDialogDividerDot} />
              ))}
            </View>
            <TextInput
              value={manualTotal}
              onChangeText={setManualTotal}
              keyboardType="decimal-pad"
              style={styles.createBalanceEditDialogInput}
              placeholder=""
              placeholderTextColor="#bfb9cf"
            />
            <View style={styles.createBalanceEditDialogInputEndSpacer} />
          </View>

          <View style={styles.createBalanceEditDialogActions}>
            <TouchableOpacity
              style={styles.createBalanceEditDialogCancelBtn}
              activeOpacity={0.85}
              onPress={() => setSaveDialogVisible(false)}
            >
              <Text style={styles.createBalanceEditDialogCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.createBalanceEditDialogSaveBtn}
              activeOpacity={0.85}
              disabled={saving}
              onPress={() => void confirmAssign()}
            >
              <Text style={styles.createBalanceEditDialogSaveText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AppDialog>
    </View>
  );
}
