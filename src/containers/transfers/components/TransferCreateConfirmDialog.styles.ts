import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { CHECK_DIALOG_SHARED } from '../../checks/components/checkDialogShared';

const styles = StyleSheet.create({
  backdrop: CHECK_DIALOG_SHARED.backdrop,
  card: CHECK_DIALOG_SHARED.card,
  title: {
    height: 35,
    textAlign: 'center',
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 18,
    fontFamily: 'OpenSansBold',
  },
  observationRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 8,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  observationInput: {
    flex: 1,
    minHeight: 40,
    color: COLORS.word,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
  },
  copyBtn: {
    width: 64,
    backgroundColor: COLORS.colorPrimaryChange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  infoIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 8,
    opacity: 0.9,
  },
  infoText: {
    color: COLORS.word,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
  },
  actions: {
    marginTop: 16,
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
