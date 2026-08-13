import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { CHECK_DIALOG_SHARED } from './checkDialogShared';

const styles = StyleSheet.create({
  backdrop: CHECK_DIALOG_SHARED.backdrop,
  card: CHECK_DIALOG_SHARED.card,
  title: {
    color: COLORS.colorPrimaryChange,
    fontSize: 19,
    fontFamily: 'OpenSansBold',
    textAlign: 'center',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    gap: 12,
  },
  summaryLabel: {
    flex: 1,
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 19,
    fontFamily: 'ArialRoundedRegular',
  },
  summaryValue: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 21,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'right',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  percentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
  },
  percentIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 16,
  },
  percentNumber: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 19,
    fontFamily: 'ArialRoundedRegular',
    marginLeft: 12,
    marginRight: 12,
  },
  percentSymbol: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 19,
    fontFamily: 'OpenSansLight',
  },
  percentAmount: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 19,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  sectionLabel: {
    color: COLORS.colorPrimaryChange,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    marginTop: 10,
    marginBottom: 4,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountBox: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: COLORS.colorPrimaryClear3,
    paddingLeft: 8,
    paddingRight: 4,
    paddingTop: 3,
    paddingBottom: 3,
    marginRight: 12,
  },
  accountName: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 17,
    fontFamily: 'OpenSansLight',
  },
  accountAmount: {
    flex: 0.7,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 19,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'right',
    paddingTop: 8,
    paddingBottom: 6,
  },
  obsInput: {
    minHeight: 34,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    marginTop: 14,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 18,
    fontFamily: 'OpenSansLight',
  },
  infoText: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 15,
    fontFamily: 'OpenSansLight',
    lineHeight: 22,
    marginTop: 12,
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
    color: COLORS.colorPrimaryChange,
    fontSize: 18,
    fontFamily: 'ArialRoundedRegular',
  },
  confirmBtn: {
    flex: 1,
    minHeight: CHECK_DIALOG_SHARED.actionButtonHeight,
    borderRadius: 8,
    backgroundColor: COLORS.colorPrimaryChange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 18,
  },
  confirmText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'OpenSansBold',
  },
});

export default styles;
