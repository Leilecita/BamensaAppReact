import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabsRow: {
    height: 58,
    flexDirection: 'row',
    backgroundColor: COLORS.colorPrimaryDarkChange,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    paddingHorizontal: 8,
  },
  tabBtnActive: {
    borderBottomColor: COLORS.white,
  },
  tabText: {
    color: '#8f9088',
    fontSize: DIMENS.numberItemText,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 2,
    paddingTop: 6,
    paddingBottom: 220,
  },
  operationsWrap: {
    flex: 1,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 2,
  },
  sectionHeaderText: {
    color: COLORS.word_clear,
    fontSize: DIMENS.bigText,
    fontFamily: 'OpenSansRegular',
  },
  operationCardCompact: {
    marginLeft: 2,
    marginRight: 2,
  },
  emptyWrap: {
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 8,
    color: COLORS.word,
    fontSize: DIMENS.valueText,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
  },
  retryText: {
    marginTop: 8,
    color: COLORS.word,
    fontSize: DIMENS.valueText,
    fontFamily: 'OpenSansRegular',
  },
  summaryWrap: {
    flex: 1,
    paddingTop: 8,
  },
  summaryContent: {
    paddingHorizontal: 0,
    paddingBottom: 86,
  },
  summaryCoinBlock: {
    paddingTop: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.background_selected,
  },
  summaryCoinBlockExpanded: {
    backgroundColor: COLORS.background_selected,
  },
  summaryRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
    backgroundColor: COLORS.background_selected,
  },
  summaryRowExpanded: {
    backgroundColor: COLORS.background_selected,
  },
  summaryCoinSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  summaryFlag: {
    width: 40,
    height: 40,
    opacity: 0.8,
    resizeMode: 'contain',
  },
  summaryCoinCode: {
    marginLeft: 10,
    width: 80,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: DIMENS.generalText,
    fontFamily: 'OpenSansRegular',
    textTransform: 'uppercase',
  },
  summaryAmount: {
    flex: 1,
    textAlign: 'right',
    marginRight: 46,
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 22,
    fontFamily: 'ArialRoundedRegular',
  },
 summaryDivider: {
  height: 0.6,
  backgroundColor: COLORS.color_line_div,
  opacity: 0.45,
 },
  coinDetailWrap: {
    backgroundColor: COLORS.background_selected,
    paddingBottom: 10,
    borderBottomWidth: 0,
  },
  coinDetailHeader: {
    minHeight: 44,
    paddingRight: 6,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinDetailHeaderCoin: {
    width: 44,
    color: COLORS.word,
    fontSize: DIMENS.numberItemText,
    fontFamily: 'OpenSansRegular',
  },
  coinDetailHeaderMov: {
    flex: 1,
    color: COLORS.word,
    fontSize: DIMENS.numberItemText,
    fontFamily: 'OpenSansRegular',
  },
  coinDetailHeaderBalance: {
    width: 84,
    textAlign: 'right',
    color: COLORS.word,
    fontSize: DIMENS.numberItemText,
    fontFamily: 'OpenSansRegular',
  },
  coinDetailItemsWrap: {
    paddingHorizontal: 4,
  },
  coinDateChipWrap: {
    marginTop: 4,
    marginBottom: 2,
  },
  coinDetailEmptyWrap: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinDetailEmptyText: {
    color: COLORS.word_clear,
    fontSize: DIMENS.valueText,
    fontFamily: 'OpenSansRegular',
  },
  coinDetailRetryText: {
    marginTop: 4,
    color: COLORS.word,
    fontSize: DIMENS.valueText,
    fontFamily: 'OpenSansRegular',
  },
  summaryText: {
    color: COLORS.word_clear,
    fontSize: DIMENS.valueText,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
    marginTop: 14,
  },
  summaryFab: {
    position: 'absolute',
    right: 20,
    bottom: 26,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#8a82a8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  summaryFabText: {
    color: COLORS.white,
    fontSize: 36,
    lineHeight: 36,
    fontFamily: 'OpenSansLight',
  },
});

export default styles;
