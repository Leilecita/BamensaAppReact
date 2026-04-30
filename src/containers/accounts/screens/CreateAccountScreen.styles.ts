import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 170,
  },
  formInner: {
    padding: 4,
  },
  row: {
    height: 45,
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
  },
  rowSpaced: {
    marginTop: 32,
  },
  iconWrap: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  icon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryIntLetter2,
    opacity: 0.9,
  },
  iconSmall: {
    width: 20,
    height: 20,
  },
  labelWrap: {
    width: '43%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  label: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
  },
  labelOptional: {
    color: COLORS.colorPrimaryClearLetter,
  },
  asterisk: {
    color: COLORS.colorPrimaryClearLetter,
    fontSize: 16,
    fontFamily: 'OpenSansRegular',
    marginLeft: 2,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: 4,
    marginHorizontal: 4,
    backgroundColor: '#b8b8b8',
  },
  inputWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    height: 35,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
    paddingHorizontal: 8,
    paddingVertical: 0,
  },
  placeholderLight: {
    color: COLORS.word_clear_clear,
  },
  categoryBtn: {
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  categoryText: {
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
  },
  categoryArrow: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    opacity: 0.65,
  },
  requiredText: {
    marginTop: 16,
    marginLeft: 8,
    color: COLORS.colorPrimaryClearLetter,
    fontSize: DIMENS.smallText,
    fontFamily: 'OpenSansRegular',
  },
  actionColumn: {
    position: 'absolute',
    right: 18,
    bottom: 26,
    gap: 16,
    alignItems: 'flex-end',
  },
  actionBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.colorPrimaryIntLetter2,
    backgroundColor: COLORS.colorPrimaryIntLetter2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 6,
    paddingBottom: 6,
  },
  actionBtnPressed: {
    borderColor: COLORS.colorPrimaryDarkLetter,
    backgroundColor: COLORS.colorPrimaryDarkLetter,
  },
  actionBtnAssign: {
    marginBottom: 10,
  },
  actionIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  actionText: {
    marginLeft: 8,
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'OpenSansRegular',
  },
  actionLoader: {
    marginLeft: 8,
  },
});

export default styles;
