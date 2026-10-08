import { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAttemptStore } from '@/entities/attempt';
import type { Highlight } from '@/entities/attempt';
import type { PassageParagraph, ReadingPart } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { font, gradientDirection, space, useTheme } from '@/shared/theme';
import { Text, useToast } from '@/shared/ui';
import { HighlightToolbar, highlightTone } from './HighlightToolbar';

const TOOLBAR_TOP = 56;
const TOOLBAR_LEFT = 72;
const FADE_HEIGHT = 56;
const EMPTY: Highlight[] = [];

export type PassageProps = {
  part: ReadingPart;
  serif: boolean;
  bottomInset: number;
};

const Paragraph = memo<{
  paragraph: PassageParagraph;
  highlight?: Highlight;
  serif: boolean;
  onLongPress: (label: string) => void;
}>(({ paragraph, highlight, serif, onLongPress }) => {
  const { colors } = useTheme();
  const fill = highlight ? { backgroundColor: highlightTone(colors, highlight.color).fill } : undefined;
  const phrase = paragraph.highlight;
  const [before, after] = phrase ? paragraph.text.split(phrase) : [paragraph.text, ''];

  return (
    <Pressable onLongPress={() => onLongPress(paragraph.label)} delayLongPress={300} style={styles.paragraph}>
      <Text variant="monoXs" color={colors.textTertiary} style={styles.label}>
        {paragraph.label}
      </Text>
      <Text variant="reading" color={colors.textReading} style={[styles.text, serif && styles.serif]}>
        {phrase && fill ? (
          <>
            {before}
            <Text variant="reading" color={colors.textReading} style={[fill, serif && styles.serif]}>
              {phrase}
            </Text>
            {after}
          </>
        ) : (
          <Text variant="reading" color={colors.textReading} style={[fill, serif && styles.serif]}>
            {paragraph.text}
          </Text>
        )}
      </Text>
    </Pressable>
  );
});

Paragraph.displayName = 'Paragraph';

export const Passage = memo<PassageProps>(({ part, serif, bottomInset }) => {
  const { colors } = useTheme();
  const { t } = useI18n();
  const highlights = useAttemptStore((s) => s.highlights[part.id] ?? EMPTY);
  const toggleHighlight = useAttemptStore((s) => s.toggleHighlight);
  const showToast = useToast((s) => s.show);
  const [selected, setSelected] = useState<string | null>(null);

  const pick = useCallback(
    (color: Highlight['color']) => {
      if (selected) toggleHighlight(part.id, { paragraph: selected, color });
      setSelected(null);
    },
    [part.id, selected, toggleHighlight],
  );

  const note = useCallback(() => {
    setSelected(null);
    showToast({ message: t('reading.notesSoon') });
  }, [showToast, t]);

  return (
    <View style={styles.area}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + FADE_HEIGHT }]}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => setSelected(null)}
      >
        <Pressable onPress={() => setSelected(null)}>
          <Text variant="titleReading" style={styles.title}>
            {part.title}
          </Text>
          <View style={styles.paragraphs}>
            {part.passage.map((paragraph) => (
              <View key={paragraph.label}>
                <Paragraph
                  paragraph={paragraph}
                  highlight={highlights.find((h) => h.paragraph === paragraph.label)}
                  serif={serif}
                  onLongPress={setSelected}
                />
                {selected === paragraph.label ? (
                  <View style={styles.toolbarAnchor}>
                    <HighlightToolbar
                      active={highlights.find((h) => h.paragraph === paragraph.label)?.color}
                      onPick={pick}
                      onNote={note}
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </Pressable>
      </ScrollView>
      <LinearGradient
        pointerEvents="none"
        colors={[colors.bgClear, colors.bg]}
        start={gradientDirection.vertical.start}
        end={gradientDirection.vertical.end}
        style={[styles.fade, { bottom: bottomInset }]}
      />
    </View>
  );
});

Passage.displayName = 'Passage';

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  content: {
    paddingTop: space[5.5],
    paddingHorizontal: space[6],
  },
  title: {
    marginBottom: space[3.5],
  },
  paragraphs: {
    gap: space[4.5],
  },
  paragraph: {
    flexDirection: 'row',
    gap: space[2.5],
  },
  label: {
    width: 14,
    paddingTop: space[1.5],
  },
  text: {
    flex: 1,
  },
  serif: {
    fontFamily: font.serif,
  },
  toolbarAnchor: {
    position: 'absolute',
    top: TOOLBAR_TOP,
    left: TOOLBAR_LEFT,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: FADE_HEIGHT,
  },
});
