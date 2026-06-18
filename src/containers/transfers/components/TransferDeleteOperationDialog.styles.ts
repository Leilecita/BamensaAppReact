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
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  title: {
    textAlign: 'center',
    color: COLORS.colorPrimaryDarkLetter,
    fontSize: 19,
    fontFamily: 'OpenSansBold',
    marginBottom: 12,
  },
  typeText: {
    textAlign: 'center',
    color: COLORS.colorPrimaryIntLetter,
    fontSize: 17,
    fontFamily: 'OpenSansRegular',
  },
  observationText: {
    marginTop: 12,
    color: COLORS.word,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'center',
  },
  message: {
    marginTop: 14,
    color: COLORS.word,
    fontSize: 16,
    fontFamily: 'OpenSansLight',
    textAlign: 'center',
  },
  actionsRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelBtn: {
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: COLORS.colorDialogButton,
    fontSize: 18,
    fontFamily: 'OpenSansRegular',
  },
  deleteBtn: {
    flex: 1,
    height: 35,
    borderRadius: 8,
    marginLeft: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.colorDialogButton,
  },
  deleteText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'OpenSansBold',
  },
});

export default styles;
