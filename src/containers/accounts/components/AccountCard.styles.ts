import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 cardTouch: {
  marginHorizontal: 4,
  marginVertical: 4,
 },
 cardInner: {
  borderRadius: 8,
  backgroundColor: COLORS.white,
  paddingVertical: 12,
  paddingHorizontal: 12,
 },
 card: {
  minHeight: 55,
  flexDirection: 'row',
  alignItems: 'center',
 },
 leftCircle: {
  width: 42,
  height: 42,
  position: 'relative',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
 },
 leftCircleImg: {
  position: 'absolute',
  width: 42,
  height: 42,
  resizeMode: 'contain',
 },
 leftCircleText: {
  color: COLORS.white,
  fontSize: DIMENS.bigText,
  fontFamily: 'OpenSansRegular',
 },
 mainInfo: {
  flex: 1,
  marginLeft: 8,
  paddingRight: 4,
 },
 nameText: {
  color: COLORS.word,
  fontSize: DIMENS.numberItemText,
  lineHeight: 24,
  fontFamily: 'OpenSansRegular',
 },
 categoryText: {
  marginTop: 2,
  color: COLORS.colorPrimaryClearLetter,
  fontSize: DIMENS.smallText,
  fontFamily: 'OpenSansRegular',
  textTransform: 'lowercase',
 },
 assignBtn: {
  width: 120,
  minHeight: 55,
  borderRadius: 8,
  backgroundColor: COLORS.background2,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
 },
 assignText: {
  color: COLORS.word,
  fontSize: DIMENS.textDetailBottom,
  lineHeight: 20,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
  textTransform: 'lowercase',
 },
 balanceWrap: {
  width: 120,
  minHeight: 55,
  borderRadius: 8,
  backgroundColor: COLORS.background2,
  paddingLeft: 8,
  paddingRight: 6,
  paddingTop: 4,
  paddingBottom: 4,
  justifyContent: 'center',
 },
 balanceRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
 },
 balanceFlag: {
  width: 24,
  height: 24,
  marginRight: 8,
  resizeMode: 'contain',
 },
 balanceText: {
  color: COLORS.word,
  fontSize: DIMENS.textDetailBottom,
  lineHeight: 20,
  fontFamily: 'OpenSansRegular',
 },
 actionsRow: {
  marginTop: 12,
  flexDirection: 'row',
  alignItems: 'center',
 },
 actionSlot: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
 },
 actionIcon: {
  width: 25,
  height: 25,
  resizeMode: 'contain',
  opacity: 0.55,
 },
 movWrap: {
  width: 130,
  alignItems: 'flex-end',
  justifyContent: 'center',
 },
 movImg: {
  width: 120,
  height: 40,
  resizeMode: 'contain',
 },
});

export default styles;
