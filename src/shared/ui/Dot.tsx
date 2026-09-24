import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

export type DotProps = {
  color: string;
  size?: number;
  ring?: string;
  ringWidth?: number;
};

export const Dot = memo<DotProps>(({ color, size = 6, ring, ringWidth = 3 }) => {
  const dot = <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;

  if (!ring) return dot;

  const outer = size + ringWidth * 2;

  return (
    <View
      style={[
        styles.ring,
        { width: outer, height: outer, borderRadius: outer / 2, backgroundColor: ring, margin: -ringWidth },
      ]}
    >
      {dot}
    </View>
  );
});

Dot.displayName = 'Dot';

const styles = StyleSheet.create({
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
