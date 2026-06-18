import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

type ToastContextValue = {
  showToast: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = (nextMessage: string, durationMs = 1800) => {
    if (!nextMessage.trim()) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setMessage(nextMessage);
    setVisible(true);

    Animated.timing(opacity, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();

    timeoutRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setVisible(false);
          setMessage('');
        }
      });
    }, durationMs);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible ? (
        <View pointerEvents="none" style={styles.portal}>
          <Animated.View style={[styles.toast, { opacity }]}>
            <Text style={styles.toastText}>{message}</Text>
          </Animated.View>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  portal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    maxWidth: '86%',
    minHeight: 42,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(53, 46, 74, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  toastText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'OpenSansRegular',
    textAlign: 'center',
  },
});
