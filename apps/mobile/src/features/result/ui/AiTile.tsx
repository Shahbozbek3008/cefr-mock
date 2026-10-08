import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import { radius, useTheme } from '@/shared/theme';
import { HeroSurface } from '@/shared/ui';

export const AiTile = memo(() => {
  const { colors } = useTheme();

  return (
    <HeroSurface colors={colors.aiTile} style={styles.tile}>
      <Sparkles size={16} color={colors.selectedText} strokeWidth={1.6} />
    </HeroSurface>
  );
});

AiTile.displayName = 'AiTile';

const styles = StyleSheet.create({
  tile: {
    width: 36,
    height: 36,
    borderRadius: radius.input,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
