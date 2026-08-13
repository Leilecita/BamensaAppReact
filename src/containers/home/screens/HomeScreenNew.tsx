import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, Image, Keyboard, Pressable, Text, TouchableOpacity, View } from 'react-native';
import HomeScreenDock from './HomeScreenDock';
import styles from './HomeScreenNew.styles';
import { useSideMenu } from '../../../core/navigation/SideMenuContext';
import OperationCard from '../../operations/components/OperationCard';
import { fetchOperations, ReportOperation } from '../../operations/services/operationService';

const COLLAPSED_PANEL_HEIGHT = 126;
const EXPANDED_PANEL_HEIGHT = 560;
const DOCK_VARIANT: 'floating' | 'attached' = 'attached';

export default function HomeScreenNew() {
  const { navigateTo } = useSideMenu();
  const [operationsExpanded, setOperationsExpanded] = useState(false);
  const [showExpandedContent, setShowExpandedContent] = useState(false);
  const [operations, setOperations] = useState<ReportOperation[]>([]);
  const [loadingOperations, setLoadingOperations] = useState(false);
  const [operationsError, setOperationsError] = useState<string | null>(null);
  const isAttachedDock = DOCK_VARIANT === 'attached';
  const panelHeight = useRef(new Animated.Value(COLLAPSED_PANEL_HEIGHT)).current;
  const panelContentTranslate = useRef(new Animated.Value(36)).current;
  const panelContentOpacity = useRef(new Animated.Value(0)).current;

  const loadOperations = async () => {
    setLoadingOperations(true);
    setOperationsError(null);

    try {
      const result = await fetchOperations(0);
      setOperations(result);
    } catch (error: any) {
      setOperationsError(error?.message ?? 'No se pudieron cargar las operaciones');
    } finally {
      setLoadingOperations(false);
    }
  };

  useEffect(() => {
    if (!operationsExpanded || operations.length > 0 || loadingOperations) return;
    loadOperations();
  }, [operationsExpanded, operations.length, loadingOperations]);

  useEffect(() => {
    if (operationsExpanded) {
      setShowExpandedContent(true);

      Animated.parallel([
        Animated.timing(panelHeight, {
          toValue: EXPANDED_PANEL_HEIGHT,
          duration: 260,
          useNativeDriver: false,
        }),
        Animated.timing(panelContentTranslate, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(panelContentOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(panelHeight, {
        toValue: COLLAPSED_PANEL_HEIGHT,
        duration: 260,
        useNativeDriver: false,
      }),
      Animated.timing(panelContentTranslate, {
        toValue: 36,
        duration: 340,
        useNativeDriver: true,
      }),
      Animated.timing(panelContentOpacity, {
        toValue: 0,
        duration: 620,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowExpandedContent(false);
      }
    });
  }, [operationsExpanded, panelContentOpacity, panelContentTranslate, panelHeight]);

  const toggleOperationsPanel = () => {
    setOperationsExpanded((prev) => !prev);
  };

  const handleCollapseOperationsPanel = () => {
    Keyboard.dismiss();
    setOperationsExpanded(false);
  };

  const handleOperationCreated = async () => {
    setOperationsExpanded(true);
    await loadOperations();
  };

  return (
    <View style={styles.screen}>
      <HomeScreenDock hideFloatingActions onOperationCreated={handleOperationCreated} />

      {operationsExpanded ? (
        <Pressable style={styles.operationsBackdrop} onPress={handleCollapseOperationsPanel} />
      ) : null}

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.operationsPanel,
          { height: panelHeight },
        ]}
      >
        {!operationsExpanded ? <View pointerEvents="none" style={styles.collapsedOverlay} /> : null}
        {showExpandedContent ? (
          <>
            <Animated.View
              style={[
                styles.operationsHandleWrap,
                {
                  opacity: panelContentOpacity,
                  transform: [{ translateY: panelContentTranslate }],
                },
              ]}
            >
              <TouchableOpacity style={styles.operationsHandle} onPress={handleCollapseOperationsPanel} activeOpacity={0.85}>
                <Image source={require('../../../../assets/images/ui/arrowsan.png')} style={styles.operationsHandleIcon} />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[
                styles.operationsPanelBody,
                {
                  opacity: panelContentOpacity,
                  transform: [{ translateY: panelContentTranslate }],
                },
              ]}
            >
              <View style={styles.operationsPanelContent}>
                {operationsError ? (
                  <View style={styles.operationsStateWrap}>
                    <Text style={styles.operationsStateText}>{operationsError}</Text>
                    <TouchableOpacity style={styles.operationsRetryBtn} onPress={loadOperations} activeOpacity={0.85}>
                      <Text style={styles.operationsRetryText}>Reintentar</Text>
                    </TouchableOpacity>
                  </View>
                ) : loadingOperations ? (
                  <View style={styles.operationsStateWrap}>
                    <ActivityIndicator size="small" color="#6f6392" />
                    <Text style={styles.operationsStateText}>Cargando operaciones...</Text>
                  </View>
                ) : (
                  <FlatList
                    data={operations}
                    keyExtractor={(item) => String(item.operation_id)}
                    contentContainerStyle={styles.operationsListContent}
                    renderItem={({ item }) => <OperationCard operation={item} />}
                    ListFooterComponent={
                      <TouchableOpacity
                        style={styles.operationsViewAllBtn}
                        onPress={() => navigateTo('operations')}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.operationsViewAllText}>ver todas las operaciones</Text>
                      </TouchableOpacity>
                    }
                  />
                )}
              </View>
            </Animated.View>
          </>
        ) : null}

        <View style={[styles.dockWrap, isAttachedDock ? styles.dockWrapAttached : null]} pointerEvents="box-none">
          <View style={[styles.dock, isAttachedDock ? styles.dockAttached : null]}>
            <TouchableOpacity style={styles.dockItem} onPress={() => navigateTo('createAccount')} activeOpacity={0.85}>
              <Image
                source={require('../../../../assets/images/ui/addaccount-white-only.png')}
                style={[styles.dockItemIcon, styles.dockItemIconLarge]}
              />
            </TouchableOpacity>




            <View style={styles.dockCenterSpacer} />

            <View pointerEvents="none" style={styles.dockGhostSlot} />

            <TouchableOpacity style={styles.dockItem} onPress={() => navigateTo('accounts')} activeOpacity={0.85}>
              <Image source={require('../../../../assets/images/ui/whiteperson.png')} style={styles.dockItemIcon} />
            </TouchableOpacity>
          </View>

        <TouchableOpacity
          style={[
            styles.dockCenterButton,
            isAttachedDock ? styles.dockCenterButtonAttached : null,
            operationsExpanded ? styles.dockCenterButtonActive : null,
          ]}
          onPress={toggleOperationsPanel}
          activeOpacity={0.9}
        >
            <View style={styles.dockCenterButtonIconWrap}>
              <Image
                source={require('../../../../assets/images/ui/changeop.png')}
                style={[styles.dockItemIcon, styles.dockItemIconOperationBrand]}
              />
              <Text style={styles.dockCenterCurrency}>$</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
