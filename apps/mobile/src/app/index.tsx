import { Redirect } from 'expo-router';
import { selectIsAuthenticated, selectOnboardingCompleted, useUserStore } from '@/entities/user/model';

export default function Index() {
  const onboardingCompleted = useUserStore(selectOnboardingCompleted);
  const isAuthenticated = useUserStore(selectIsAuthenticated);

  if (!onboardingCompleted) return <Redirect href="/(onboarding)/level" />;
  if (!isAuthenticated) return <Redirect href="/(auth)/phone" />;

  return <Redirect href="/(tabs)/home" />;
}
