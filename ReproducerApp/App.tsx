/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type {ReactNode} from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native';

function App(): React.JSX.Element {
  const [showToast, setShowToast] = useState<boolean>(false);

  return (
    <SafeAreaView style={{ height: '100%', width: '100%', backgroundColor: 'green' }}>
      <AnimateToast showToast={showToast} onHideToast={() => setShowToast(false)} />
      <View>
        <View style={{ position: 'absolute', top: 0, height: 400, width: 200, backgroundColor: 'red' }} />
        <Button title="Click me" onPress={() => setShowToast(true)}/>
      </View>
    </SafeAreaView>
  );
}

export default App;


export interface ToastPresenterProps {
  toast: IToastChildren | null;
  children: React.ReactNode;
  onHideToast: () => void;
}

export type ToastData = string | ReactNode;
export enum ToastType {
  Info,
  Error,
}
export interface IToastChildren {
  data: ToastData;
  displayTime?: number;
  toastType: ToastType;
}

export function AnimateToast({
  showToast,
  onHideToast,
}: {
  showToast: boolean;
  onHideToast: () => void;
}): JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(false);
  const animatedPosition = useMemo(() => new Animated.Value(-75), []);
  const animatedOpacity = useMemo(() => new Animated.Value(0), []);

  const animate = useCallback(
    (show: boolean) => {
      animatedOpacity.stopAnimation();
      animatedPosition.stopAnimation();
      
      if (show) {
        setShouldRender(true);
      }

      Animated.parallel([
        Animated.timing(animatedOpacity, {
          toValue: show ? 1 : 0,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animatedPosition, {
          toValue: show ? 0 : -75,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished && !show) {
          setShouldRender(false);
        }
      });
    },
    [animatedOpacity, animatedPosition]
  );

  useEffect(() => {
    if (showToast) {
      animate(true);
      
      const timer = setTimeout(() => {
        animate(false);
        onHideToast();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      animate(false);
    }
  }, [showToast, animate, onHideToast]);

  if (!shouldRender && !showToast) {
    return null;
  }

  return (
    <Animated.View
      style={[
        // eslint-disable-next-line react-native/no-inline-styles
        {
          zIndex: 1,
          position: 'absolute',
          alignSelf: 'center',
          transform: [{ translateY: animatedPosition }],
          opacity: animatedOpacity,
          top: 100,
        },
      ]}
    >
      <Toast />
    </Animated.View>
  );
}

export const Toast = (): JSX.Element => {
  return (
    <View>
      <Text>Toast</Text>
    </View>
  );
};
