import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 backdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 10,
 },
 card: {
  width: '100%',
  maxWidth: 500,
  borderRadius: 12,
  backgroundColor: COLORS.background_dialog,
  marginVertical: 8,
  marginHorizontal: 16,
  paddingHorizontal: 14,
  paddingTop: 12,
  paddingBottom: 12,
 },
 dateChipWrap: {
  marginTop: 6,
  marginBottom: 8,
 },
 dateChip: {
  alignSelf: 'flex-start',
  minWidth: 90,
  textAlign: 'left',
  backgroundColor: COLORS.colorPrimaryClear2,
  color: COLORS.colorPrimaryIntLetter,
  borderRadius: 8,
  paddingHorizontal: 20,
  paddingVertical: 5,
  fontSize: 18,
  fontFamily: 'OpenSansLight',
 },
 mainRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: 8,
  paddingBottom: 8,
  paddingRight: 16,
 },
 type: {
  flex: 1,
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: 19,
  fontFamily: 'OpenSansLight',
 },
 amountRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 10,
  marginRight: 8,
 },
 pendingIcon: {
  width: 18,
  height: 18,
  marginRight: 6,
  opacity: 0.6,
  resizeMode: 'contain',
 },
 pendingIconHidden: {
  opacity: 0,
 },
 amount: {
  fontSize: 21,
  fontFamily: 'ArialRoundedRegular',
 },
 amountPlus: {
  color: COLORS.green,
 },
 amountMinus: {
  color: COLORS.red,
 },
 accountName: {
  marginTop: 2,
  color: COLORS.colorPrimaryIntLetter,
  fontSize: 17,
  fontFamily: 'OpenSansLight',
  paddingBottom: 8,
  paddingRight: 16,
 },
 changeRow: {
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
 },
 changeText: {
  color: COLORS.colorPrimaryDark,
  fontSize: DIMENS.smallText,
  fontFamily: 'OpenSansRegular',
 },
 arrowIcon: {
  width: 30,
  height: 30,
  marginLeft: 8,
  resizeMode: 'contain',
  opacity: 0.8,
 },
 stateButton: {
  flex: 1,
  alignItems: 'center',
 },
 stateIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
  opacity: 0.7,
 },
 actionsRow: {
  marginTop: 16,
  flexDirection: 'row',
  alignItems: 'center',
 },
 cancelBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: DIMENS.heightButton,
 },
 cancelText: {
  color: COLORS.colorDialogButton,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 saveBtn: {
  flex: 1,
  minHeight: DIMENS.heightButton,
  borderRadius: 8,
  backgroundColor: COLORS.colorDialogButton,
  alignItems: 'center',
  justifyContent: 'center',
 },
 saveText: {
  color: COLORS.white,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansBold',
 },
});

export default styles;
