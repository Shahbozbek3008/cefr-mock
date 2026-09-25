import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { features, formatSum, paymentMethods, plans } from '@/features/subscription/model/plans';
import type { PaymentMethod, PlanId } from '@/features/subscription/model/plans';
import { PaymentOption } from '@/features/subscription/ui/PaymentOption';
import { PlanCard } from '@/features/subscription/ui/PlanCard';
import { light, size, space } from '@/shared/theme';
import { Button, IconButton, Screen, Tag, Text, TopBar, useToast } from '@/shared/ui';

const FOOTER_SPACE = size.buttonL + 72;

export default function SubscriptionScreen() {
  const insets = useSafeAreaInsets();
  const [planId, setPlanId] = useState<PlanId>('quarterly');
  const [method, setMethod] = useState<PaymentMethod>('click');
  const showToast = useToast((s) => s.show);

  const plan = plans.find((p) => p.id === planId) ?? plans[0];
  const methodTitle = paymentMethods.find((m) => m.id === method)?.title ?? '';

  const onPay = useCallback(() => {
    showToast({ message: `${methodTitle} orqali to'lov tez orada ishga tushadi` });
  }, [methodTitle, showToast]);

  return (
    <Screen>
      <TopBar
        left={
          <IconButton accessibilityLabel="Yopish" onPress={router.back}>
            <X size={17} color={light.textStrong} strokeWidth={1.6} />
          </IconButton>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + FOOTER_SPACE }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Tag label="CEFR Mock Pro" tone="pro" size="md" />
          <Text variant="titleLg">Imtihonga to'liq tayyorlaning</Text>
        </View>

        <View style={styles.features}>
          {features.map((feature) => (
            <View key={feature} style={styles.feature}>
              <View style={styles.featureIcon}>
                <Check size={11} color={light.selectedText} strokeWidth={2.8} />
              </View>
              <Text variant="bodySm" color={light.textStrong}>
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
          <Text variant="callout" color={light.textSecondary} style={styles.paymentLabel}>
            To'lov usuli
          </Text>
          <View style={styles.methods}>
            {paymentMethods.map((item) => (
              <PaymentOption key={item.id} {...item} selected={item.id === method} onSelect={setMethod} />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { bottom: insets.bottom + space[3] }]}>
        <Button label={`${formatSum(plan.price)} so'm to'lash`} trailingText={methodTitle} onPress={onPay} />
        <Text variant="micro" color={light.textTertiary} center>
          Istalgan vaqt bekor qilish mumkin
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: light.chipActiveBg,
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
});
