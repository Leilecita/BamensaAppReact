import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  backdropStyle?: StyleProp<ViewStyle>;
  keyboardAware?: boolean;
  keyboardGap?: number;
};

export default function AppDialog({
  visible,
  onClose,
  children,
  cardStyle,
  backdropStyle,
  keyboardAware = false,
  keyboardGap = 12,
}: Props) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!keyboardAware) return;

    const windowHeight = Dimensions.get('window').height;

    const handleKeyboardFrame = (event: any) => {
      Keyboard.scheduleLayoutAnimation?.(event);
      const screenY = event?.endCoordinates?.screenY;
      if (typeof screenY !== 'number') return;
      const nextHeight = Math.max(0, windowHeight - screenY);
      setKeyboardHeight(nextHeight);
    };

    const handleKeyboardHide = (event?: any) => {
      Keyboard.scheduleLayoutAnimation?.(event);
      setKeyboardHeight(0);
    };

    const willChangeSub =
      Platform.OS === 'ios'
        ? Keyboard.addListener('keyboardWillChangeFrame', handleKeyboardFrame)
        : null;
    const willHideSub =
      Platform.OS === 'ios' ? Keyboard.addListener('keyboardWillHide', handleKeyboardHide) : null;
    const didShowSub =
      Platform.OS === 'android' ? Keyboard.addListener('keyboardDidShow', handleKeyboardFrame) : null;
    const didHideSub =
      Platform.OS === 'android' ? Keyboard.addListener('keyboardDidHide', handleKeyboardHide) : null;

    return () => {
      willChangeSub?.remove();
      willHideSub?.remove();
      didShowSub?.remove();
      didHideSub?.remove();
    };
  }, [keyboardAware, keyboardGap]);

  const content = (
    <Pressable
      style={[
        styles.backdrop,
        keyboardHeight > 0
          ? { justifyContent: 'flex-end', paddingBottom: keyboardHeight + keyboardGap }
          : null,
        backdropStyle,
      ]}
      onPress={onClose}
    >
      <Pressable style={[styles.card, cardStyle]} onPress={() => {}}>
        {children}
      </Pressable>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    overflow: 'visible',
  },
});
