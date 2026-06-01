import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppDialog from '../../../core/components/AppDialog';
import AppTopBar from '../../../core/components/AppTopBar';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { usePaginatedFetch } from '../../../core/hooks/usePaginatedFetch';
import { dateHelper } from '../../../helpers/dateHelper';
import { formatAmount1Decimal } from '../../../helpers/valuesHelper';
import styles from './InformationBoxBalanceScreen.styles';
import {
 areAllBalancePartnersAssigned,
 assignBalancePartnerDividend,
 BalancePartner,
 calculateBalancePartnerAmount,
 fetchPartnersAccounts,
 formatBalancePartnerParticipation,
 getBalancePartnerDisplayName,
 isBalancePartnerAssigned,
} from '../services/boxBalanceService';

type DivisionBalanceRoute = RouteProp<AppStackParamList, 'divisionBalance'>;
type DivisionBalanceNav = NativeStackNavigationProp<AppStackParamList, 'divisionBalance'>;

export default function DivisionBalanceScreen() {
 const navigation = useNavigation<DivisionBalanceNav>();
 const route = useRoute<DivisionBalanceRoute>();
 const { balanceId, result, dateBalance } = route.params;
 const [savingPartner, setSavingPartner] = useState(false);
 const [selectedPartner, setSelectedPartner] = useState<BalancePartner | null>(null);
 const [showExitDialog, setShowExitDialog] = useState(false);

 const fetchPartnersPage = useCallback(
  async (page: number) => fetchPartnersAccounts(balanceId, page),
  [balanceId],
 );

 const {
  data: loadedPartners,
  loading,
  loadingMore,
  error,
  loadMore,
  setData: setLoadedPartners,
 } = usePaginatedFetch<BalancePartner>(fetchPartnersPage, [balanceId]);

 const dateText = dateHelper.onlyDate(dateHelper.changeFormatDate(dateBalance));
 const selectedPartnerAmount = selectedPartner
  ? calculateBalancePartnerAmount(selectedPartner.participation, result)
  : 0;
 const allAssigned = useMemo(() => areAllBalancePartnersAssigned(loadedPartners), [loadedPartners]);

 const errorMessage = useMemo(
  () => error || 'No se pudieron cargar los dividendos',
  [error],
 );

 const handleExitAttempt = () => {
  if (allAssigned) {
   navigation.goBack();
   return;
  }

  setShowExitDialog(true);
 };

 const handleAssignPartner = async () => {
  if (!selectedPartner) return;

  try {
   setSavingPartner(true);
   const updatedPartner = await assignBalancePartnerDividend({
    partner: selectedPartner,
    totalValue: result,
   });

   setLoadedPartners((prev) =>
    prev.map((partner) =>
     partner.id === selectedPartner.id
      ? updatedPartner
      : partner,
    ),
   );

   setSelectedPartner(null);
   Alert.alert('Listo', 'La operación ha sido realizada con éxito');
  } catch (e: any) {
   Alert.alert('Error', e?.message || 'No se pudo asignar el dividendo');
  } finally {
   setSavingPartner(false);
  }
 };

 return (
  <View style={styles.divisionScreen}>
   <AppTopBar title="Asignar dividendos" leftSymbol="←" onPressLeft={handleExitAttempt} />

   <View style={styles.divisionResultBar}>
    <Text style={styles.divisionResultLabel}>Resultado financiero</Text>
    <Text style={styles.divisionResultCurrency}>USD</Text>
    <Text style={styles.divisionResultValue}>{formatAmount1Decimal(result)}</Text>
   </View>

   <View style={styles.divisionDateBar}>
    <Text style={styles.divisionDateText}>{dateText}</Text>
   </View>

   <View style={styles.divisionListWrap}>
    {loading ? (
     <View style={styles.createBalanceLoadingWrap}>
      <ActivityIndicator size="small" color="#6f6392" />
     </View>
    ) : error && loadedPartners.length === 0 ? (
     <View style={styles.createBalanceLoadingWrap}>
      <Text style={styles.emptyText}>{errorMessage}</Text>
     </View>
    ) : (
     <FlatList
      data={loadedPartners}
      keyExtractor={(item, index) => `${item.name}-${item.surname}-${index}`}
      contentContainerStyle={styles.divisionListContent}
      onEndReachedThreshold={0.45}
      onEndReached={() => {
       loadMore();
      }}
      renderItem={({ item }) => (
       <View style={styles.divisionPartnerCardWrap}>
        <View style={styles.divisionPartnerCard}>
         <View style={styles.divisionPartnerNameBlock}>
          <Text style={styles.divisionPartnerName}>{item.name}</Text>
          {item.surname ? <Text style={styles.divisionPartnerSurname}>{item.surname}</Text> : null}
         </View>

         <View style={styles.divisionPartnerAmountBox}>
          <Text style={styles.divisionPartnerAmountText}>
           {formatAmount1Decimal(calculateBalancePartnerAmount(item.participation, result))}
          </Text>
         </View>

         <View style={styles.divisionPartnerPercentBox}>
          <Text style={styles.divisionPartnerPercentText}>
           {formatBalancePartnerParticipation(item.participation)}
          </Text>
          <Text style={styles.divisionPartnerPercentSign}>%</Text>
         </View>

         <TouchableOpacity
          style={styles.divisionPartnerStateWrap}
          activeOpacity={0.85}
          onPress={() => {
           if (isBalancePartnerAssigned(item)) {
            Alert.alert('Atención', `El resultado de ${item.name} ya fue asignado`);
            return;
           }
           setSelectedPartner(item);
          }}
         >
          {isBalancePartnerAssigned(item) ? (
           <View style={styles.divisionPartnerStateDone}>
            <Image
             source={require('../../../../assets/images/ui/bblanco.png')}
             style={styles.divisionPartnerStateDoneBase}
            />
            <Image
             source={require('../../../../assets/images/ui/tick2.png')}
             style={styles.divisionPartnerStateDoneIcon}
            />
           </View>
          ) : (
           <Image
            source={require('../../../../assets/images/ui/pendsan.png')}
            style={styles.divisionPartnerStatePendingIcon}
           />
          )}
         </TouchableOpacity>
        </View>
       </View>
      )}
      ListFooterComponent={
       loadingMore ? (
        <View style={styles.balanceFooterWrap}>
         <ActivityIndicator size="small" color="#6f6392" />
         <Text style={styles.balanceFooterText}>Cargando mas socios...</Text>
        </View>
       ) : null
      }
     />
    )}
   </View>

   <View style={styles.divisionBottomBar}>
    <TouchableOpacity
     style={styles.divisionDoneButton}
     activeOpacity={0.85}
     onPress={handleExitAttempt}
    >
     <Text style={styles.divisionDoneButtonText}>Listo</Text>
    </TouchableOpacity>
   </View>

   <AppDialog
    visible={!!selectedPartner}
    onClose={() => {
     if (!savingPartner) {
      setSelectedPartner(null);
     }
    }}
   backdropStyle={styles.balanceDivisionDialogBackdrop}
    cardStyle={styles.balanceDivisionDialogCard}
   >
    <View style={styles.divisionAssignDialogAmountRow}>
     <Text style={styles.divisionAssignDialogAmountText}>USD {formatAmount1Decimal(selectedPartnerAmount)}</Text>
    </View>
    <View style={styles.divisionAssignDialogMessageWrap}>
     <Text style={styles.divisionAssignDialogMessageText}>
     Desea retirar de la Caja y depositar el monto detallado en la cuenta de
     </Text>
     <Text style={styles.divisionAssignDialogPartnerName}>
      {selectedPartner ? getBalancePartnerDisplayName(selectedPartner) : ''}
     </Text>
    </View>
    <View style={styles.balanceDivisionDialogActions}>
     <TouchableOpacity
      style={styles.balanceDivisionDialogCancelBtn}
      activeOpacity={0.85}
      disabled={savingPartner}
      onPress={() => setSelectedPartner(null)}
     >
      <Text style={styles.balanceDivisionDialogCancelText}>Cancelar</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={styles.balanceDivisionDialogAcceptBtn}
      activeOpacity={0.85}
      disabled={savingPartner}
      onPress={() => void handleAssignPartner()}
   >
      <Text style={styles.balanceDivisionDialogAcceptText}>{savingPartner ? 'Guardando...' : 'Confirmar'}</Text>
     </TouchableOpacity>
    </View>
   </AppDialog>

   <AppDialog
    visible={showExitDialog}
    onClose={() => setShowExitDialog(false)}
    backdropStyle={styles.balanceDivisionDialogBackdrop}
    cardStyle={styles.balanceDivisionDialogCard}
   >
    <View style={styles.balanceDivisionDialogMessageRow}>
     <Text style={styles.balanceDivisionDialogTitle}>Volver a balances sin asignar todos los dividendos?</Text>
    </View>
    <View style={styles.balanceDivisionDialogActions}>
     <TouchableOpacity
      style={styles.balanceDivisionDialogCancelBtn}
      activeOpacity={0.85}
      onPress={() => setShowExitDialog(false)}
     >
      <Text style={styles.balanceDivisionDialogCancelText}>Cancelar</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={styles.balanceDivisionDialogAcceptBtn}
      activeOpacity={0.85}
      onPress={() => {
       setShowExitDialog(false);
       navigation.goBack();
      }}
     >
      <Text style={styles.balanceDivisionDialogAcceptText}>si</Text>
     </TouchableOpacity>
    </View>
   </AppDialog>
  </View>
 );
}
