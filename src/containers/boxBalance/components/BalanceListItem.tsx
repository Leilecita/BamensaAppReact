import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppDialog from '../../../core/components/AppDialog';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { dateHelper } from '../../../helpers/dateHelper';
import styles from '../screens/InformationBoxBalanceScreen.styles';
import { deleteBalance, fetchPartnersAccounts, type BalancePartner, type ReportBalance } from '../services/boxBalanceService';
import BalanceDollarizedList from './BalanceDollarizedList';
import DeleteBalanceDialog from './DeleteBalanceDialog';
import BalancePartnersList from './BalancePartnersList';

type Props = {
 item: ReportBalance;
 onDeleted?: (balanceId: number) => void;
};

const formatFixed1 = (value: unknown) => {
 const n = Number(value ?? 0);
 return Number.isFinite(n) ? n.toFixed(1) : '0.0';
};

const canShowAssigned = (item: ReportBalance) => String(item.assignable ?? '').trim().toLowerCase() === 'true';

export default function BalanceListItem({ item, onDeleted }: Props) {
 const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
 const [expanded, setExpanded] = useState(false);
 const [showDollarized, setShowDollarized] = useState(false);
 const [showPartners, setShowPartners] = useState(false);
 const [showDivisionDialog, setShowDivisionDialog] = useState(false);
 const [showDeleteDialog, setShowDeleteDialog] = useState(false);
 const [partnersData, setPartnersData] = useState<any[]>(item.list_partners ?? []);
 const [loadingPartners, setLoadingPartners] = useState(false);

 const assignable = canShowAssigned(item);
 const assigned = String(item.assigned ?? '').trim().toLowerCase() === 'true';
 const dayName = dateHelper.getNameDay(item.created);
 const dayMonth = dateHelper.getDayMonth(item.created);
 const year = dateHelper.getYear(item.created);
 const monthName = dateHelper.getNameMonth2(item.created);
 const hour = dateHelper.onlyHourMinut(dateHelper.getOnlyTime(item.created));
 const containerStyles = [
  styles.balanceItemWrap,
  assignable ? styles.balanceItemAssignable : null,
  expanded && !assignable ? styles.balanceItemExpanded : null,
 ];

 const handleDelete = async (balance: ReportBalance) => {
  await deleteBalance(balance.id);
  onDeleted?.(balance.id);
  Alert.alert('Listo', 'Se ha eliminado el balance');
 };

 useEffect(() => {
  if (!assignable || !showPartners) return;

  let cancelled = false;

  const loadPartners = async () => {
   try {
    setLoadingPartners(true);
    const data = await fetchPartnersAccounts(item.id, 0);
    if (!cancelled) {
     setPartnersData(data);
    }
   } catch (e: any) {
    if (!cancelled) {
     Alert.alert('Error', e?.message || 'No se pudieron cargar los dividendos');
    }
   } finally {
    if (!cancelled) {
     setLoadingPartners(false);
    }
   }
  };

  void loadPartners();

  return () => {
   cancelled = true;
  };
 }, [assignable, item.id, showPartners]);

 return (
  <View style={containerStyles}>
   <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => setExpanded((prev) => !prev)}
    onLongPress={() => {
     if (!assignable) {
      setShowDeleteDialog(true);
     }
    }}
   >
    <View style={styles.balanceHeaderRow}>
     <View style={styles.balanceHeaderLeft}>
      <View style={styles.balanceDateBlock}>
       {assignable ? (
        <>
         <Text style={styles.balanceMonthText}>{monthName}</Text>
         <Text style={styles.balanceDateText}>{dateHelper.onlyDateToShow(item.created)}</Text>
        </>
       ) : (
        <>
         <View style={styles.balanceDateLine}>
          <Text style={styles.balanceDayNameText}>{dayName}</Text>
          <Text style={styles.balanceDateNumberText}>{dayMonth}</Text>
         </View>
         <Text style={styles.balanceYearText}>{year}</Text>
        </>
       )}
      </View>

      <Text style={styles.balanceCurrencyLabel}>USD</Text>
     </View>

     <Text style={styles.balanceGainText}>{formatFixed1(item.gain)}</Text>

     {assignable ? (
      <View style={styles.balanceAssignMarkWrap}>
       {assigned ? (
        <View style={styles.balanceAssignedGreen}>
         <Image
          source={require('../../../../assets/images/ui/bblanco.png')}
          style={styles.balanceAssignedGreenBase}
         />
         <Image source={require('../../../../assets/images/ui/tick2.png')} style={styles.balanceAssignedGreenIcon} />
        </View>
       ) : (
        <Image source={require('../../../../assets/images/ui/pendsan.png')} style={styles.balanceAssignedIcon} />
       )}
      </View>
     ) : null}
    </View>
   </TouchableOpacity>

   {expanded ? (
    <View style={styles.balanceExpandedOptions}>
     <View style={styles.balanceOptionCol}>
      <Image source={require('../../../../assets/images/ui/sessionviol.png')} style={styles.balanceOptionIcon} />
      <View style={styles.balanceOptionLine} />
      <Text style={styles.balanceOptionText}>{item.user_name || '-'}</Text>
      <Text style={styles.balanceOptionText}>{hour} hs</Text>
     </View>

     <TouchableOpacity
      style={styles.balanceOptionCol}
      activeOpacity={0.85}
      onPress={() => {
       setShowPartners(false);
       setShowDollarized((prev) => !prev);
      }}
     >
      <Image source={require('../../../../assets/images/ui/assign.png')} style={styles.balanceOptionIcon} />
      <View style={styles.balanceOptionLine} />
      <Text style={styles.balanceOptionTextCenter}>Saldo monedas</Text>
      <Text style={styles.balanceOptionTextCenter}>dolarizados</Text>
     </TouchableOpacity>

     {assignable ? (
      <TouchableOpacity
       style={styles.balanceOptionCol}
       activeOpacity={0.85}
      onPress={() => {
       setShowDollarized(false);
       setShowPartners((prev) => !prev);
      }}
     >
      <Image source={require('../../../../assets/images/ui/ganancias.png')} style={styles.balanceOptionIcon} />
      <View style={styles.balanceOptionLine} />
      <Text style={styles.balanceOptionTextCenter}>Asignación de dividendos</Text>
     </TouchableOpacity>
     ) : null}
    </View>
   ) : null}

   {expanded && showDollarized ? (
    <>
     <BalanceDollarizedList items={item.list} />
     {assignable ? (
      <View style={styles.balanceRealResultWrap}>
       <Text style={styles.balanceRealResultLabel}>Total exacto USD</Text>
       <View style={styles.balanceRealResultValueWrap}>
        <Text style={styles.balanceRealResultValue}>{formatFixed1(item.real_result_gain)}</Text>
       </View>
      </View>
     ) : null}
   </>
   ) : null}

   {expanded && assignable && showPartners ? (
    loadingPartners ? (
      <View style={styles.createBalanceLoadingWrap}>
       <ActivityIndicator size="small" color="#6f6392" />
      </View>
     ) : (
      <BalancePartnersList
       items={partnersData}
       onPressState={() => {
        setShowDivisionDialog(true);
       }}
      />
     )
   ) : null}

   <View style={styles.summaryDivider} />

   <AppDialog
    visible={showDivisionDialog}
    onClose={() => {
      setShowDivisionDialog(false);
     }}
    backdropStyle={styles.balanceDivisionDialogBackdrop}
    cardStyle={styles.balanceDivisionDialogCard}
   >
    <View style={styles.balanceDivisionDialogMessageRow}>
     <Text style={styles.balanceDivisionDialogTitle}>Desea ir al panel 'Asignar dividendos' ?</Text>
    </View>
    <View style={styles.balanceDivisionDialogActions}>
     <TouchableOpacity
      style={styles.balanceDivisionDialogCancelBtn}
      activeOpacity={0.85}
      onPress={() => {
       setShowDivisionDialog(false);
      }}
     >
      <Text style={styles.balanceDivisionDialogCancelText}>Cancelar</Text>
     </TouchableOpacity>

     <TouchableOpacity
      style={styles.balanceDivisionDialogAcceptBtn}
      activeOpacity={0.85}
      onPress={() => {
       setShowDivisionDialog(false);
       navigation.navigate('divisionBalance', {
        balanceId: item.id,
        result: item.gain,
        dateBalance: item.created,
        partners: partnersData as BalancePartner[],
       });
      }}
     >
      <Text style={styles.balanceDivisionDialogAcceptText}>si</Text>
     </TouchableOpacity>
    </View>
   </AppDialog>

   <DeleteBalanceDialog
    visible={showDeleteDialog}
    balance={item}
    onClose={() => setShowDeleteDialog(false)}
    onDelete={handleDelete}
   />
  </View>
 );
}
