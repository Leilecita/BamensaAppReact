import React from 'react';
import { Image, ImageSourcePropType, StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  iconSource?: ImageSourcePropType;
  disabled?: boolean;
};

const DEFAULT_ICON = require('../../../assets/images/ui/anadir.png');

export default function AddActionButton({
  onPress,
  style,
  iconSource = DEFAULT_ICON,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={style}
      disabled={disabled}
    >
      <Image source={require('../../../assets/images/ui/buttonbshadow.png')} style={styles.buttonBg} />
      <Image source={iconSource} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
}

const styles = {
  buttonBg: {
    width: '100%' as const,
    height: '100%' as const,
    resizeMode: 'contain' as const,
    tintColor: COLORS.colorPrimary,
  },
  icon: {
    position: 'absolute' as const,
    top: '50%' as const,
    left: '50%' as const,
    width: 28,
    height: 28,
    marginTop: -14,
    marginLeft: -14,
  },
};
