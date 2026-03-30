import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 screen: {
  flex: 1,
  backgroundColor: COLORS.colorPrimaryClear3,
 },
 tabsRow: {
  height: 58,
  backgroundColor: COLORS.colorPrimaryDarkChange,
  flexDirection: 'row',
 },
 tabBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomWidth: 3,
  borderBottomColor: 'transparent',
 },
 tabBtnActive: {
  borderBottomColor: COLORS.white,
 },
 tabText: {
  color: '#8f9088',
  fontSize: DIMENS.numberItemText,
  fontFamily: 'OpenSansRegular',
  textTransform: 'lowercase',
 },
 tabTextActive: {
  color: COLORS.white,
 },
 searchWrap: {
  marginTop: 8,
  marginLeft: 4,
  marginRight: 4,
  marginBottom: 4,
  height: 50,
  borderRadius: 8,
  backgroundColor: COLORS.white,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 14,
 },
 searchIcon: {
  color: COLORS.word_clear,
  fontSize: DIMENS.bigBigText,
  marginRight: 8,
 },
 searchInput: {
  flex: 1,
  color: COLORS.word,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 listContent: {
  paddingTop: 2,
  paddingBottom: 220,
 },
 emptyWrap: {
  marginTop: 26,
  alignItems: 'center',
  paddingHorizontal: 20,
 },
 emptyText: {
  color: COLORS.word_clear,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 bottomSheet: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 200,
  backgroundColor: 'transparent',
 },
 sheetBody: {
  flex: 1,
  backgroundColor: COLORS.background_bottom_sheet,
  borderRadius: 8,
  overflow: 'hidden',
 },
 lineFilter: {
  width: '100%',
  marginTop: 4,
 },
 filtersScroll: {
  width: '100%',
 },
 filterRow: {
  paddingTop: 8,
  paddingHorizontal: 6,
  alignItems: 'center',
 },
 filterItem: {
  width: 74,
  alignItems: 'center',
  padding: 6,
 },
 filterIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  opacity: 0.6,
 },
 filterIconActive: {
  opacity: 1,
 },
 filterLabel: {
  marginTop: 4,
  width: 70,
  color: COLORS.word,
  textAlign: 'center',
  fontSize: DIMENS.textDetailBottom,
  fontFamily: 'OpenSansRegular',
 },
 ownFilterSingle: {
  flex: 1,
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingTop: 10,
 },
 ownFilterIcon: {
  width: 40,
  height: 40,
  opacity: 0.6,
  resizeMode: 'contain',
 },
 ownFilterIconActive: {
  opacity: 1,
 },
 ownFilterText: {
  marginTop: 4,
  color: COLORS.word,
  fontSize: DIMENS.textDetailBottom,
  fontFamily: 'OpenSansRegular',
  textTransform: 'lowercase',
 },
 balanceLine: {
  alignItems: 'center',
  marginTop: 8,
 },
 balanceButton: {
  alignItems: 'center',
  justifyContent: 'center',
  padding: 6,
 },
 balanceIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
  opacity: 0.6,
 },
 balanceIconActive: {
  opacity: 1,
 },
 balanceLabel: {
  marginTop: 4,
  color: COLORS.word,
  fontSize: DIMENS.textDetailBottom,
  fontFamily: 'OpenSansRegular',
 },
});

export default styles;
