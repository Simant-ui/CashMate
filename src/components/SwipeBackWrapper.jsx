import React, { useRef } from 'react';
import { View, PanResponder } from 'react-native';

/**
 * SwipeBackWrapper
 * Enables iOS-native style swipe-right gesture (slide right from left edge)
 * to navigate back or close screens/modals.
 * Works seamlessly on iOS devices, simulator, Android, and web touch screens.
 */
export const SwipeBackWrapper = ({ children, onSwipeBack, enabled = true, style }) => {
  const onSwipeBackRef = useRef(onSwipeBack);
  onSwipeBackRef.current = onSwipeBack;

  const panResponder = useRef(
    PanResponder.create({
      // Never capture start so child buttons receive touch immediately
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      // Only capture when swiping right with clear horizontal intent
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enabled || !onSwipeBackRef.current) return false;

        const touchX = evt?.nativeEvent?.pageX ?? 0;
        const dx = gestureState?.dx ?? 0;
        const dy = gestureState?.dy ?? 0;

        // Condition 1: Left edge bezel swipe (touched within left 100px and swiping right)
        const isLeftEdgeSwipe = touchX < 100 && dx > 15 && Math.abs(dy) < Math.abs(dx) * 0.85;

        // Condition 2: Clear horizontal right swipe across screen
        const isHorizontalRightSwipe = dx > 35 && Math.abs(dx) > Math.abs(dy) * 1.5;

        return isLeftEdgeSwipe || isHorizontalRightSwipe;
      },

      onPanResponderTerminationRequest: () => false,

      onPanResponderRelease: (evt, gestureState) => {
        if (!enabled || !onSwipeBackRef.current) return;

        const dx = gestureState?.dx ?? 0;
        const vx = gestureState?.vx ?? 0;

        // Trigger back on quick flick or sustained drag
        const isQuickFlick = dx > 40 && vx > 0.25;
        const isLongDrag = dx > 90;

        if (isQuickFlick || isLongDrag) {
          onSwipeBackRef.current();
        }
      },

      onPanResponderTerminate: (evt, gestureState) => {
        if (!enabled || !onSwipeBackRef.current) return;

        const dx = gestureState?.dx ?? 0;
        if (dx > 80) {
          onSwipeBackRef.current();
        }
      }
    })
  ).current;

  return (
    <View style={[{ flex: 1 }, style]} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};
