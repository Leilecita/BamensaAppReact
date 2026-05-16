import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
 backdrop: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.52)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 12,
 },
 card: {
  width: '100%',
  maxWidth: 520,
  borderRadius: 10,
  backgroundColor: '#f3f2f7',
  overflow: 'hidden',
  paddingTop: 14,
  paddingHorizontal: 10,
  paddingBottom: 10,
 },
 title: {
  textAlign: 'center',
  color: '#4f4677',
  fontSize: 40 / 2,
  marginBottom: 12,
  fontFamily: 'OpenSansRegular',
 },
 infoRow: {
  minHeight: 42,
  paddingHorizontal: 8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
 },
 infoText: {
  color: '#5a5572',
  fontSize: 18,
  fontFamily: 'OpenSansLight',
 },
 infoDash: {
  color: '#8f8a9f',
  fontSize: 18,
  marginHorizontal: 8,
 },
 affectText: {
  marginTop: 10,
  color: '#5d5d66',
  fontSize: 14,
  textAlign: 'center',
  fontFamily: 'OpenSansRegular',
 },
 actions: {
  marginTop: 14,
  flexDirection: 'row',
 },
 cancelBtn: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 6,
  paddingVertical: 0,
  backgroundColor: 'transparent',
 },
 cancelText: {
  color: '#5f5782',
  fontSize: 18,
  fontFamily: 'OpenSansRegular',
 },
 deleteBtn: {
  flex: 1,
  height: 46,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 6,
  backgroundColor: '#6f6392',
 },
 deleteText: {
  color: '#fff',
  fontSize: 18,
  fontFamily: 'OpenSansBold',
 },
});

export default styles;
