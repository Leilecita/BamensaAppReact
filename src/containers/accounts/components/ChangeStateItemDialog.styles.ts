import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';

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
  borderRadius: 10,
  backgroundColor: COLORS.background_dialog,
  paddingVertical: 10,
  paddingLeft: 22,
  paddingRight: 15,
 },
 dateChipWrap: {
  marginTop: 8,
  marginBottom: 12,
 },
 dateChip: {
  alignSelf: 'flex-start',
  minWidth: 110,
  textAlign: 'center',
  backgroundColor: COLORS.colorPrimaryClear2,
  color: COLORS.colorPrimaryIntLetter,
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 1,
  fontSize: 18,
  fontFamily: 'OpenSansLight',
 },
 mainRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: 10,
 },
 mainRowSide: {
  flex: 1,
  minWidth: 0,
 },
 mainRowCenter: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 0,
 },
 amountRow: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'flex-end',
  justifyContent: 'center',
  minWidth: 0,
  paddingRight: 8,
 },
 pendingIcon: {
  width: 24,
  height: 24,
  opacity: 0.72,
  resizeMode: 'contain',
 },
 pendingIconHidden: {
  opacity: 0,
 },
 amount: {
  fontSize: 26,
  fontFamily: 'ArialRoundedRegular',
  textAlign: 'right',
 },
 amountPlus: {
  color: COLORS.green,
 },
 amountMinus: {
  color: COLORS.red,
 },
 accountName: {
  marginTop: 4,
  color: COLORS.colorPrimaryIntLetter,
  fontSize: 18,
  fontFamily: 'OpenSansLight',
  paddingBottom: 12,
 },
 changeRow: {
  marginTop: 2,
  flexDirection: 'row',
  alignItems: 'center',
 },
 changeText: {
  color: COLORS.colorPrimaryDark,
  fontSize: 18,
  fontFamily: 'OpenSansRegular',
 },
 arrowIcon: {
  width: 40,
  height: 22,
  marginLeft: 10,
  resizeMode: 'contain',
  opacity: 0.8,
 },
 stateButton: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
 },
 stateIcon: {
  width: 30,
  height: 30,
  resizeMode: 'contain',
  opacity: 0.70,
 },
 actionsRow: {
  marginTop: 18,
  flexDirection: 'row',
  alignItems: 'center',
 },
 cancelBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  height: 35,
 },
 cancelText: {
  color: COLORS.colorDialogButton,
  fontSize: 18,
  fontFamily: 'OpenSansRegular',
 },
 saveBtn: {
  flex: 1,
  height: 35,
  borderRadius: 8,
  backgroundColor: COLORS.colorDialogButton,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 14,
 },
 saveText: {
  color: COLORS.white,
  fontSize: 18,
  fontFamily: 'OpenSansBold',
 },
});

export default styles;
