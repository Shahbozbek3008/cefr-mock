import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const PlayIcon = memo<{ size?: number; color: string }>(({ size = 18, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
  </Svg>
));

PlayIcon.displayName = 'PlayIcon';
