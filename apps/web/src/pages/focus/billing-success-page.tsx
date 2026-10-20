import { Stage } from "@/shared/ui/stage";
import { NextTestLink } from "@/entities/test";
import { Button } from "@cefr/ui/components/button";
import { Icon } from "@cefr/ui/components/icon";
import { KeyValueList } from "@cefr/ui/components/key-value-list";
import { SuccessBadge } from "@cefr/ui/components/success-badge";
import { formatSum } from "@cefr/ui/lib/format";
import { PLANS, RECOMMENDED_PLAN } from "@cefr/ui/lib/plans";
import { Download } from "lucide-react";
import { useTranslations } from "use-intl";
import { usePageTitle } from "@/shared/lib/use-page-title";

const plan = PLANS.find((p) => p.id === RECOMMENDED_PLAN)!;

export default function BillingSuccessPage() {
  const t = useTranslations("billingSuccess");
  const tp = useTranslations("plans");
  usePageTitle(t("title"));

  return (
    <Stage glow>
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-6 rounded-hero bg-surface p-10 text-center shadow-[0_0_0_1px_rgb(var(--line-rgb)/.05),0_40px_80px_-40px_rgba(20,22,30,.3)] max-sm:p-6">
          <SuccessBadge size="lg" />
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[30px] font-medium tracking-[-0.04em]">
              {t("title")}
            </h1>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-2">
              {t("text")}
            </p>
          </div>
          <KeyValueList
            variant="muted"
            className="w-full"
            items={[
              {
                label: t("plan"),
                value: t("planValue", { plan: tp(`${plan.id}.name`) }),
              },
              { label: t("validUntil"), value: t("validUntilValue") },
              {
                label: t("payment"),
                value: t("paymentValue", {
                  method: "Click",
                  amount: formatSum(plan.price),
                }),
              },
            ]}
          />
          <div className="flex w-full flex-col gap-2">
            <NextTestLink
              arrow
              block
              className="px-[18px] shadow-action-sm"
            >
              {t("startTest")}
            </NextTestLink>
            <Button
              variant="secondary"
              block
              icon={<Icon as={Download} size={16} />}
              className="h-12 text-sm"
            >
              {t("receipt")}
            </Button>
          </div>
        </div>
      </div>
    </Stage>
  );
}
