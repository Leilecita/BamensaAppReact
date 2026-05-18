import React, { useEffect, useMemo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Alert, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { formatDateDdMmYyyy } from '../../../helpers/dateHelper';
import { formatAmount1Decimal, formatRate1Decimal } from '../../../helpers/valuesHelper';
import { ReportOperation } from '../services/operationService';
import DeleteOperationDialog from './DeleteOperationDialog';
import styles from './OperationCard.styles';

type OperationCardProps = {
 operation: ReportOperation;
 expanded?: boolean;
 defaultExpanded?: boolean;
 onToggleExpanded?: (next: boolean) => void;
 onDeleteOperation?: (operation: ReportOperation) => Promise<void>;
 onUpdateOperation?: (input: {
  operation: ReportOperation;
  observation: string;
 }) => Promise<void> | void;
 onChangeItemState?: (input: {
  operation: ReportOperation;
  side: 'in' | 'out';
  itemId: number;
  nextState: string;
 }) => Promise<void> | void;
 onAffectClient?: (input: {
  operation: ReportOperation;
  side: 'in' | 'out';
 }) => Promise<void> | void;
 wrapperStyle?: StyleProp<ViewStyle>;
};

export default function OperationCard({
 operation,
 expanded,
 defaultExpanded = false,
 onToggleExpanded,
 onDeleteOperation,
 onUpdateOperation,
 onChangeItemState,
 onAffectClient,
 wrapperStyle,
}: OperationCardProps) {
 const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
 const [inStateLocal, setInStateLocal] = useState(operation.item_in?.state ?? APP_CONSTANTS.STATE_DONE);
 const [outStateLocal, setOutStateLocal] = useState(operation.item_out?.state ?? APP_CONSTANTS.STATE_DONE);
 const [changingIn, setChangingIn] = useState(false);
 const [changingOut, setChangingOut] = useState(false);
 const [infoDialogVisible, setInfoDialogVisible] = useState(false);
 const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
 const [editingObservation, setEditingObservation] = useState(false);
 const [savingObservation, setSavingObservation] = useState(false);
 const [affectConfirmSide, setAffectConfirmSide] = useState<'in' | 'out' | null>(null);
 const [savingAffect, setSavingAffect] = useState(false);
 const isControlled = typeof expanded === 'boolean';
 const isExpanded = isControlled ? Boolean(expanded) : localExpanded;

 const inCoin = operation.item_in?.coin ?? '-';
 const outCoin = operation.item_out?.coin ?? '-';
 const inAmount = formatAmount1Decimal(operation.item_in?.credit);
 const outAmount = formatAmount1Decimal(operation.item_out?.debit);
 const exchange = formatRate1Decimal(operation.exchange);
 const accountName = operation.account_name || operation.item_in?.client_name_account || 'Varios';
 const operationAny = operation as ReportOperation & { user_name?: string; observation?: string };
 const userName = operationAny.user_name ?? '-';
 const [observationLocal, setObservationLocal] = useState(operationAny.observation ?? '');
 const [observationDraft, setObservationDraft] = useState(operationAny.observation ?? '');

 useEffect(() => {
  setInStateLocal(operation.item_in?.state ?? APP_CONSTANTS.STATE_DONE);
  setOutStateLocal(operation.item_out?.state ?? APP_CONSTANTS.STATE_DONE);
  const nextObs = operationAny.observation ?? '';
  setObservationLocal(nextObs);
  setObservationDraft(nextObs);
  setEditingObservation(false);
 }, [operation.operation_id, operation.item_in?.state, operation.item_out?.state]);

 const inPending = inStateLocal === APP_CONSTANTS.STATE_PENDIENT;
 const outPending = outStateLocal === APP_CONSTANTS.STATE_PENDIENT;

 const accountId = parseInt(
  String(operation.account_id ?? operation.item_in?.account_id ?? operation.item_out?.account_id ?? 0),
  10
 );
 const nota = String(operation.nota ?? operation.item_in?.nota ?? operation.item_out?.nota ?? '');
 const affectInEnabled = nota.includes(APP_CONSTANTS.AFFECT_ACI);
 const affectOutEnabled = nota.includes(APP_CONSTANTS.AFFECT_ACO);
 const showAffectRow = accountId > APP_CONSTANTS.CUENTA_VARIOS;

 const isCompra = operation.type?.toLowerCase() === APP_CONSTANTS.TYPE_COMPRA;
 const typeImage = useMemo(
  () =>
   isCompra
    ? require('../../../../assets/images/ui/log8.png')
    : require('../../../../assets/images/ui/log9.png'),
  [isCompra]
 );

 const stateIconIn = inPending
  ? require('../../../../assets/images/ui/pendsan.png')
  : require('../../../../assets/images/ui/donesan.png');
 const stateIconOut = outPending
  ? require('../../../../assets/images/ui/pendsan.png')
  : require('../../../../assets/images/ui/donesan.png');

 const toggleExpanded = () => {
  const next = !isExpanded;
  if (!isControlled) {
   setLocalExpanded(next);
  }
  onToggleExpanded?.(next);
 };

 const handlePressMoreInfo = () => {
  setInfoDialogVisible(true);
 };

 const handlePressDeleteFromInfo = () => {
  closeInfoDialog();
  if (onDeleteOperation) {
   setDeleteDialogVisible(true);
   return;
  }
  Alert.alert('Acción no disponible', 'No se puede borrar desde esta pantalla.');
 };

 const closeInfoDialog = () => setInfoDialogVisible(false);
 const closeAffectConfirm = () => {
  if (savingAffect) return;
  setAffectConfirmSide(null);
 };

 const handleStartEditObservation = () => {
  setObservationDraft(observationLocal ?? '');
  setEditingObservation(true);
 };

 const handleCancelEditObservation = () => {
  setObservationDraft(observationLocal ?? '');
  setEditingObservation(false);
 };

 const handleSaveObservation = async () => {
  const nextValue = observationDraft.trim();
  try {
   setSavingObservation(true);
   if (onUpdateOperation) {
    await onUpdateOperation({
     operation,
     observation: nextValue,
    });
   }
   setObservationLocal(nextValue);
   setEditingObservation(false);
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo actualizar la observación');
  } finally {
   setSavingObservation(false);
  }
 };

 const handleToggleState = async (side: 'in' | 'out') => {
  const note = String(operation.nota ?? operation.item_in?.nota ?? operation.item_out?.nota ?? '');
  if (side === 'in' && note.includes(APP_CONSTANTS.AFFECT_ACI)) {
   Alert.alert('No permitido', 'No se puede cambiar el estado de la operación si afecta a un cliente.');
   return;
  }
  if (side === 'out' && note.includes(APP_CONSTANTS.AFFECT_ACO)) {
   Alert.alert('No permitido', 'No se puede cambiar el estado de la operación si afecta a un cliente.');
   return;
  }

  const current = side === 'in' ? inStateLocal : outStateLocal;
  const nextState = current === APP_CONSTANTS.STATE_PENDIENT ? APP_CONSTANTS.STATE_DONE : APP_CONSTANTS.STATE_PENDIENT;
  const itemId = Number(side === 'in' ? operation.item_in?.id ?? 0 : operation.item_out?.id ?? 0);

  if (!itemId) {
   Alert.alert('Error', 'No se pudo identificar el item de la operación.');
   return;
  }

  try {
   if (side === 'in') setChangingIn(true);
   if (side === 'out') setChangingOut(true);
   await onChangeItemState?.({ operation, side, itemId, nextState });
   if (side === 'in') setInStateLocal(nextState);
   if (side === 'out') setOutStateLocal(nextState);
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo cambiar el estado de la operación');
  } finally {
   if (side === 'in') setChangingIn(false);
   if (side === 'out') setChangingOut(false);
  }
 };

 const handlePressAffect = (side: 'in' | 'out') => {
  const note = String(operation.nota ?? operation.item_in?.nota ?? operation.item_out?.nota ?? '');
  if (side === 'in' && note.includes(APP_CONSTANTS.AFFECT_ACI)) return;
  if (side === 'out' && note.includes(APP_CONSTANTS.AFFECT_ACO)) return;

  const currentState = side === 'in' ? operation.item_in?.state : operation.item_out?.state;
  if (currentState !== APP_CONSTANTS.STATE_DONE) {
   Alert.alert('Operación pendiente', 'No se puede afectar al cliente si la operacion esta PENDIENTE.');
   return;
  }

  setAffectConfirmSide(side);
 };

 const handleConfirmAffect = async () => {
  if (!affectConfirmSide || !onAffectClient) return;

  try {
   setSavingAffect(true);
   await onAffectClient({ operation, side: affectConfirmSide });
   setAffectConfirmSide(null);
  } catch (error: any) {
   Alert.alert('Error', error?.message || 'No se pudo afectar al cliente.');
  } finally {
   setSavingAffect(false);
  }
 };

 const renderSummaryItem = (forDialog = false) => (
  <View style={forDialog ? styles.infoDialogIncludedItem : undefined}>
   <View style={styles.summaryRow}>
    <View style={styles.sideCol}>
     <View style={styles.amountRowLeft}>
      <Text style={styles.coinText}>{inCoin}</Text>
      <Text style={styles.amountText}>{inAmount}</Text>
     </View>
     <View style={styles.subRowLeft}>
      {inPending ? (
       <Image source={require('../../../../assets/images/ui/pendsan.png')} style={styles.pendingIconLeft} />
      ) : null}
      <Text style={styles.accountName}>{accountName}</Text>
     </View>
    </View>

    <Image source={typeImage} style={styles.typeImage} />

    <View style={styles.sideColRight}>
     <View style={styles.amountRowRight}>
      <Text style={styles.coinText}>{outCoin}</Text>
      <Text style={styles.amountText}>{outAmount}</Text>
     </View>
     <View style={styles.subRowRight}>
      <Text
       style={styles.rateText}
       numberOfLines={1}
       ellipsizeMode="tail"
       adjustsFontSizeToFit
       minimumFontScale={0.8}
      >
       {inCoin} 1 = {outCoin} {exchange}
      </Text>
      {outPending ? (
       <Image source={require('../../../../assets/images/ui/pendsan.png')} style={styles.pendingIconRight} />
      ) : null}
     </View>
    </View>
   </View>
  </View>
 );

 return (
  <View style={[styles.wrapper, wrapperStyle]}>
   <View style={styles.card}>
    <TouchableOpacity activeOpacity={0.95} onPress={toggleExpanded}>
     {renderSummaryItem()}
    </TouchableOpacity>

    {isExpanded ? (
     <View style={styles.expanded}>
      {showAffectRow ? (
       <View style={styles.affectRow}>
        <View style={styles.affectColLeft}>
         <TouchableOpacity activeOpacity={0.8} onPress={() => handlePressAffect('in')} disabled={savingAffect}>
          <Image
           source={
            affectInEnabled
             ? require('../../../../assets/images/ui/saleccliente2.png')
             : require('../../../../assets/images/ui/salecliente.png')
           }
           style={styles.affectIcon}
          />
         </TouchableOpacity>
        </View>
        <View style={styles.affectColRight}>
         <TouchableOpacity activeOpacity={0.8} onPress={() => handlePressAffect('out')} disabled={savingAffect}>
          <Image
           source={
            affectOutEnabled
             ? require('../../../../assets/images/ui/entraccliente.png')
             : require('../../../../assets/images/ui/entraccliente2.png')
           }
           style={styles.affectIcon}
          />
         </TouchableOpacity>
        </View>
       </View>
      ) : null}

      <View style={styles.stateRow}>
        <View style={styles.stateSideLeft}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleToggleState('in')} disabled={changingIn}>
         <Image source={stateIconIn} style={styles.stateIcon} />
        </TouchableOpacity>
       </View>
        <View style={styles.stateCenter}>
        <View style={styles.changeStatesInline}>
         <Image source={require('../../../../assets/images/ui/left.png')} style={styles.changeStatesArrowImg} />
         <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={styles.changeStatesText}>
          Cambiar estados
         </Text>
         <Image source={require('../../../../assets/images/ui/righhh.png')} style={styles.changeStatesArrowImg} />
        </View>
       </View>
       <View style={styles.stateSideRight}>
        <TouchableOpacity activeOpacity={0.8} onPress={() => handleToggleState('out')} disabled={changingOut}>
         <Image source={stateIconOut} style={styles.stateIcon} />
        </TouchableOpacity>
       </View>
      </View>

      <View style={styles.infoRow}>
       <View style={styles.dateWrap}>
        <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.dateIcon} />
        <Text style={styles.dateText}>{formatDateDdMmYyyy(operation.operation_created)}</Text>
       </View>
       <TouchableOpacity style={styles.moreInfoWrap} onPress={handlePressMoreInfo} activeOpacity={0.8}>
        <Image source={require('../../../../assets/images/ui/info.png')} style={styles.infoIcon} />
        <Text style={styles.moreInfoText}>mas info</Text>
       </TouchableOpacity>
      </View>

      {observationLocal?.trim() ? (
       <Text style={styles.observationText}>{observationLocal}</Text>
      ) : null}
     </View>
    ) : null}
   </View>

  <Modal
   visible={infoDialogVisible}
   transparent
   animationType="fade"
   onRequestClose={closeInfoDialog}
  >
    <Pressable style={styles.infoDialogBackdrop} onPress={closeInfoDialog}>
     <Pressable style={styles.infoDialogCard} onPress={() => {}}>
      <View style={styles.infoDialogContent}>
       <View style={styles.infoDialogHeader}>
        <Text style={styles.infoDialogType}>{operation.type?.toUpperCase() || '-'}</Text>
       </View>

       <View style={styles.infoDialogSummaryCard}>
        {renderSummaryItem(true)}

        {showAffectRow && affectInEnabled ? (
         <View style={styles.infoDialogAffectInWrap}>
          <Image
           source={require('../../../../assets/images/ui/saleccliente2.png')}
           style={styles.infoDialogAffectIcon}
          />
         </View>
        ) : null}
        {showAffectRow && affectOutEnabled ? (
         <View style={styles.infoDialogAffectOutWrap}>
          <Image
           source={require('../../../../assets/images/ui/entraccliente.png')}
           style={styles.infoDialogAffectIcon}
          />
         </View>
        ) : null}
       </View>

       <View style={[styles.infoDialogMetaRow, styles.infoDialogMetaRowFirst]}>
        <View style={styles.infoDialogMetaIconCol}>
         <Image source={require('../../../../assets/images/ui/dateviol.png')} style={styles.infoDialogMetaIcon} />
        </View>
        <View style={styles.infoDialogMetaValueCol}>
         <Text style={styles.infoDialogMetaText} numberOfLines={1}>
          {operation.operation_created || '-'}
         </Text>
        </View>
       </View>

       <View style={styles.infoDialogMetaRow}>
        <View style={styles.infoDialogMetaIconCol}>
         <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.infoDialogMetaIcon} />
        </View>
        <View style={styles.infoDialogMetaValueCol}>
         <Text style={styles.infoDialogMetaText} numberOfLines={1}>
          {userName}
         </Text>
        </View>
       </View>

       <View style={styles.infoDialogMetaRow}>
       <View style={styles.infoDialogMetaIconCol}>
         <Image source={require('../../../../assets/images/ui/documento.png')} style={styles.infoDialogMetaIcon} />
        </View>
        <View style={styles.infoDialogMetaValueCol}>
         {editingObservation ? (
          <TextInput
           value={observationDraft}
           onChangeText={setObservationDraft}
           style={styles.infoDialogObsInput}
           placeholder="agregar observacion"
           placeholderTextColor="#8f8f97"
          />
         ) : (
          <Text style={styles.infoDialogMetaText}>
           {observationLocal?.trim() ? observationLocal : 'Sin observación'}
          </Text>
         )}
        </View>
       </View>

       {editingObservation ? (
        <View style={styles.infoDialogSaveRow}>
         <TouchableOpacity onPress={handleCancelEditObservation} style={styles.infoDialogSaveCancelBtn} activeOpacity={0.8}>
          <Text style={styles.infoDialogSaveCancelText}>Cancelar</Text>
         </TouchableOpacity>
         <TouchableOpacity
          onPress={handleSaveObservation}
          style={styles.infoDialogSaveBtn}
          activeOpacity={0.8}
          disabled={savingObservation}
         >
          {savingObservation ? (
           <ActivityIndicator size="small" color="#fff" />
          ) : (
           <Text style={styles.infoDialogSaveText}>Guardar</Text>
          )}
         </TouchableOpacity>
        </View>
       ) : (
        <View style={styles.infoDialogActions}>
         <TouchableOpacity
          style={styles.infoDialogActionBtn}
          activeOpacity={0.8}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={handlePressDeleteFromInfo}
         >
          <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.infoDialogActionIcon} />
         </TouchableOpacity>
         <TouchableOpacity style={styles.infoDialogActionBtn} activeOpacity={0.8} onPress={handleStartEditObservation}>
          <Image source={require('../../../../assets/images/ui/editsan.png')} style={styles.infoDialogActionIcon} />
         </TouchableOpacity>
        </View>
       )}
      </View>
     </Pressable>
   </Pressable>
   </Modal>

   <Modal
    visible={Boolean(affectConfirmSide)}
    transparent
    animationType="fade"
    onRequestClose={closeAffectConfirm}
   >
   <Pressable style={styles.infoDialogBackdrop} onPress={closeAffectConfirm}>
     <Pressable style={styles.affectConfirmCard} onPress={() => {}}>
      <View style={styles.affectConfirmContent}>
       <Text style={styles.affectConfirmTitle}>Afecta cliente</Text>
       <View style={styles.affectConfirmTextWrap}>
       <Text style={styles.affectConfirmText}>
         {affectConfirmSide === 'in' ? (
          <>
           {'Se efectuará el '}
           <Text style={styles.affectConfirmTextStrong}>{`retiro de ${inAmount || '0'} ${inCoin}`}</Text>
           {' de la cuenta del cliente.'}
          </>
         ) : (
          <>
           {'Se efectuará el '}
           <Text style={styles.affectConfirmTextStrong}>{`depósito de ${outAmount || '0'} ${outCoin}`}</Text>
           {' en la cuenta del cliente.'}
          </>
         )}
        </Text>
       </View>
       <View style={styles.affectConfirmActions}>
        <TouchableOpacity
         onPress={closeAffectConfirm}
         style={styles.affectConfirmCancelBtn}
         activeOpacity={0.8}
         disabled={savingAffect}
        >
         <Text style={styles.affectConfirmCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
         onPress={handleConfirmAffect}
         style={styles.affectConfirmOkBtn}
         activeOpacity={0.8}
         disabled={savingAffect}
        >
         {savingAffect ? (
          <ActivityIndicator size="small" color="#fff" />
         ) : (
          <Text style={styles.affectConfirmOkText}>Continuar</Text>
         )}
        </TouchableOpacity>
       </View>
      </View>
     </Pressable>
    </Pressable>
   </Modal>

   {onDeleteOperation ? (
    <DeleteOperationDialog
     visible={deleteDialogVisible}
     operation={operation}
     onClose={() => setDeleteDialogVisible(false)}
     onDelete={onDeleteOperation}
    />
   ) : null}
  </View>
 );
}
