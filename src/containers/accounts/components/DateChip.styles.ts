import { StyleSheet } from 'react-native';
import { COLORS } from '../../../core/constants/colors';
import { DIMENS } from '../../../core/constants/dimensions';

const styles = StyleSheet.create({
 wrap: {
  alignSelf: 'flex-start',
  minWidth: 106,
  borderRadius: 8,
  backgroundColor: COLORS.colorPrimaryClear2,
  paddingHorizontal: 14,
  paddingVertical: 2,
 },
 text: {
  color: COLORS.colorPrimaryIntLetter,
  fontSize: DIMENS.smallText,
  fontFamily: 'OpenSansRegular',
 },
});

export default styles;
