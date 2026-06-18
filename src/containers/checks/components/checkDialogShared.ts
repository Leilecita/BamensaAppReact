import { COLORS } from '../../../core/constants/colors';

export const CHECK_DIALOG_SHARED = {
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 10,
  },
  card: {
    alignSelf: 'center' as const,
    width: '100%' as const,
    borderRadius: 10,
    backgroundColor: COLORS.background_dialog,
    padding: 12,
    paddingHorizontal: 22,
  },
  actionButtonHeight: 35,
};
