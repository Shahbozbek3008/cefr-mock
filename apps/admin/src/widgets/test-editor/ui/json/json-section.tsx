import { useFormContext } from 'react-hook-form';
import type { TestDraft } from '@/entities/test';
import { JsonExportCard, JsonImportCard } from '@/features/import-json';

export function JsonSection({ onImport }: { onImport: (draft: TestDraft) => void }) {
  const { getValues } = useFormContext<TestDraft>();
  return (
    <div className="flex flex-col gap-5">
      <JsonImportCard templateNumber={getValues('number')} onImport={onImport} />
      <JsonExportCard />
    </div>
  );
}
