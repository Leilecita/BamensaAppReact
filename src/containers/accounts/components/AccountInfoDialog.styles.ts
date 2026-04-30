import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
  infoBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  infoCard: {
    width: '100%',
    maxWidth: 600,
    borderRadius: 14,
    backgroundColor: COLORS.background_dialog,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  infoTitle: {
    color: COLORS.word,
    fontSize: 18,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  infoTable: {
    paddingTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoDivider: {
    width: 2,
    alignSelf: 'stretch',
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#b7b2c7',
    marginLeft: 2,
    marginRight: 8,
  },
  infoLabel: {
    width: '34%',
    minHeight: 35,
    paddingLeft: 8,
    color: COLORS.word,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
    textAlignVertical: 'center',
  },
  infoValue: {
    flex: 1,
    minHeight: 35,
    paddingLeft: 10,
    paddingRight: 6,
    textAlignVertical: 'center',
    color: COLORS.colorPrimaryClearLetter,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
  },
  infoInput: {
    flex: 1,
    minHeight: 35,
    paddingHorizontal: 12,
    paddingVertical: 0,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  infoActionsRow: {
    marginTop: 16,
    paddingHorizontal: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoActionIcon: {
    width: 40,
    height: 40,
    padding: 10,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryDarkLetter,
    opacity: 1,
  },
  cancelText: {
    color: COLORS.colorDialogButton,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
  },
  saveBtn: {
    minWidth: 120,
    minHeight: DIMENS.heightButton,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.colorDialogButton,
    paddingHorizontal: 12,
  },
  saveText: {
    color: COLORS.white,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
  },
});

export default styles;
