import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 backdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 12,
 },
 card: {
  width: '100%',
  maxWidth: 540,
  borderRadius: 10,
  backgroundColor: COLORS.background_dialog,
  paddingHorizontal: DIMENS.dialogMarginLeft,
  paddingTop: DIMENS.dialogMarginTop,
  paddingBottom: DIMENS.dialogMarginBottom,
 },
 title: {
  height: 36,
  textAlign: 'center',
  color: COLORS.word,
  fontSize: 20,
  fontFamily: 'OpenSansRegular',
 },
 onlyFishertonNote: {
  marginTop: 6,
  textAlign: 'center',
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansBold',
 },
 infoRow: {
  marginTop: 12,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
 },
 infoText: {
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 infoDash: {
  color: '#6e6e6e',
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
  marginHorizontal: 6,
 },
 affectText: {
  marginTop: 12,
  textAlign: 'center',
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 actions: {
  marginTop: 16,
  flexDirection: 'row',
  alignItems: 'center',
 },
 cancelBtn: {
  flex: 1,
  minHeight: DIMENS.heightButton,
  justifyContent: 'center',
  alignItems: 'center',
 },
 cancelText: {
  color: COLORS.colorDialogButton,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 deleteBtn: {
  flex: 1,
  minHeight: DIMENS.heightButton,
  borderRadius: 8,
  backgroundColor: COLORS.colorDialogButton,
  justifyContent: 'center',
  alignItems: 'center',
 },
 deleteText: {
  color: COLORS.white,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansBold',
 },
});

export default styles;

