import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const isWeb = Platform.OS === 'web';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#dfe0e5',
  },
  tabsRow: {
    height: isWeb ? 48 : 58,
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
    paddingTop: 6,
    paddingHorizontal: 6,
    paddingBottom: 220,
  },
  operationsWrap: {
    flex: 1,
  },
  sectionHeaderWrap: {
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 2,
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
  operationCardCompact: {
    marginLeft: 4,
    marginRight: 4,
    marginTop: 4,
    marginBottom: 4,
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
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.colorPrimaryClearLetter,
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
  movementActionMenuCard: {
    width: 198,
    minHeight: 166,
  },
  movementActionMenuItem: {
    minHeight: 54,
    paddingHorizontal: 20,
  },
  movementActionMenuText: {
    fontSize: 19,
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
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.background,
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
  coinDetailLoadMoreBtn: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 6,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinDetailLoadMoreIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryClear2,
    opacity: 0.95,
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
    right: 30,
    bottom: 30,
    width: 65,
    height: 65,
  },
});

export default styles;
