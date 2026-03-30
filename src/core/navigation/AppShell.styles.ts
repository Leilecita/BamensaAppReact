import { StyleSheet } from 'react-native';
import { DIMENS } from '../constants/dimensions';

const styles = StyleSheet.create({
 overlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.22)',
 },
 panelWrap: {
  flexDirection: 'row',
  flex: 1,
 },
 backdrop: {
  flex: 1,
 },
 panel: {
  width: 255,
  height: '100%',
  backgroundColor: '#f8f8fb',
 },
 header: {
  backgroundColor: '#746b97',
  minHeight: 120,
  justifyContent: 'flex-end',
  paddingHorizontal: 24,
  paddingBottom: 18,
 },
 user: {
  color: '#ffffff',
  fontSize: DIMENS.smallText,
  lineHeight: 22,
  fontFamily: 'OpenSansRegular',
 },
 section: {
  paddingTop: 6,
  paddingBottom: 6,
 },
 item: {
  minHeight: 48,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 18,
 },
 icon: {
  width: 24,
  marginRight: 16,
 },
 itemText: {
  color: '#4f4677',
  fontSize: DIMENS.valueText,
  lineHeight: 20,
  fontFamily: 'OpenSansRegular',
 },
 sectionTitle: {
  color: '#7e7695',
  fontSize: DIMENS.textDetailBottom,
  lineHeight: 20,
  fontFamily: 'OpenSansRegular',
  paddingHorizontal: 22,
  paddingTop: 8,
  paddingBottom: 2,
 },
 divider: {
  height: 1,
  backgroundColor: '#d2cae7',
 },
});

export default styles;
