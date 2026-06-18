import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.52)',
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 12,
    backgroundColor: COLORS.background_dialog,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    textAlign: 'center',
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 20,
    fontFamily: 'OpenSansBold',
    marginTop: 4,
    marginBottom: 18,
  },
  observationRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 16,
  },
  observationTextWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 14,
    marginTop: 4,
  },
  observationText: {
    color: COLORS.word,
    fontSize: 18,
    fontFamily: 'OpenSansLight',
  },
  copyBtn: {
    width: 110,
    height: 56,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    opacity: 0.9,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 6,
  },
  infoIconWrap: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  infoIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    opacity: 0.8,
  },
  infoText: {
    flex: 1,
    color: COLORS.word,
    fontSize: 18,
    fontFamily: 'OpenSansLight',
  },
  actionsRow: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    opacity: 0.6,
  },
});

export default styles;
