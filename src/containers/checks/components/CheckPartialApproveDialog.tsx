import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AppDialog from '../../../core/components/AppDialog';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { ReportCheck, savePartialLoader } from '../services/checkService';
import styles from './CheckPartialApproveDialog.styles';

type Props = {
  visible: boolean;
  item: ReportCheck;
  mode: 'partial' | 'total';
  onClose: () => void;
  onSaved: (nextCheck: ReportCheck) => void | Promise<void>;
};

const formatAmountDisplay = (value: number) =>
  Math.round(Number(value || 0)).toLocaleString('en-US');

export default function CheckPartialApproveDialog({ visible, item, mode, onClose, onSaved }: Props) {
  const [amountApproved, setAmountApproved] = useState('');
  const [saving, setSaving] = useState(false);
  const isTotalMode = mode === 'total';

  useEffect(() => {
    if (!visible) return;
    setAmountApproved(isTotalMode ? String(item.total_amount || '') : '');
    setSaving(false);
  }, [visible, item.operation_id, item.total_amount, isTotalMode]);

  const pendingAmount = Math.max(0, item.total_amount - item.total_approve_amount - item.rejected_amount);
  const parsedAmount = Number(amountApproved.replace(',', '.'));
  const hasAmount = amountApproved.trim() !== '' && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const amountToApprove = isTotalMode ? item.total_amount : hasAmount ? parsedAmount : 0;
  const amountComision1 = amountToApprove * item.percentage_mutual / 100;
  const amountComision2 = amountToApprove * item.percentage_bam / 100;
  const amountClient = isTotalMode ? item.amount_client : amountToApprove - amountComision1 - amountComision2;
  const amountMutual = isTotalMode ? item.amount_mutual : amountToApprove - amountComision1;
  const exceedsPending = !isTotalMode && hasAmount && amountToApprove > pendingAmount;
  const completesPending = !isTotalMode && hasAmount && amountToApprove === pendingAmount;
  const canSave = isTotalMode ? item.total_amount > 0 : hasAmount && !exceedsPending;

  const percentageMutualText = useMemo(() => String(item.percentage_mutual), [item.percentage_mutual]);
  const percentageBamText = useMemo(() => String(item.percentage_bam), [item.percentage_bam]);

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
        amount_bam: amountComision2,
        number_parcial: isTotalMode ? 1 : item.count_parcial_loader + 1,
        approve_amount: amountToApprove,
        type: isTotalMode ? 'total' : 'parcial',
        amount_rejected: 0,
        check_detail_id: item.check_detail_id,
        state_parcial: isTotalMode ? '' : completesPending ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT,
      });
      await onSaved(nextCheck);
      onClose();
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
      <Text style={styles.title}>{isTotalMode ? 'CARGA TOTAL' : 'CARGA PARCIAL'}</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabelPrimary}>Monto total cheques</Text>
        <Text style={styles.summaryValuePrimary}>{formatAmountDisplay(item.total_amount)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabelSecondary}>Monto pendiente aprob</Text>
        <Text style={styles.summaryValueSecondary}>{formatAmountDisplay(isTotalMode ? 0 : pendingAmount)}</Text>
      </View>

      {item.rejected_amount > 0 ? (
        <View style={[styles.summaryRow, styles.rejectedRow]}>
          <Text style={[styles.summaryLabelSecondary, styles.rejectedLabel]}>Monto rechazado</Text>
          <Text style={[styles.summaryValueSecondary, styles.rejectedLabel]}>
            {formatAmountDisplay(item.rejected_amount)}
          </Text>
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Monto aprobado</Text>
        <TextInput
          value={amountApproved}
          onChangeText={setAmountApproved}
          style={styles.input}
          keyboardType="decimal-pad"
          editable={!isTotalMode}
        />
      </View>

      <View style={styles.commissionRow}>
        <View style={styles.commissionLeft}>
          <Image source={require('../../../../assets/images/ui/bammut.png')} style={styles.commissionIcon} />
          <Text style={styles.commissionLabel} />
          <Text style={styles.commissionPercentValue}>{percentageMutualText}</Text>
          <Text style={styles.commissionPercent}>%</Text>
        </View>
        <View style={styles.commissionAmountWrap}>
          <Text style={styles.commissionAmountValue}>{hasAmount ? formatAmountDisplay(amountComision1) : ''}</Text>
        </View>
      </View>

      <View style={styles.commissionRow}>
        <View style={styles.commissionLeft}>
          <Image source={require('../../../../assets/images/ui/baml.png')} style={styles.commissionIcon} />
          <Text style={styles.commissionLabel} />
          <Text style={styles.commissionPercentValue}>{percentageBamText}</Text>
          <Text style={styles.commissionPercent}>%</Text>
        </View>
        <View style={styles.commissionAmountWrap}>
          <Text style={styles.commissionAmountValue}>{hasAmount ? formatAmountDisplay(amountComision2) : ''}</Text>
        </View>
      </View>

      <View style={styles.accountRow1}>
        <View style={styles.accountLeft}>
          <Text style={styles.accountLabel}>Depósito cuenta cliente</Text>
          <Text style={styles.accountName}>{item.account_client_name || '-'}</Text>
        </View>
        <View style={styles.accountAmountWrap}>
          <Text style={styles.accountAmountValue}>{hasAmount ? formatAmountDisplay(amountClient) : ''}</Text>
        </View>
      </View>

      <View style={styles.accountRow2}>
        <View style={styles.accountLeft}>
          <Text style={styles.accountLabel}>Retiro cuenta mutual</Text>
          <Text style={styles.accountName}>{item.account_mutual_name || '-'}</Text>
        </View>
        <View style={styles.accountAmountWrap}>
          <Text style={styles.accountAmountValue}>{hasAmount ? formatAmountDisplay(amountMutual) : ''}</Text>
        </View>
      </View>

      {isTotalMode || completesPending ? (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerText}>
            {isTotalMode
              ? 'El monto total del cheque sera aprobado. La operacion pasara a aprobada.'
              : 'El monto aprobado es igual al monto pendiente de aprobacion, la operacion pasara a aprobada.'}
          </Text>
          <View style={styles.successBannerIconWrap}>
            <Image source={require('../../../../assets/images/ui/tick2.png')} style={styles.successBannerIcon} />
          </View>
        </View>
      ) : null}

      {exceedsPending ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            El monto a aprobar ingresado es mayor al monto pendiente para aprobar.
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
