import { useAnimatedStyle } from 'react-native-reanimated';
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller';

export const useKeyboardLift = (covered: number) => {
  const { height } = useReanimatedKeyboardAnimation();
  return useAnimatedStyle(() => ({ marginBottom: Math.max(0, -height.value - covered) }));
};
