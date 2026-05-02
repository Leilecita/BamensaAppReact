import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 linear: {
  width: '100%',
  paddingTop: 1,
  backgroundColor: COLORS.background_selected,
 },
 rel: {
  backgroundColor: COLORS.background_selected,
  justifyContent: 'center',
 },
 mainRow: {
  flexDirection: 'row',
  alignItems: 'stretch',
 },
 leftCol: {
  flex: 1,
  minWidth: 0,
 },
 topRow: {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
 },
 typeWrap: {
  flex: 1,
  paddingRight: 4,
 },
 type: {
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.itemOpByCoinTypeText,
  fontFamily: 'OpenSansLight',
  paddingVertical: 8,

 },
 stateIm: {
  width: 16,
  height: 16,
  opacity: 0.6,
  marginRight: 4,
  resizeMode: 'contain',
 },
 stateImAffect: {
  width: 16,
  height: 16,
  opacity: 0.6,
  marginRight: 4,
  resizeMode: 'contain',
 },
 stateHidden: {
  opacity: 0,
 },
 amountWrap: {
  width: 112,
  justifyContent: 'center',
 },
 amount: {
  width: 112,
  textAlign: 'right',
  paddingRight: 8,
  fontFamily: 'ArialRoundedRegular',
  fontSize: DIMENS.itemOpByCoinAmountText,
 },
 amountPlus: {
  color: COLORS.green,
 },
 amountMinus: {
  color: '#8C4B47',
 },
 lineInfoAccounts: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: 8,
 },
 lineInfoObs: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom: 8,
 },
 metaIcon: {
  width: 17,
  height: 17,
  opacity: 0.8,
  resizeMode: 'contain',
 },
 metaText: {
  marginLeft: 8,
  color: COLORS.colorPrimaryIntLetter,
  fontSize: DIMENS.itemOpByCoinMetaText,
  fontFamily: 'OpenSansRegular',
 },
 metaUserText: {
  marginLeft: 8,
  color: COLORS.colorPrimaryIntLetter,
  fontSize: DIMENS.itemOpByCoinMetaText,
  fontFamily: 'OpenSansLight',
 },
 balanceDivider: {
  width: 1,
  marginLeft: 8,
  marginRight: 0,
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 0,
 },
 balanceDividerDot: {
  width: 2,
  height: 2,
  borderRadius: 1,
  marginTop: 0,
  backgroundColor: COLORS.colorPrimaryClearLetter,
  opacity: 0.8,
 },
 balanceWrap: {
  width: 104,
  justifyContent: 'center',
 },
 balance: {
  width: 104,
  textAlign: 'right',
  color: COLORS.colorPrimaryClearLetter,
  fontSize: DIMENS.itemOpByCoinMetaText,
  fontFamily: 'ArialRoundedRegular',
 },
 div: {
  height: 0.6,
  marginTop: 0.5,
  marginBottom: 0.5,
  backgroundColor: COLORS.color_line_div,
  opacity: 0.8,
 },
});

export default styles;
