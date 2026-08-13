import React, { useState } from 'react';
import { Alert, Image, Platform, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { dateHelper } from '../../../helpers/dateHelper';
import CheckInfoDialog from './CheckInfoDialog';
import CheckDeleteOperationDialog from './CheckDeleteOperationDialog';
import CheckLoadItem from './CheckLoadItem';
import CheckPartialApproveDialog from './CheckPartialApproveDialog';
import CheckRejectionDialog from './CheckRejectionDialog';
import { deleteCheckOperation, ReportCheck } from '../services/checkService';
import styles from '../screens/ChecksScreen.styles';

type Props = {
  item: ReportCheck;
  state: 'pendient' | 'done';
  onCheckChanged?: (nextCheck: ReportCheck) => void | Promise<void>;
};

const formatAmount = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
};

const formatAmountDisplay = (value: number) =>
  Math.round(Number(value || 0)).toLocaleString('en-US');

function CheckDotDivider({
  count,
  containerStyle,
  dotStyle,
}: {
  count: number;
  containerStyle?: object;
  dotStyle?: object;
}) {
  return (
    <View style={[styles.checkDotDivider, containerStyle]}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={[styles.checkDotDividerDot, dotStyle]} />
      ))}
    </View>
  );
}

export default function CheckCard({ item, state, onCheckChanged }: Props) {
  const [infoExpanded, setInfoExpanded] = useState(false);
  const [infoDialogVisible, setInfoDialogVisible] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [partialDialogVisible, setPartialDialogVisible] = useState(false);
  const [totalDialogVisible, setTotalDialogVisible] = useState(false);
  const [rejectionDialogVisible, setRejectionDialogVisible] = useState(false);
  const [showCommissionAmounts, setShowCommissionAmounts] = useState(false);
  const [deletingOperation, setDeletingOperation] = useState(false);
  const amountLabel = 'Total cheque';
  const amountValue = item.total_amount;
  const pending = state === 'pendient';
  const hasPartialItems = item.items.length > 0;
  const hasRejectedAmount = item.rejected_amount > 0;
  const pendingAmount = Math.max(0, item.total_amount - item.total_approve_amount - item.rejected_amount);
  const mutualCommissionAmount = item.total_amount - item.amount_mutual;
  const bamCommissionAmount = (item.percentage_bam * item.total_amount) / 100;
  const footerDateSource = state === 'done' ? item.approve_date : item.operation_created;
  const footerDate = dateHelper.onlyDayMonth(footerDateSource).replace('-', '/');
  const footerStatus = state === 'done' ? 'aprobado' : 'pendiente';
  const centerStatusIcon = pending
    ? require('../../../../assets/images/ui/pendsan.png')
    : require('../../../../assets/images/ui/donesan.png');

  const showMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
      return;
    }
    Alert.alert('Atención', message);
  };

  const handleDeleteOperation = async () => {
    if (!item.operation_id || deletingOperation) return;
    setDeletingOperation(true);
    try {
      await deleteCheckOperation(item.operation_id);
      setDeleteDialogVisible(false);
      setInfoDialogVisible(false);
      setInfoExpanded(false);
      await onCheckChanged?.(item);
      showMessage('Se ha eliminado el cheque');
    } catch (error: any) {
      showMessage(error?.message || 'No se pudo eliminar el cheque');
    } finally {
      setDeletingOperation(false);
    }
  };

  return (
    <View style={[styles.checkCard, state === 'pendient' ? styles.checkCardPending : styles.checkCardApproved]}>
      <View style={styles.checkTitleRow}>
        <View style={styles.checkLeftColumn}>
          <View style={styles.checkCardTitleRow}>
            <Image source={require('../../../../assets/images/ui/check.png')} style={styles.checkLeadIcon} />
            <Text style={styles.checkCardPartyValue}>{item.account_client_name || '-'}</Text>
          </View>
        </View>
        <View style={styles.checkMiddleColumn}>
          <Image source={centerStatusIcon} style={styles.checkCenterBadge} />
        </View>
        <View style={styles.checkRightColumn}>
          <Text style={styles.checkCardAmountLabel}>{amountLabel}</Text>
        </View>
      </View>

      <View style={styles.checkMainRow}>
        <View style={styles.checkLeftColumn}>
          <View style={styles.checkRatesWrap}>
            <TouchableOpacity
              style={styles.checkRateRow}
              activeOpacity={0.85}
              onPress={() => setShowCommissionAmounts((prev) => !prev)}
            >
              <Image source={require('../../../../assets/images/ui/bammut.png')} style={styles.checkRateIcon} />
              <View style={styles.checkRateBadge}>
                <Text style={styles.checkRateValue}>
                  {showCommissionAmounts ? `$ ${formatAmount(mutualCommissionAmount)}` : formatAmount(item.percentage_mutual)}
                </Text>
                {!showCommissionAmounts ? <Text style={styles.checkRatePercent}>%</Text> : null}
                <Image source={require('../../../../assets/images/ui/changeop.png')} style={styles.checkRateSwap} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkRateRow}
              activeOpacity={0.85}
              onPress={() => setShowCommissionAmounts((prev) => !prev)}
            >
              <Image source={require('../../../../assets/images/ui/baml.png')} style={styles.checkRateIcon} />
              <View style={styles.checkRateBadge}>
                <Text style={styles.checkRateValue}>
                  {showCommissionAmounts ? `$ ${formatAmount(bamCommissionAmount)}` : formatAmount(item.percentage_bam)}
                </Text>
                {!showCommissionAmounts ? <Text style={styles.checkRatePercent}>%</Text> : null}
                <Image source={require('../../../../assets/images/ui/changeop.png')} style={styles.checkRateSwap} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.checkMiddleColumn}>
          <CheckDotDivider count={22} containerStyle={styles.checkMainGuide} />
        </View>
        <View style={styles.checkRightColumn}>
          <Text style={styles.checkCardAmountValue}>{formatAmountDisplay(amountValue)}</Text>
        </View>
      </View>

      {!pending && item.items.length ? (
        <View style={styles.checkApprovedLoadsWrap}>
          {item.items.map((load, index) => (
            <CheckLoadItem
              key={`${item.check_detail_id}-${load.created}-${index}`}
              item={load}
              pending={false}
              parentLoadType={item.load_type}
              checkDetailId={item.check_detail_id}
            />
          ))}
        </View>
      ) : null}

      {pending ? (
        <>
          {hasPartialItems ? (
            <View style={styles.checkPendingLoadsWrap}>
              {item.items.map((load, index) => (
                <CheckLoadItem
                  key={`${item.check_detail_id}-${load.created}-${index}`}
                  item={load}
                  pending={pending}
                  parentLoadType={item.load_type}
                  checkDetailId={item.check_detail_id}
                  onDeleted={async () => {
                    await onCheckChanged?.(item);
                  }}
                />
              ))}
            </View>
          ) : null}

          {hasPartialItems ? (
            <View style={styles.checkPendingLoadedAmountRow}>
              <Text style={styles.checkPendingLoadedAmountLabel}>monto pendiente aprob</Text>
              <Text style={styles.checkPendingLoadedAmountValue}>{formatAmountDisplay(pendingAmount)}</Text>
            </View>
          ) : null}

          <View style={styles.checkPendingButtonsRow}>
            {!hasPartialItems ? (
              <TouchableOpacity
                style={styles.checkPendingActionWrap}
                activeOpacity={0.85}
                onPress={() => {
                  setInfoExpanded(false);
                  setRejectionDialogVisible(false);
                  setPartialDialogVisible(false);
                  setTotalDialogVisible(true);
                }}
              >
                <View style={styles.checkPendingActionBtn}>
                  <Text style={styles.checkPendingActionText}>aprob total</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.checkPendingActionSpacer} />
            )}

            <TouchableOpacity
              style={styles.checkPendingActionWideWrap}
              activeOpacity={0.85}
              onPress={() => {
                setInfoExpanded(false);
                setRejectionDialogVisible(false);
                setTotalDialogVisible(false);
                setPartialDialogVisible(true);
              }}
            >
              <View style={styles.checkPendingActionWideBtn}>
                <Text style={styles.checkPendingActionText}>aprob parcial</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      {pending ? (
        !hasRejectedAmount ? (
          <View style={styles.checkPendingBottomRowWithLabel}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setInfoExpanded((prev) => !prev);
              }}
            >
              <Text style={styles.checkPendingBottomLabel}>cargar rechazo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkPendingArrowBtn}
              activeOpacity={0.8}
              onPress={() => {
                setInfoExpanded((prev) => !prev);
              }}
            >
              <Image
                source={
                  infoExpanded
                    ? require('../../../../assets/images/ui/arrowsan.png')
                    : require('../../../../assets/images/ui/arrowdown.png')
                }
                style={[styles.checkArrowIcon, infoExpanded ? styles.checkArrowIconExpandedSpacing : null]}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.checkPendingBottomRowArrowOnly}>
            <TouchableOpacity
              style={styles.checkPendingArrowBtnSolo}
              activeOpacity={0.8}
              onPress={() => {
                setInfoExpanded((prev) => !prev);
              }}
            >
              <Image
                source={
                  infoExpanded
                    ? require('../../../../assets/images/ui/arrowsan.png')
                    : require('../../../../assets/images/ui/arrowdown.png')
                }
                style={[styles.checkArrowIcon, infoExpanded ? styles.checkArrowIconExpandedSpacing : null]}
              />
            </TouchableOpacity>
          </View>
        )
      ) : (
        <TouchableOpacity
          style={styles.checkArrowWrap}
          activeOpacity={0.8}
          onPress={() => {
            setInfoExpanded((prev) => !prev);
          }}
        >
          <Image
            source={
              infoExpanded
                ? require('../../../../assets/images/ui/arrowsan.png')
                : require('../../../../assets/images/ui/arrowdown.png')
            }
            style={[styles.checkArrowIcon, infoExpanded ? styles.checkArrowIconExpandedSpacing : null]}
          />
        </TouchableOpacity>
      )}

      {!pending && infoExpanded ? (
        <View style={styles.checkInfoExpandedApproved}>
          <TouchableOpacity
            style={styles.checkMoreInfoRowApproved}
            activeOpacity={0.85}
            onPress={() => setInfoDialogVisible(true)}
          >
            <Image source={require('../../../../assets/images/ui/info.png')} style={styles.checkMoreInfoIcon} />
            <Text style={styles.checkMoreInfoText}>mas info</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {pending && infoExpanded ? (
        <View style={styles.checkInfoExpanded}>
          <View style={styles.checkPendingInfoActionsRow}>
            {!hasRejectedAmount ? (
              <TouchableOpacity
                style={styles.checkPendingRejectBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setInfoExpanded(false);
                  setPartialDialogVisible(false);
                  setTotalDialogVisible(false);
                  setRejectionDialogVisible(true);
                }}
              >
                <Text style={styles.checkPendingRejectBtnText}>cargar monto rechazado</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.checkMoreInfoRowPending}
              activeOpacity={0.85}
              onPress={() => setInfoDialogVisible(true)}
            >
              <Image source={require('../../../../assets/images/ui/info.png')} style={styles.checkMoreInfoIcon} />
              <Text style={styles.checkMoreInfoText}>mas info</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <CheckInfoDialog
        visible={infoDialogVisible}
        item={item}
        state={state}
        onClose={() => setInfoDialogVisible(false)}
        onPressDelete={() => {
          setInfoDialogVisible(false);
          setDeleteDialogVisible(true);
        }}
      />
      <CheckDeleteOperationDialog
        visible={deleteDialogVisible}
        item={item}
        deleting={deletingOperation}
        onClose={() => {
          if (deletingOperation) return;
          setDeleteDialogVisible(false);
        }}
        onConfirm={handleDeleteOperation}
      />
      <CheckPartialApproveDialog
        visible={partialDialogVisible}
        item={item}
        mode="partial"
        onClose={() => setPartialDialogVisible(false)}
        onSaved={async (nextCheck) => {
          await onCheckChanged?.(nextCheck);
        }}
      />
      <CheckPartialApproveDialog
        visible={totalDialogVisible}
        item={item}
        mode="total"
        onClose={() => setTotalDialogVisible(false)}
        onSaved={async (nextCheck) => {
          await onCheckChanged?.(nextCheck);
        }}
      />
      <CheckRejectionDialog
        key={`rejection-${item.operation_id}-${rejectionDialogVisible ? 'open' : 'closed'}`}
        visible={rejectionDialogVisible}
        item={item}
        onClose={() => setRejectionDialogVisible(false)}
        onSaved={async (nextCheck) => {
          await onCheckChanged?.(nextCheck);
        }}
      />
    </View>
  );
}
