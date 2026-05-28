import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';
import accountStyles from '../../accounts/screens/InformationByAccountScreen.styles';

const styles = StyleSheet.create({
 ...accountStyles,
 tabsRow: {
  ...accountStyles.tabsRow,
  minHeight: 58,
 },
 placeholderWrap: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
 },
 placeholderTitle: {
  color: COLORS.word,
  fontSize: 24,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 placeholderText: {
  marginTop: 10,
  color: COLORS.word_clear,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
 },
 summaryText: {
  ...accountStyles.summaryText,
  paddingHorizontal: 20,
  paddingTop: 24,
 },
 summaryWrap: {
  ...accountStyles.summaryWrap,
  paddingTop: 0,
 },
 summaryContent: {
  ...accountStyles.summaryContent,
  paddingBottom: 220,
 },
 summaryFab: {
  ...accountStyles.summaryFab,
  bottom: 108,
 },
 pendingRow: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: -12,
  marginRight: 46,
  marginBottom: 10,
 },
 pendingRowText: {
  color: COLORS.colorPrimaryClearLetter,
  fontSize: 18,
  fontFamily: 'ArialRoundedRegular',
  marginRight: 8,
 },
 pendingRowIcon: {
  width: 20,
  height: 20,
  opacity: 0.5,
  resizeMode: 'contain',
 },
 expandedContentWrap: {
  paddingBottom: 14,
 },
 summaryGeneralWrap: {
  backgroundColor: COLORS.background_selected,
 },
 userFilterCaption: {
  paddingHorizontal: 16,
  paddingTop: 10,
  paddingBottom: 6,
  color: COLORS.word_clear,
  fontSize: 12,
  fontFamily: 'OpenSansRegular',
 },
 viewOptionsWrap: {
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 20,
  alignItems: 'flex-end',
 },
 viewOptionsButton: {
  width: 36,
  height: 36,
 },
 viewOptionsButtonBg: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
 },
 viewOptionsList: {
  marginTop: 16,
  alignItems: 'flex-end',
 },
 viewOptionsCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.back_flot,
  borderRadius: 16,
  paddingLeft: 16,
  paddingRight: 8,
  paddingVertical: 6,
  marginBottom: 12,
 },
 viewOptionsTextWrap: {
  marginRight: 8,
 },
 viewOptionsTitle: {
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 viewOptionsSubtitle: {
  color: COLORS.colorPrimaryDarkLetter,
  fontSize: 16,
  fontFamily: 'OpenSansRegular',
 },
 viewOptionsIcon: {
  width: 40,
  height: 40,
  resizeMode: 'contain',
 },
 summaryInnerList: {
  paddingHorizontal: 10,
  paddingBottom: 10,
 },
 summaryInnerCard: {
  marginBottom: 10,
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: COLORS.background_selected,
  borderRadius: 12,
 },
 summaryInnerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
 },
 summaryInnerDivider: {
  height: 1,
  marginVertical: 8,
  backgroundColor: COLORS.color_line_div,
  opacity: 0.7,
 },
 summaryInnerLabel: {
  flex: 1,
  color: COLORS.word,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 summaryInnerValue: {
  flex: 1,
  textAlign: 'right',
  color: COLORS.word,
  fontSize: DIMENS.bigText ?? 24,
  fontFamily: 'OpenSansRegular',
 },
});

export default styles;
