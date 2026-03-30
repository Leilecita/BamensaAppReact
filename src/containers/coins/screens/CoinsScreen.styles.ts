import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
 screen: {
  flex: 1,
  backgroundColor: '#dfe0e5',
 },
 listContent: {
  paddingTop: 8,
  paddingBottom: 28,
 },
 center: {
  marginTop: 24,
  alignItems: 'center',
  justifyContent: 'center',
 },
 infoText: {
  color: '#706d7b',
  fontFamily: 'OpenSansRegular',
  textAlign: 'center',
  paddingHorizontal: 18,
 },
 retryButton: {
  marginTop: 12,
  backgroundColor: '#6f6392',
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 8,
 },
 retryText: {
  color: '#ffffff',
  fontFamily: 'OpenSansRegular',
 },
});

export default styles;
