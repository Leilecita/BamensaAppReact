import { StyleSheet } from 'react-native';
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
  paddingHorizontal: 8,
  paddingTop: 6,
  paddingBottom: 2,
 },
 sectionHeaderText: {
  color: '#8a839b',
  fontSize: DIMENS.bigText,
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
});

export default styles;
