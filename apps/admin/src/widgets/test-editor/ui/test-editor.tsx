import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import type { TestDraft } from '@/entities/test';
import { IssuesPanel, useDraftIssues } from '@/features/validate-test';
import type { EditorTab } from '../model/tabs';
import { useTestEditor } from '../model/use-test-editor';
import { EditorHeader } from './editor-header';
import { EditorOutcomeNotice } from './editor-outcome';
import { EditorTabs } from './editor-tabs';
import { JsonSection } from './json/json-section';
import { ListeningSection } from './listening/listening-section';
import { MetaSection } from './meta/meta-section';
import { ReadingSection } from './reading/reading-section';
import { SpeakingSection } from './speaking/speaking-section';
import { WritingSection } from './writing/writing-section';

type TestEditorProps = {
  initial: TestDraft;
  initialPublished: boolean;
  isNew: boolean;
};

function DraftIssues() {
  return <IssuesPanel issues={useDraftIssues()} />;
}

function ActiveSection({ tab, isNew, onImport }: { tab: EditorTab; isNew: boolean; onImport: (draft: TestDraft) => void }) {
  switch (tab) {
    case 'general':
      return <MetaSection isNew={isNew} />;
    case 'listening':
      return <ListeningSection />;
    case 'reading':
      return <ReadingSection />;
    case 'writing':
      return <WritingSection />;
    case 'speaking':
      return <SpeakingSection />;
    case 'json':
      return <JsonSection onImport={onImport} />;
  }
}

export function TestEditor({ initial, initialPublished, isNew }: TestEditorProps) {
  const editor = useTestEditor({ initial, initialPublished, isNew });
  const [tab, setTab] = useState<EditorTab>('general');

  return (
    <FormProvider {...editor.form}>
      <div className="flex flex-col gap-4">
        <div className="sticky top-0 z-10 -mx-4 flex flex-col gap-3 border-b border-divider bg-bg-app/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
          <EditorHeader published={editor.published} dirty={editor.dirty} isNew={isNew} onSave={editor.save} onTogglePublish={editor.togglePublish} />
          <EditorTabs value={tab} onChange={setTab} />
        </div>
        <EditorOutcomeNotice outcome={editor.outcome} />
        <DraftIssues />
        <div key={editor.revision}>
          <ActiveSection tab={tab} isNew={isNew} onImport={editor.importDraft} />
        </div>
      </div>
    </FormProvider>
  );
}
