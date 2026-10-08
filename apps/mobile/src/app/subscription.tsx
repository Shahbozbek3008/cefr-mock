import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { formatSum, paymentMethods, plans } from '@/features/subscription/model/plans';
import type { PaymentMethod, PlanId } from '@/features/subscription/model/plans';
import { PaymentOption } from '@/features/subscription/ui/PaymentOption';
import { PlanCard } from '@/features/subscription/ui/PlanCard';
import { useI18n } from '@/shared/i18n';
import { makeStyles, size, space, useTheme } from '@/shared/theme';
import { Button, IconButton, Screen, Tag, Text, TopBar, useToast } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + 72;

export default function SubscriptionScreen() {
  const styles = useStyles();
  const { colors } = useTheme();
  const { t, dict } = useI18n();
  const insets = useSafeAreaInsets();
  const [planId, setPlanId] = useState<PlanId>('quarterly');
  const [method, setMethod] = useState<PaymentMethod>('click');
  const showToast = useToast((s) => s.show);

  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const methodTitle = paymentMethods.find((m) => m.id === method)?.title ?? '';

  const onPay = useCallback(() => {
    showToast({ message: t('subscription.paymentSoon', { method: methodTitle }) });
  }, [methodTitle, showToast, t]);

  return (
    <Screen>
      <TopBar
        left={
          <IconButton accessibilityLabel={t('common.close')} onPress={router.back}>
            <X size={17} color={colors.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Tag label="CEFR Mock Pro" tone="pro" size="md" />
          <Text variant="titleLg">{t('subscription.title')}</Text>
        </View>

        <View style={styles.features}>
          {dict.subscription.features.map((feature) => (
            <View key={feature} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Check size={11} color={colors.selectedText} strokeWidth={2.8} />
              </View>
              <Text variant="bodySm" color={colors.textStrong}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map((item) => (
            <PlanCard key={item.id} plan={item} selected={item.id === planId} onSelect={setPlanId} />
          ))}
        </View>

        <View style={styles.payment}>
          <Text variant="callout" color={colors.textSecondary} style={styles.paymentLabel}>
            {t('subscription.paymentMethod')}
          </Text>
          <View style={styles.methods}>
            {paymentMethods.map((item) => (
              <PaymentOption key={item.id} {...item} selected={item.id === method} onSelect={setMethod} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button
          label={t('subscription.pay', { price: formatSum(plan.price) })}
          trailingText={methodTitle}
          onPress={onPay}
        />
        <Text variant="micro" color={colors.textTertiary} center>
          {t('subscription.cancelAnytime')}
        </Text>
      </View>
    </Screen>
  );
}

const useStyles = makeStyles(({ colors }) => ({
  content: {
    paddingTop: space[4],
    gap: space[4],
  },
  intro: {
    gap: space[2],
    paddingHorizontal: space[1],
  },
  features: {
    gap: space[2.5],
    paddingHorizontal: space[1],
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[2.5],
  },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.chipActiveBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plans: {
    gap: space[2],
  },
  payment: {
    gap: space[2],
  },
  paymentLabel: {
    paddingHorizontal: space[1],
  },
  methods: {
    flexDirection: 'row',
    gap: space[2],
  },
  footer: {
    position: 'absolute',
    left: size.screenPadding,
    right: size.screenPadding,
    gap: space[2],
  },
}));
