import { Stage } from "@/components/layout/stage";
import { NextTestLink } from "@/components/exam/next-test-link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { KeyValueList } from "@/components/ui/key-value-list";
import { SuccessBadge } from "@/components/ui/success-badge";
import { formatSum } from "@/lib/format";
import { initLocale, metadataTitle, type LocaleParams } from "@/lib/i18n";
import { PLANS, RECOMMENDED_PLAN } from "@/lib/mock/plans";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

export const generateMetadata = metadataTitle("billingSuccess.title");

const plan = PLANS.find((p) => p.id === RECOMMENDED_PLAN)!;

function SuccessView() {
  const t = useTranslations("billingSuccess");
  const tp = useTranslations("plans");

  return (
    <Stage glow>
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="flex w-full max-w-[480px] flex-col items-center gap-6 rounded-hero bg-surface p-10 text-center shadow-[0_0_0_1px_rgba(20,22,30,.05),0_40px_80px_-40px_rgba(20,22,30,.3)] max-sm:p-6">
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

export default async function BillingSuccessPage({
  params,
}: {
  params: LocaleParams;
}) {
  await initLocale(params);
  return <SuccessView />;
}
