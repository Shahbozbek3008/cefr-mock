import { useTranslations } from 'use-intl';
import { SegmentedControl } from '@cefr/ui/components/segmented-control';
import { EDITOR_TABS, type EditorTab } from '../model/tabs';

const isEditorTab = (value: string): value is EditorTab => (EDITOR_TABS as readonly string[]).includes(value);

export function EditorTabs({ value, onChange }: { value: EditorTab; onChange: (tab: EditorTab) => void }) {
  const t = useTranslations('editor.tabs');
  const options = EDITOR_TABS.map((tab) => ({ value: tab, label: t(tab) }));

  return (
    <div className="overflow-x-auto">
      <SegmentedControl
        label={t('label')}
        options={options}
        value={value}
        className="min-w-[560px]"
        onValueChange={(next) => {
          if (isEditorTab(next)) onChange(next);
        }}
      />
    </div>
  );
}
