import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { CHECK_DIALOG_SHARED } from './checkDialogShared';

const styles = StyleSheet.create({
  backdrop: CHECK_DIALOG_SHARED.backdrop,
  card: CHECK_DIALOG_SHARED.card,
  title: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 17,
    fontFamily: 'OpenSansBold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    marginBottom: 18,
  },
  checkIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryClearLetter,
    marginRight: 10,
    marginBottom: 15,
  },
  accountName: {
    flex: 1,
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 18,
    fontFamily: 'ArialRoundedRegular',
  },
  divider: {
    width: 8,
    minHeight: 120,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dividerDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.colorPrimaryClearLetter,
    opacity: 0.8,
  },
  headerRight: {
    flex: 1.1,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  totalLabel: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 18,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalAmount: {
    marginTop: 44,
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 19,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'center',
  },
  percentagesWrap: {
    flex: 1,
    paddingRight: 8,
  },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  percentageIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  percentageBadge: {
    minWidth: 110,
    height: 28,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  percentageValue: {
    color: COLORS.colorPrimaryIntLetter,
    fontSize: 19,
    fontFamily: 'OpenSansLight',
  },
  percentageSymbol: {
    marginLeft: 6,
    marginRight: 6,
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 19,
    fontFamily: 'OpenSansLight',
  },
  message: {
    marginTop: 16,
    color: COLORS.colorPrimaryIntLetter,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'OpenSansLight',
  },
  actions: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    flex: 1,
    minHeight: CHECK_DIALOG_SHARED.actionButtonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.colorDialogButton,
    fontSize: 18,
    fontFamily: 'OpenSansRegular',
  },
  deleteBtn: {
    flex: 1,
    minHeight: CHECK_DIALOG_SHARED.actionButtonHeight,
    borderRadius: 8,
    backgroundColor: COLORS.colorDialogButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 18,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'OpenSansBold',
  },
});

export default styles;
