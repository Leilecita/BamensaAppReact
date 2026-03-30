import React, { useEffect, useMemo, useState } from 'react';
import {
 ActivityIndicator,
 FlatList,
 Image,
 ScrollView,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from 'react-native';
import AppBottomSheet from '../../../core/components/AppBottomSheet';
import AppTopBar from '../../../core/components/AppTopBar';
import { APP_CONSTANTS } from '../../../core/constants/appConstants';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../../../core/navigation/AppStack';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import AccountCard from '../components/AccountCard';
import { useAccounts } from '../hooks/useAccounts';
import styles from './AccountsScreen.styles';

type AccountsTab = 'clients' | 'own';

type CategoryFilter = {
 key: string;
 label: string;
 icon: any;
};

const CATEGORY_FILTERS: CategoryFilter[] = [
 { key: APP_CONSTANTS.TYPE_ALL, label: 'Todos', icon: require('../../../../assets/images/ui/filtall.png') },
 { key: APP_CONSTANTS.CATEGORY_BASIC, label: 'Basic', icon: require('../../../../assets/images/ui/basic.png') },
 { key: APP_CONSTANTS.CATEGORY_GOLD, label: 'Gold', icon: require('../../../../assets/images/ui/gold.png') },
 { key: APP_CONSTANTS.CATEGORY_PLATINUM, label: 'Platinum', icon: require('../../../../assets/images/ui/platinium.png') },
 { key: APP_CONSTANTS.CATEGORY_BLACK, label: 'Black', icon: require('../../../../assets/images/ui/black.png') },
];

export default function AccountsScreen() {
 const { navigateTo } = useSideMenu();
 const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
 const [tab, setTab] = useState<AccountsTab>('clients');
 const [query, setQuery] = useState('');
 const [category, setCategory] = useState<string>(APP_CONSTANTS.TYPE_ALL);
 const [showBalances, setShowBalances] = useState(false);
 const sheetHeight = 200;
 const sheetPeek = 90;

 const { accounts, loading, loadingMore, error, loadMore, reload } = useAccounts({
  mode: tab,
  query: query.trim().toLowerCase(),
  category,
 });

 useEffect(() => {
  if (tab === 'own') {
   setShowBalances(true);
   return;
  }
  setShowBalances(false);
 }, [tab]);

 const visibleAccounts = useMemo(() => {
  // Mientras no tengamos endpoint separado de "cuentas propias",
  // usamos la misma fuente y mantenemos el cambio visual por tab.
  return accounts;
 }, [accounts]);

 const handleAssignToOperation = (selectedAccount: (typeof accounts)[number]) => {
  navigateTo('home', {
   selectedAccount: {
    id: selectedAccount.account.id,
    name: selectedAccount.account.name,
   },
  });
 };

 const handlePressMovements = (selectedAccount: (typeof accounts)[number]) => {
  navigation.navigate('informationByAccount', {
   accountId: selectedAccount.account.id,
   accountName: selectedAccount.account.name,
   balances: selectedAccount.balance.map((item) => ({
    coin_id: item.coin_id,
    coin_short_name: item.coin_short_name,
    balance: item.balance,
   })),
  });
 };

 return (
  <View style={styles.screen}>
   <AppTopBar title="Cuentas" leftSymbol="←" onPressLeft={() => navigateTo('home')} />

   <View style={styles.tabsRow}>
    <TouchableOpacity
     style={[styles.tabBtn, tab === 'clients' ? styles.tabBtnActive : null]}
     activeOpacity={0.8}
     onPress={() => setTab('clients')}
    >
     <Text style={[styles.tabText, tab === 'clients' ? styles.tabTextActive : null]}>cuentas clientes</Text>
    </TouchableOpacity>
    <TouchableOpacity
     style={[styles.tabBtn, tab === 'own' ? styles.tabBtnActive : null]}
     activeOpacity={0.8}
     onPress={() => setTab('own')}
    >
     <Text style={[styles.tabText, tab === 'own' ? styles.tabTextActive : null]}>cuentas propias</Text>
    </TouchableOpacity>
   </View>

   {tab === 'clients' ? (
    <View style={styles.searchWrap}>
     <Text style={styles.searchIcon}>⌕</Text>
     <TextInput
      value={query}
      onChangeText={setQuery}
      placeholder="Buscar"
      style={styles.searchInput}
      placeholderTextColor="#8f8f97"
     />
    </View>
   ) : null}

   <FlatList
    data={visibleAccounts}
    keyExtractor={(item) => item.account.id.toString()}
    contentContainerStyle={styles.listContent}
    renderItem={({ item }) => (
     <AccountCard
      account={item}
      ownMode={tab === 'own'}
      showBalances={showBalances}
      onAssignToOperation={handleAssignToOperation}
      onPressMovements={handlePressMovements}
     />
    )}
    onEndReached={loadMore}
    onEndReachedThreshold={0.4}
    ListEmptyComponent={
      <View style={styles.emptyWrap}>
       {loading ? <ActivityIndicator size="small" color="#6f6392" /> : null}
       <Text style={styles.emptyText}>
        {loading
         ? 'Cargando cuentas...'
         : error
          ? 'No se pudieron cargar las cuentas'
          : 'No hay cuentas para mostrar'}
       </Text>
       {error ? (
        <TouchableOpacity activeOpacity={0.8} onPress={reload}>
         <Text style={styles.emptyText}>Reintentar</Text>
        </TouchableOpacity>
       ) : null}
      </View>
    }
    ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#6f6392" /> : null}
   />

   <AppBottomSheet
    height={sheetHeight}
    peekHeight={sheetPeek}
    arrowSource={require('../../../../assets/images/ui/arrowsan.png')}
    containerStyle={styles.bottomSheet}
    bodyStyle={styles.sheetBody}
   >

     {tab === 'clients' ? (
      <View style={styles.lineFilter}>
       <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filterRow}
       >
        {CATEGORY_FILTERS.map((filter) => {
         const isActive = category === filter.key;
         return (
          <TouchableOpacity
           key={filter.key}
           style={styles.filterItem}
           activeOpacity={0.8}
           onPress={() => setCategory(filter.key)}
          >
           <Image
            source={filter.icon}
            style={[styles.filterIcon, isActive ? styles.filterIconActive : null]}
           />
           <Text style={styles.filterLabel}>{filter.label}</Text>
          </TouchableOpacity>
         );
        })}
       </ScrollView>
      </View>
     ) : (
      <View style={styles.ownFilterSingle}>
       <TouchableOpacity activeOpacity={0.8} onPress={() => setShowBalances((prev) => !prev)}>
        <Image
         source={require('../../../../assets/images/ui/saldos.png')}
         style={[styles.ownFilterIcon, showBalances ? styles.ownFilterIconActive : null]}
        />
       </TouchableOpacity>
       <Text style={styles.ownFilterText}>saldos</Text>
      </View>
     )}
     {tab === 'clients' ? (
      <View style={styles.balanceLine}>
       <TouchableOpacity
        style={styles.balanceButton}
        activeOpacity={0.8}
        onPress={() => setShowBalances((prev) => !prev)}
       >
        <Image
         source={require('../../../../assets/images/ui/saldos.png')}
         style={[styles.balanceIcon, showBalances ? styles.balanceIconActive : null]}
        />
        <Text style={styles.balanceLabel}>Saldos</Text>
       </TouchableOpacity>
      </View>
     ) : null}
   </AppBottomSheet>
  </View>
 );
}
