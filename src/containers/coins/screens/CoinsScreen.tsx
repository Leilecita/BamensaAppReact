import React from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import CoinListItem from '../components/CoinListItem';
import { useCoins } from '../hooks/useCoins';
import AppTopBar from '../../../core/components/AppTopBar';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import styles from './CoinsScreen.styles';

export default function CoinsScreen() {
 const { navigateTo } = useSideMenu();
 const { coins, loadingCoins, coinsError, reloadCoins } = useCoins();

 return (
  <View style={styles.screen}>
   <AppTopBar title="Monedas" leftSymbol="←" onPressLeft={() => navigateTo('home')} />

   <FlatList
    data={coins}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle={styles.listContent}
    renderItem={({ item, index }) => (
     <CoinListItem coin={item} showDivider={index < coins.length - 1} />
    )}
    ListEmptyComponent={
     <View style={styles.center}>
      {loadingCoins ? <ActivityIndicator size="small" color="#6f6392" /> : null}
      <Text style={styles.infoText}>
       {loadingCoins
        ? 'Cargando monedas...'
        : coinsError
         ? 'No se pudieron cargar las monedas.'
         : 'No hay monedas para mostrar.'}
      </Text>
      {coinsError ? (
       <TouchableOpacity style={styles.retryButton} onPress={reloadCoins} activeOpacity={0.8}>
        <Text style={styles.retryText}>Reintentar</Text>
       </TouchableOpacity>
      ) : null}
     </View>
    }
   />
  </View>
 );
}
