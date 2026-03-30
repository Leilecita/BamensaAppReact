import React, { ReactNode, useMemo, useRef } from 'react';
import {
 Animated,
 Image,
 ImageSourcePropType,
 PanResponder,
 StyleProp,
 StyleSheet,
 TouchableOpacity,
 View,
 ViewStyle,
} from 'react-native';

type AppBottomSheetProps = {
 height: number;
 peekHeight: number;
 children: ReactNode;
 arrowSource?: ImageSourcePropType;
 containerStyle?: StyleProp<ViewStyle>;
 bodyStyle?: StyleProp<ViewStyle>;
 dragOn?: 'handle' | 'body' | 'both';
};

export default function AppBottomSheet({
 height,
 peekHeight,
 children,
 arrowSource = require('../../../assets/images/ui/arrowsan.png'),
 containerStyle,
 bodyStyle,
 dragOn = 'body',
}: AppBottomSheetProps) {
 const minY = 0;
 const maxY = Math.max(0, height - peekHeight);
 const translateY = useRef(new Animated.Value(maxY)).current;
 const currentY = useRef(maxY);
 const dragStartY = useRef(maxY);

 const clamp = (value: number) => Math.max(minY, Math.min(value, maxY));

 const animateTo = (toValue: number) => {
  currentY.current = toValue;
  Animated.spring(translateY, {
   toValue,
   damping: 22,
   stiffness: 220,
   mass: 0.9,
   useNativeDriver: true,
  }).start();
 };

 const panResponder = useMemo(
  () =>
   PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 2,
    onPanResponderGrant: () => {
      dragStartY.current = currentY.current;
    },
    onPanResponderMove: (_, gestureState) => {
      translateY.setValue(clamp(dragStartY.current + gestureState.dy));
    },
    onPanResponderRelease: (_, gestureState) => {
      const released = clamp(dragStartY.current + gestureState.dy);
      const shouldExpand = released < maxY * 0.56 || gestureState.vy < -0.45;
      animateTo(shouldExpand ? minY : maxY);
    },
   }),
  [maxY, minY, translateY],
 );

 const toggleSheet = () => {
  const target = currentY.current <= maxY / 2 ? maxY : minY;
  animateTo(target);
 };

 return (
  <Animated.View style={[styles.root, { height, transform: [{ translateY }] }, containerStyle]}>
   <View
    style={styles.handleWrap}
    {...(dragOn === 'handle' || dragOn === 'both' ? panResponder.panHandlers : {})}
   >
    <TouchableOpacity onPress={toggleSheet} activeOpacity={0.8}>
     <Image source={arrowSource} style={styles.handleArrow} />
    </TouchableOpacity>
   </View>
   <View
    style={[styles.body, bodyStyle]}
    {...(dragOn === 'body' || dragOn === 'both' ? panResponder.panHandlers : {})}
   >
    {children}
   </View>
  </Animated.View>
 );
}

const styles = StyleSheet.create({
 root: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
 },
 handleWrap: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingBottom: 1,
 },
 handleArrow: {
  width: 40,
  height: 15,
  resizeMode: 'contain',
 },
 body: {
  flex: 1,
 },
});
