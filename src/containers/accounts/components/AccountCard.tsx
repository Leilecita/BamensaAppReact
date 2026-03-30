import React, { useMemo, useState } from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import { getFlagSourceByShortName } from '../../../helpers/flagHelper';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { ReportAccount } from '../services/accountService';
import AccountInfoDialog from './AccountInfoDialog';
import styles from './AccountCard.styles';

type AccountCardProps = {
 account: ReportAccount;
 ownMode: boolean;
 showBalances: boolean;
 onAssignToOperation?: (account: ReportAccount) => void;
 onPressMovements?: (account: ReportAccount) => void;
};

const formatAmount = (value: number): string => {
 return value.toFixed(1);
};

export default function AccountCard({
 account,
 ownMode,
 showBalances,
 onAssignToOperation,
 onPressMovements,
}: AccountCardProps) {
 const [expanded, setExpanded] = useState(false);
 const [infoVisible, setInfoVisible] = useState(false);
 const letter = account.account.firstName?.trim()?.charAt(0)?.toUpperCase() || 'A';
 const shouldShowBalances = showBalances;
 const categoryLabel = ownMode ? APP_CONSTANTS.CATEGORY_PERSONAL : account.account.category;
 const phone = account.account.phone?.trim();
 const rawAccount = account.raw?.account ?? account.raw ?? {};

 const accountInfo = useMemo(() => {
  const toStr = (value: unknown) => String(value ?? '').trim();
  const name = toStr(account.account.name) || '-';
  const phoneValue = toStr(phone) || '';
  const category = toStr(categoryLabel) || '';
  const cuit =
   toStr(rawAccount?.cuit) ||
   toStr(rawAccount?.CUIT) ||
   toStr(rawAccount?.tax_id) ||
   toStr(rawAccount?.document) ||
   toStr(rawAccount?.dni);
  const address =
   toStr(rawAccount?.address) ||
   toStr(rawAccount?.direccion) ||
   toStr(rawAccount?.domicilio) ||
   toStr(rawAccount?.street);
  const observation =
   toStr(rawAccount?.observation) ||
   toStr(rawAccount?.observacion) ||
   toStr(rawAccount?.obs) ||
   toStr(rawAccount?.note);
  const startDate =
   toStr(rawAccount?.created) ||
   toStr(account.raw?.created) ||
   toStr(rawAccount?.start_date) ||
   toStr(rawAccount?.date_init) ||
   toStr(rawAccount?.fecha_inicio);

  return {
   name,
   phone: phoneValue,
   category,
   cuit,
   address,
   observation,
   startDate,
  };
 }, [account.account.name, account.raw, categoryLabel, phone, rawAccount]);

 const infoRows = useMemo(
  () => [
   { label: 'Nombre', value: accountInfo.name },
   { label: 'Telefono', value: accountInfo.phone },
   { label: 'Categoria', value: accountInfo.category },
   { label: 'Cuit', value: accountInfo.cuit },
   { label: 'Dirección', value: accountInfo.address },
   { label: 'Observación', value: accountInfo.observation },
   { label: 'Fecha inicio', value: accountInfo.startDate },
  ],
  [accountInfo]
 );

 if (__DEV__ && ownMode) {
  console.log(
   `[AccountCard] ownMode id=${account.account.id} name=${account.account.name} shouldShowBalances=${shouldShowBalances} balanceCount=${account.balance.length}`,
  );
  if (account.balance.length) {
   console.log('[AccountCard] balances =>', account.balance);
  }
 }

 const handleWhatsapp = async () => {
  if (!phone) return;
  const url = `http://api.whatsapp.com/send?phone=+549${phone}`;
  await Linking.openURL(url);
 };

 const handleCall = async () => {
  if (!phone) return;
  const url = `tel:${phone}`;
  await Linking.openURL(url);
 };

 return (
  <>
   <TouchableOpacity
    style={styles.cardTouch}
    activeOpacity={0.92}
    onPress={() => setExpanded((prev) => !prev)}
   >
    <View style={styles.cardInner}>
     <View style={styles.card}>
      <View style={styles.leftCircle}>
       <Image
        source={require('../../../../assets/images/ui/bblanco.png')}
        style={[styles.leftCircleImg, { tintColor: account.account.color || '#9D92B6' }]}
       />
       <Text style={styles.leftCircleText}>{letter}</Text>
      </View>

      <View style={styles.mainInfo}>
       <Text style={styles.nameText} numberOfLines={2}>
        {account.account.name}
       </Text>
       <Text style={styles.categoryText}>{categoryLabel}</Text>
      </View>

      {shouldShowBalances ? (
       <View style={styles.balanceWrap}>
        {(account.balance.length
         ? account.balance
         : [
            {
             coin_id: 0,
             coin_name: 'USD',
             coin_short_name: 'USD',
             sum_debit: 0,
             sum_credit: 0,
             balance: 0,
             pendients: 0,
            },
           ]).map((balance, index) => (
         <View key={`${balance.coin_short_name}-${index}`} style={styles.balanceRow}>
          <Image source={getFlagSourceByShortName(balance.coin_short_name)} style={styles.balanceFlag} />
          <Text style={styles.balanceText}>{formatAmount(balance.balance)}</Text>
         </View>
        ))}
       </View>
      ) : (
       <TouchableOpacity
        style={styles.assignBtn}
        activeOpacity={0.8}
        onPress={() => onAssignToOperation?.(account)}
       >
        <Text style={styles.assignText}>asignar a operacion</Text>
       </TouchableOpacity>
      )}
     </View>

     {expanded ? (
      <View style={styles.actionsRow}>
       <TouchableOpacity
        style={styles.actionSlot}
        activeOpacity={0.8}
        onPress={() => setInfoVisible(true)}
       >
        <Image source={require('../../../../assets/images/ui/informacion.png')} style={styles.actionIcon} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.actionSlot} activeOpacity={0.8} onPress={handleWhatsapp}>
        <Image source={require('../../../../assets/images/ui/ws.png')} style={styles.actionIcon} />
       </TouchableOpacity>
       <TouchableOpacity style={styles.actionSlot} activeOpacity={0.8} onPress={handleCall}>
        <Image source={require('../../../../assets/images/ui/phonesan.png')} style={styles.actionIcon} />
       </TouchableOpacity>
       <TouchableOpacity
        style={styles.movWrap}
        activeOpacity={0.8}
        onPress={() => onPressMovements?.(account)}
       >
        <Image source={require('../../../../assets/images/ui/mov3.png')} style={styles.movImg} />
       </TouchableOpacity>
      </View>
     ) : null}
    </View>
   </TouchableOpacity>

   <AccountInfoDialog visible={infoVisible} rows={infoRows} onClose={() => setInfoVisible(false)} />
  </>
 );
}
