import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  operationsBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 7,
  },
  operationsPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 8,
  },
  collapsedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.colorPrimaryClear3,
  },
  operationsPanelBody: {
    flex: 1,
    backgroundColor: COLORS.background_bottom_sheet,
    paddingTop: 6,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  operationsPanelContent: {
    flex: 1,
  },
  operationsHandleWrap: {
    width: '100%',
  },
  operationsHandle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 1,
  },
  operationsHandleIcon: {
    width: 40,
    height: 15,
    resizeMode: 'contain',
  },
  operationsListContent: {
    paddingHorizontal: 4,
    paddingBottom: 104,
  },
  operationsStateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  operationsStateText: {
    color: COLORS.word_clear,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
  },
  operationsRetryBtn: {
    backgroundColor: COLORS.colorPrimaryChange,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  operationsRetryText: {
    color: COLORS.white,
    fontFamily: 'OpenSansRegular',
  },
  operationsViewAllBtn: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: COLORS.back_flot,
  },
  operationsViewAllText: {
    color: COLORS.colorPrimaryDarkLetter,
    fontFamily: 'OpenSansRegular',
    textTransform: 'lowercase',
  },
  dockWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 44,
    alignItems: 'center',
    zIndex: 9,
    pointerEvents: 'box-none',
  },
  dockWrapAttached: {
    bottom: 0,
  },
  dock: {
    width: isWeb ? 500 : '92%',
    maxWidth: '86%',
    minHeight: 50,
    borderRadius: 28,
    backgroundColor: 'rgba(104, 92, 133, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(123, 108, 157, 0.16)',
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dockAttached: {
    width: '100%',
    maxWidth: '100%',
    minHeight: isWeb ? 64 : 70,
    borderRadius: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: isWeb ? 34 : 66,
    paddingTop: 10,
    paddingBottom: isWeb ? 10 : 16,
    borderBottomWidth: 0,
  },
  dockItem: {
    width: 40,
    height: 40,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dockGhostSlot: {
    width: 40,
    height: 40,
  },
  dockCenterSpacer: {
    width: isWeb ? 90 : 82,
    height: 1,
  },
  dockItemActive: {
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  dockCenterButton: {
    position: 'absolute',
    top: -18,
    left: '50%',
    marginLeft: -36,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(104, 92, 133, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.colorPrimaryClear3,
    shadowColor: '#403457',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  dockCenterButtonAttached: {
    top: -20,
  },
  dockCenterButtonActive: {
    transform: [{ scale: 1.03 }],
  },
  dockCenterButtonIconWrap: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dockCenterCurrency: {
    position: 'absolute',
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'center',
    top: 13,
    marginLeft: 1,
  },
  dockItemIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    opacity: 0.95,
  },
  dockItemIconLarge: {
    width: 40,
    height: 40,
  },
  dockItemIconOperation: {
    width: 34,
    height: 34,
  },
  dockItemIconOperationBrand: {
    width: 40,
    height: 40,
    tintColor: COLORS.white,
  },
  dockItemIconOperationSmall: {
    width: 26,
    height: 26,
  },
  dockItemIconCheck: {
    width: 30,
    height: 30,
  },
  dockItemIconCheckSafe: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  dockItemIconTransferSafe: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
});

export default styles;
