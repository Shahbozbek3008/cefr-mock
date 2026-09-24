import { ReactNode, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { light } from '../../theme';

export type ProgressRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: ReactNode;
};

export const ProgressRing = memo<ProgressRingProps>(
  ({ value, size = 44, stroke = 3, color = light.data, children }) => {
    const center = size / 2;
    const r = center - stroke;
    const c = 2 * Math.PI * r;
    const filled = c * Math.max(0, Math.min(1, value));

    return (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Circle cx={center} cy={center} r={r} fill="none" stroke={light.dataTrack} strokeWidth={stroke} />
          <Circle
            cx={center}
            cy={center}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${c}`}
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.center]}>{children}</View>
      </View>
    );
  },
);

ProgressRing.displayName = 'ProgressRing';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
