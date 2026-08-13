import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { ReportCheck, savePartialLoader } from '../services/checkService';
import styles from './CheckRejectionDialog.styles';

type Props = {
  visible: boolean;
  item: ReportCheck;
  onClose: () => void;
  onSaved: (nextCheck: ReportCheck) => void | Promise<void>;
};

const formatAmountDisplay = (value: number) =>
  Math.round(Number(value || 0)).toLocaleString('en-US');

const parseDecimal = (value: string) => {
  const parsed = Number(String(value).replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function CheckRejectionDialog({ visible, item, onClose, onSaved }: Props) {
  const [amountRejected, setAmountRejected] = useState('');
  const [clientPercent, setClientPercent] = useState('2.5');
  const [clientAdmin, setClientAdmin] = useState('500');
  const [mutualPercent, setMutualPercent] = useState('2.2');
  const [mutualAdmin, setMutualAdmin] = useState('500');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setAmountRejected('');
    setClientPercent('2.5');
    setClientAdmin('500');
    setMutualPercent('2.2');
    setMutualAdmin('500');
    setSaving(false);
  }, [visible, item.operation_id]);

  const pendingAmount = Math.max(0, item.total_amount - item.total_approve_amount - item.rejected_amount);
  const alreadyRejected = item.rejected_amount > 0;
  const rejectedValue = parseDecimal(amountRejected);
  const clientPercentValue = parseDecimal(clientPercent);
  const clientAdminValue = parseDecimal(clientAdmin);
  const mutualPercentValue = parseDecimal(mutualPercent);
  const mutualAdminValue = parseDecimal(mutualAdmin);

  const hasRejectionAmount = amountRejected.trim() !== '' && rejectedValue > 0;
  const hasAllInputs =
    amountRejected.trim() !== '' &&
    clientPercent.trim() !== '' &&
    clientAdmin.trim() !== '' &&
    mutualPercent.trim() !== '' &&
    mutualAdmin.trim() !== '';

  const amountClient = hasAllInputs ? rejectedValue * clientPercentValue / 100 + clientAdminValue : 0;
  const amountMutual = hasAllInputs ? rejectedValue * mutualPercentValue / 100 + mutualAdminValue : 0;
  const amountCaja = hasAllInputs ? amountClient - amountMutual : 0;

  const exceedsPending = hasRejectionAmount && rejectedValue > pendingAmount;
  const completesPending = hasRejectionAmount && rejectedValue === pendingAmount;
  const canSave = hasAllInputs && !alreadyRejected && !exceedsPending && rejectedValue > 0;

  const handleSave = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    try {
      const nextCheck = await savePartialLoader({
        op_id: item.operation_id,
        account_client_id: item.account_client_id,
        account_mutual_id: item.account_mutual_id,
        amount_mutual: amountMutual,
        amount_client: amountClient,
        amount_bam: amountCaja,
        number_parcial: 0,
        approve_amount: 0,
        type: 'rejection',
        amount_rejected: rejectedValue,
        check_detail_id: item.check_detail_id,
        state_parcial: completesPending ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT,
      });
      await onSaved(nextCheck);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const clientAccountName = useMemo(() => item.account_client_name || '-', [item.account_client_name]);
  const mutualAccountName = useMemo(() => item.account_mutual_name || '-', [item.account_mutual_name]);

  return (
    <AppDialog
      visible={visible}
      onClose={onClose}
      keyboardAware
      keyboardGap={14}
      backdropStyle={styles.backdrop}
      cardStyle={styles.card}
    >
      <Text style={styles.title}>CARGA MONTO RECHAZADO</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabelPrimary}>Monto total cheques</Text>
        <Text style={styles.summaryValuePrimary}>{formatAmountDisplay(item.total_amount)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabelSecondary}>Monto pendiente aprob</Text>
        <Text style={styles.summaryValueSecondary}>{formatAmountDisplay(pendingAmount)}</Text>
      </View>

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Monto a rechazar</Text>
        <TextInput
          value={amountRejected}
          onChangeText={setAmountRejected}
          style={styles.input}
          keyboardType="decimal-pad"
        />
      </View>

      {alreadyRejected ? <Text style={styles.messageError}>Este cheque ya tiene un monto rechazado cargado.</Text> : null}

      <View style={styles.sectionBlock}>
        <View style={styles.accountSection}>
          <Text style={styles.accountSectionLabel}>Retiro cta cliente: </Text>
          <Text style={styles.accountSectionName}>{clientAccountName}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.percentInputWrap}>
            <Text style={styles.percentSymbol}>%</Text>
            <TextInput
              value={clientPercent}
              onChangeText={setClientPercent}
              style={styles.breakdownInput}
              keyboardType="decimal-pad"
            />
          </View>
          <TextInput
            value={clientAdmin}
            onChangeText={setClientAdmin}
            style={styles.adminInput}
            keyboardType="decimal-pad"
          />
          <Text style={styles.breakdownAmount}>{hasAllInputs ? formatAmountDisplay(amountClient) : ''}</Text>
        </View>
      </View>

      <View style={styles.sectionBlock}>
        <View style={styles.accountSection}>
          <Text style={styles.accountSectionLabel}>Depósito cta mutual: </Text>
          <Text style={styles.accountSectionName}>{mutualAccountName}</Text>
        </View>

        <View style={styles.breakdownRow}>
          <View style={styles.percentInputWrap}>
            <Text style={styles.percentSymbol}>%</Text>
            <TextInput
              value={mutualPercent}
              onChangeText={setMutualPercent}
              style={styles.breakdownInput}
              keyboardType="decimal-pad"
            />
          </View>
          <TextInput
            value={mutualAdmin}
            onChangeText={setMutualAdmin}
            style={styles.adminInput}
            keyboardType="decimal-pad"
          />
          <Text style={styles.breakdownAmount}>{hasAllInputs ? formatAmountDisplay(amountMutual) : ''}</Text>
        </View>
      </View>

      <View style={styles.boxRow}>
        <View style={styles.boxLeft}>
          <Text style={styles.accountSectionLabel}>Depósito Bamensa:</Text>
          <Text style={styles.boxName}>Caja general</Text>
        </View>
        <Text style={styles.boxAmount}>{hasAllInputs ? formatAmountDisplay(amountCaja) : ''}</Text>
      </View>

      {exceedsPending ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            El monto a rechazar ingresado es mayor al monto pendiente por aprobar.
          </Text>
          <View style={styles.errorBannerIconWrap}>
            <Text style={styles.errorBannerIcon}>X</Text>
          </View>
        </View>
      ) : null}

      <View style={[styles.actions, exceedsPending ? styles.actionsSingle : null]}>
        <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.85} onPress={onClose} disabled={saving}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
        {!exceedsPending ? (
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={!canSave || saving}
          >
            {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveText}>Guardar</Text>}
          </TouchableOpacity>
        ) : null}
      </View>
    </AppDialog>
  );
}
