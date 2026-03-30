import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 infoBackdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.45)',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 8,
 },
 infoCard: {
  width: '100%',
  maxWidth: 380,
  borderRadius: 8,
  backgroundColor: COLORS.white,
  paddingTop: 10,
  paddingBottom: 12,
  paddingHorizontal: 16,
 },
 infoTitle: {
  color: COLORS.word,
  fontSize: 18,
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
  marginTop: 4,
  marginBottom: 8,
 },
 infoTable: {
  paddingTop: 10,
 },
 infoRow: {
  flexDirection: 'row',
  alignItems: 'stretch',
 },
 infoDivider: {
  width: 2,
  borderLeftWidth: 1,
  borderStyle: 'dashed',
  borderColor: '#b7b2c7',
  marginLeft: 2,
  marginRight: 6,
 },
 infoLabel: {
  flex: 1,
  minHeight: 35,
  paddingTop: 4,
  paddingLeft: 8,
  color: COLORS.word,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansRegular',
 },
 infoValue: {
  flex: 1.8,
  minHeight: 35,
  paddingTop: 4,
  paddingLeft: 8,
  marginLeft: 6,
  color: COLORS.colorPrimaryClearLetter,
  fontSize: DIMENS.generalText,
  fontFamily: 'OpenSansLight',
 },
 infoActionsRow: {
  marginTop: 16,
  paddingHorizontal: 56,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
 },
 infoActionIcon: {
  width: 40,
  height: 40,
  padding: 10,
  resizeMode: 'contain',
  tintColor: COLORS.colorPrimaryDarkLetter,
  opacity: 1,
 },
});

export default styles;
