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
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  dayChip: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayText: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 13,
    fontFamily: 'OpenSansLight',
  },
  statusText: {
    flex: 1,
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 16,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'right',
    marginLeft: 14,
    marginRight: 14,
  },
  dividerWrap: {
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 28,
  },
  dividerDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.colorPrimaryClearLetter,
    opacity: 0.8,
  },
  dividerDotRejected: {
    backgroundColor: COLORS.colorOrange,
  },
  amountWrap: {
    width: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 18,
    fontFamily: 'ArialRoundedRegular',
    textAlign: 'right',
  },
  detailsBlock: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingTop: 4,

  },
  detailLabelWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 14,
  },
  detailLabel: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  detailValueWrap: {
    width: 116,
    justifyContent: 'center',
  },
  detailValue: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  warningText: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 25,
    marginLeft: 8,
    color: COLORS.colorPrimaryIntLetter,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    lineHeight: 21,
  },
  actions: {
    marginTop: 18,
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
    fontSize: 17,
    fontFamily: 'OpenSansRegular',
  },
  deleteBtn: {
    flex: 1,
    minHeight: CHECK_DIALOG_SHARED.actionButtonHeight,
    borderRadius: 8,
    backgroundColor: COLORS.colorDialogButton,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: 'OpenSansRegular',
  },
});

export default styles;
