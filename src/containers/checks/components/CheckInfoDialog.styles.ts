import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { CHECK_DIALOG_SHARED } from './checkDialogShared';

const styles = StyleSheet.create({
  backdrop: CHECK_DIALOG_SHARED.backdrop,
  card: {
    ...CHECK_DIALOG_SHARED.card,
    borderRadius: 12,
  },
  title: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 18,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
    marginBottom: 18,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  amountIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryClearLetter,
    marginRight: 10,
    marginBottom: 8,
  },
  amountLabel: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 18,
    fontFamily: 'ArialRoundedRegular',
    flexShrink: 1,
  },
  amountDivider: {
    width: 8,
    height: 34,
    marginHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountDividerDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.colorPrimaryClearLetter,
    opacity: 0.8,
  },
  amountValue: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 19,
    fontFamily: 'ArialRoundedRegular',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    flex: 1,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    paddingRight: 12,
  },
  summaryLabelWarning: {
    color: COLORS.colorOrange,
    fontFamily: 'OpenSansRegular',
  },
  summaryValue: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 17,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  summaryValue2: {
    color: COLORS.colorOrange,
    fontSize: 17,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  fieldsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  fieldCol: {
    flex: 1,
  },
  fieldLabel: {
    color: COLORS.colorPrimaryIntLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    marginBottom: 6,
  },
  fieldBox: {
    minHeight: 32,
    borderRadius: 6,
    backgroundColor: COLORS.colorPrimaryClear3,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  fieldValue: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryClearLetter,
    opacity: 0.85,
  },
  deleteBtn: {
    minWidth: 34,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    minWidth: 84,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 17,
    fontFamily: 'ArialRoundedRegular',
  },
});

export default styles;
