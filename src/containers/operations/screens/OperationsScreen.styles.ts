import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 screen: {
  flex: 1,
  backgroundColor: '#dfe0e5',
 },
 listContent: {
  paddingHorizontal: 6,
  paddingTop: 6,
  paddingBottom: 220,
 },
 sectionHeaderWrap: {
  paddingHorizontal: 4,
  paddingTop: 6,
  paddingBottom: 2,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
 },
 sectionHeaderDatePill: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  paddingLeft: 8,
  paddingRight: 8,
  borderRadius: 8,
  backgroundColor: 'rgba(223, 224, 229, 0.88)',
 },
 sectionHeaderCountPill: {
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
  paddingLeft: 6,
  paddingRight: 6,
  borderRadius: 8,
  backgroundColor: 'rgba(223, 224, 229, 0.88)',
 },
 sectionHeaderWeekdayText: {
  color: '#807e7e',
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
  paddingLeft: 4,
 },
 sectionHeaderDayText: {
  color: '#807e7e',
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
  paddingLeft: 4,
 },
 sectionHeaderMonthText: {
  color: '#807e7e',
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
  paddingLeft: 6,
 },
 sectionHeaderYearText: {
  color: '#807e7e',
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
  paddingLeft: 6,
 },
 sectionHeaderCountText: {
  color: '#807e7e',
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
 },
 emptyWrap: {
  marginTop: 30,
  alignItems: 'center',
  paddingHorizontal: 18,
 },
 emptyText: {
  color: '#8a839b',
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 errorText: {
  color: '#8d4d62',
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 retryBtn: {
  marginTop: 10,
  backgroundColor: '#6f6392',
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 8,
 },
 retryText: {
  color: '#fff',
  fontFamily: 'OpenSansRegular',
 },
 usersDialogBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 12,
 },
 usersDialogCard: {
  width: '100%',
  maxWidth: 420,
  borderRadius: 10,
  backgroundColor: COLORS.background_dialog,
  paddingTop: DIMENS.dialogMarginTop,
  paddingBottom: DIMENS.dialogMarginBottom,
  paddingLeft: DIMENS.dialogMarginLeft,
  paddingRight: DIMENS.dialogMarginRight,
 },
 usersDialogTitle: {
  height: 30,
  color: COLORS.word,
  fontSize: 20,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
 },
 usersList: {
  marginTop: 4,
  maxHeight: 260,
 },
  usersDialogLoadingWrap: {
  minHeight: 120,
  alignItems: 'center',
  justifyContent: 'center',
 },
 usersDialogEmptyText: {
  color: COLORS.word_clear,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
 },
 userRow: {
  minHeight: DIMENS.itemHeight,
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 12,
  marginRight: 12,
  paddingTop: 4,
  },
 userAvatar: {
  width: 40,
  height: 40,
  marginRight: 12,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
 },
 userAvatarBg: {
  position: 'absolute',
  width: 40,
  height: 40,
  resizeMode: 'contain',
  tintColor: COLORS.colorPrimaryClearLetter,
 },
 userAvatarText: {
  color: COLORS.white,
  fontSize: 20,
  fontFamily: 'OpenSansRegular',
 },
 userRowText: {
  flex: 1,
  color: COLORS.word,
  fontSize: 19,
  fontFamily: 'OpenSansRegular',
  textAlign: 'left',
 },
 usersDialogActions: {
  marginTop: 16,
  flexDirection: 'row',
 },
 usersDialogCancelBtn: {
  flex: 1,
  minHeight: 35,
  alignItems: 'center',
  justifyContent: 'center',
 },
 usersDialogCancelText: {
  color: COLORS.colorDialogButton,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
});

export default styles;
