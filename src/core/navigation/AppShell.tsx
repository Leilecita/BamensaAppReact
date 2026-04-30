import React, { ReactNode, useContext, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../../contexts/AuthContext';
import type { AppStackParamList } from './AppStack';
import { AppRoute, SideMenuProvider } from './SideMenuContext';
import styles from './AppShell.styles';

function MenuItem({
  icon,
  image,
  label,
  onPress,
}: {
  icon: string;
  image?: ImageSourcePropType;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      {image ? (
        <Image source={image} style={styles.iconImage} resizeMode="contain" />
      ) : (
        <MaterialCommunityIcons name={icon as any} size={22} color="#9a8eb8" style={styles.icon} />
      )}
      <Text style={styles.itemText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function AppShell({ children }: { children?: ReactNode }) {
  const { userName, signOut } = useContext(AuthContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<any>();
  const route = useRoute();
  const routeName = route.name as keyof AppStackParamList;
 const currentRoute: AppRoute = routeName === 'home' || routeName === 'operations' || routeName === 'coins' || routeName === 'accounts' || routeName === 'createAccount' || routeName === 'outcomes'
  ? routeName
  : 'home';
  const menuTranslateX = useRef(new Animated.Value(-320)).current;

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuTranslateX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuTranslateX, {
      toValue: -320,
      duration: 180,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuVisible(false);
      }
    });
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  const navigateTo = <R extends AppRoute>(targetRoute: R, params?: AppStackParamList[R]) => {
    if (currentRoute !== targetRoute) {
      navigation.navigate(targetRoute as never, params as never);
    }
    closeMenu();
  };

  return (
    <SideMenuProvider value={{ openMenu, closeMenu, navigateTo, currentRoute }}>
      {children}

      {menuVisible ? (
        <Modal visible={menuVisible} transparent animationType="none" onRequestClose={closeMenu}>
          <View style={styles.overlay}>
            <View style={styles.panelWrap}>
              <Animated.View style={[styles.panel, { transform: [{ translateX: menuTranslateX }] }]}>
                <View style={styles.header}>
                  <Text style={styles.user}>{userName || 'Usuario'}</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.section}>
          <MenuItem icon="home-outline" image={require('../../../assets/images/ui/logo55.png')} label="Inicio" onPress={() => navigateTo('home')} />
          <MenuItem
           icon="format-list-bulleted"
           image={require('../../../assets/images/ui/logo55.png')}
           label="Operaciones"
           onPress={() => navigateTo('operations')}
          />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Caja total" onPress={closeMenu} />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Saldo monedas" onPress={closeMenu} />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Balance" onPress={closeMenu} />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Gastos" onPress={() => navigateTo('outcomes')} />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Resultados" onPress={closeMenu} />
          <MenuItem icon="checkbox-blank-circle-outline" image={require('../../../assets/images/ui/logo55.png')} label="Cheques" onPress={closeMenu} />
                  </View>

                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Cuentas</Text>
                  <View style={styles.section}>
          <MenuItem icon="account" image={require('../../../assets/images/ui/usuviol.png')} label="Cuentas clientes" onPress={() => navigateTo('accounts')} />
          <MenuItem icon="account" image={require('../../../assets/images/ui/usuviol.png')} label="Cuentas propias" onPress={() => navigateTo('accounts')} />
                    <MenuItem icon="account-plus-outline" image={require('../../../assets/images/ui/addlei.png')} label="Crear cuenta" onPress={() => navigateTo('createAccount')} />
                  </View>

                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Ajustes</Text>
                  <View style={styles.section}>
          <MenuItem icon="cash-multiple" image={require('../../../assets/images/ui/coins.png')} label="Monedas" onPress={() => navigateTo('coins')} />
                  </View>

                  <View style={styles.divider} />
                  <Text style={styles.sectionTitle}>Usuario</Text>
                  <View style={styles.section}>
                    <MenuItem icon="logout" image={require('../../../assets/images/ui/turnoff.png')} label="Cerrar sesión" onPress={handleSignOut} />
                  </View>
                </ScrollView>
              </Animated.View>

              <Pressable style={styles.backdrop} onPress={closeMenu} />
            </View>
          </View>
        </Modal>
      ) : null}
    </SideMenuProvider>
  );
}
