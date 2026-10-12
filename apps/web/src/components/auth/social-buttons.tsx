import { GoogleIcon } from "@cefr/ui/components/brand-icons";
import { useTranslations } from "next-intl";

const PROVIDERS = [{ key: "google", mark: <GoogleIcon size={18} /> }] as const;

export function SocialButtons() {
  const t = useTranslations("auth");
  return (
    <div className="w-full flex flex-col gap-3">
      {PROVIDERS.map((p) => (
        <button
          key={p.key}
          type="button"
          className="flex h-12 items-center justify-center gap-2.5 rounded-[14px] bg-surface px-4 text-sm font-medium shadow-inset transition-colors duration-(--t-fast) hover:bg-bg-app"
        >
          {p.mark}
          {t(p.key)}
        </button>
      ))}
    </div>
  );
}

export function OrDivider() {
  const t = useTranslations("auth");
  return (
    <div className="flex items-center gap-[14px] text-xs text-ink-3">
      <span className="h-px flex-1 bg-divider-muted" />
      {t("or")}
      <span className="h-px flex-1 bg-divider-muted" />
    </div>
  );
}
