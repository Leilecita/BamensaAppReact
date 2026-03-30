import React, { useMemo, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { formatDateDdMmYyyy } from '../../../helpers/dateHelper';
import { formatAmount1Decimal, formatRate1Decimal } from '../../../helpers/valuesHelper';
import { ReportOperation } from '../services/operationService';
import styles from './OperationCard.styles';

type OperationCardProps = {
 operation: ReportOperation;
 expanded?: boolean;
 defaultExpanded?: boolean;
 onToggleExpanded?: (next: boolean) => void;
 onPressMoreInfo?: (operation: ReportOperation) => void;
 wrapperStyle?: StyleProp<ViewStyle>;
};

export default function OperationCard({
 operation,
 expanded,
 defaultExpanded = false,
 onToggleExpanded,
 onPressMoreInfo,
 wrapperStyle,
}: OperationCardProps) {
 const [localExpanded, setLocalExpanded] = useState(defaultExpanded);
 const [infoDialogVisible, setInfoDialogVisible] = useState(false);
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
 const observation = operationAny.observation ?? '-';

 const inPending = operation.item_in?.state === APP_CONSTANTS.STATE_PENDIENT;
 const outPending = operation.item_out?.state === APP_CONSTANTS.STATE_PENDIENT;

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
  if (onPressMoreInfo) {
   onPressMoreInfo(operation);
  }
  setInfoDialogVisible(true);
 };

 const closeInfoDialog = () => setInfoDialogVisible(false);

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
   <TouchableOpacity style={styles.card} activeOpacity={0.95} onPress={toggleExpanded}>
    {renderSummaryItem()}

    {isExpanded ? (
     <View style={styles.expanded}>
      {showAffectRow ? (
       <View style={styles.affectRow}>
        <View style={styles.affectColLeft}>
         <Image
          source={
           affectInEnabled
            ? require('../../../../assets/images/ui/saleccliente2.png')
            : require('../../../../assets/images/ui/salecliente.png')
          }
          style={styles.affectIcon}
         />
        </View>
        <View style={styles.affectColRight}>
         <Image
          source={
           affectOutEnabled
            ? require('../../../../assets/images/ui/entraccliente.png')
            : require('../../../../assets/images/ui/entraccliente2.png')
          }
          style={styles.affectIcon}
         />
        </View>
       </View>
      ) : null}

      <View style={styles.stateRow}>
       <View style={styles.stateSideLeft}>
        <Image source={stateIconIn} style={styles.stateIcon} />
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
        <Image source={stateIconOut} style={styles.stateIcon} />
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
     </View>
    ) : null}
   </TouchableOpacity>

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
         <Text style={styles.infoDialogMetaText}>{observation?.trim() ? observation : 'Sin observación'}</Text>
        </View>
       </View>

       <View style={styles.infoDialogActions}>
        <TouchableOpacity style={styles.infoDialogActionBtn} activeOpacity={0.8}>
         <Image source={require('../../../../assets/images/ui/deletesan.png')} style={styles.infoDialogActionIcon} />
        </TouchableOpacity>
       <TouchableOpacity style={styles.infoDialogActionBtn} activeOpacity={0.8}>
         <Image source={require('../../../../assets/images/ui/editsan.png')} style={styles.infoDialogActionIcon} />
        </TouchableOpacity>
       </View>
      </View>
     </Pressable>
    </Pressable>
   </Modal>
  </View>
 );
}
