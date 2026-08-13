import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';

const styles = StyleSheet.create({
  checkLoadItemWrap: {
    paddingBottom: 0,
    marginTop: -40, // esto lo puse recien para que el segundo aprobado no este tan abajo
  },
  checkLoadItemWrapRejected: {
    marginTop: -40,
  },
  checkLoadItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
  },
  checkLoadItemHeaderTouch: {
    width: '100%',
  },
  checkLoadItemHeaderInfo: {
    flex: 1,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkLoadItemDay: {
    width: 52,
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 13,
    fontFamily: 'OpenSansLight',
  },
  checkLoadItemState: {
    flex: 1,
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 16,
    fontFamily: 'OpenSansRegular',

    textAlign: 'center',
  },
  checkLoadItemStateRejected: {
    fontFamily: 'ArialRoundedRegular',
  },
  checkLoadItemDividerWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 36,
    position: 'relative',
    overflow: 'visible',
  },
  checkLoadDotDivider: {
    width: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
  },
  checkLoadDotDividerDot: {
    width: 2,
    height: 2,
    marginTop: 2,
    borderRadius: 1,
    backgroundColor: COLORS.colorPrimaryClearLetter,
    opacity: 0.8,
  },
  checkLoadDotDividerDotRejected: {
    backgroundColor: COLORS.colorOrange,
  },
  checkLoadItemRight: {
    width: 124,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  checkLoadItemAmount: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 18,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  checkLoadItemArrow: {
    width: 23,
    resizeMode: 'contain',
    tintColor: COLORS.colorPrimaryIntLetter2,
    opacity: 0.7,
    marginLeft: 4,
  },
  checkLoadItemArrowRejected: {
    tintColor: COLORS.colorOrange,
  },
  checkLoadItemArrowExpanded: {
    transform: [{ rotate: '180deg' }],
  },

  checkLoadItemDetailsGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: -16,
    marginBottom: 38,
  },
  checkLoadItemDetailsGridRejected: {
    marginTop: -16,
  },
  checkLoadItemDetailsLeftColumn: {
    flex: 1,
    paddingRight: 16,

  },
  checkLoadItemDetailsRightColumn: {
    width: 124,
    justifyContent: 'flex-start',
  },
  checkLoadItemDetailLeftRow: {
    minHeight: 32, // esto esta bien 
    marginRight: 8,
    justifyContent: 'center',
  },
  checkLoadItemDetailRightRow: {
    minHeight: 32,
    justifyContent: 'center',
  },
  checkLoadItemDetailLabel: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  checkLoadItemDetailValue: {
    color: COLORS.colorPrimaryIntLetter2,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'right',
  },
  checkLoadItemDeleteInlineIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    opacity: 0.85,
    marginRight: -22,

  },
  checkLoadItemDeleteInlineBtn: {
    minWidth: 24,
    minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',

  },
  checkLoadItemDeleteInlineIconDisabled: {
    opacity: 0.35,
  },
  checkLoadItemTextRejected: {
    color: COLORS.colorOrange,
  },
});

export default styles;
