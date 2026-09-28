import { Redirect, Tabs } from 'expo-router';
import { selectIsAuthenticated, useUserStore } from '@/entities/user/model';
import { useProfileSync } from '@/features/profile/model/useProfileSync';
import { usePushNotifications } from '@/features/push-notifications/model/usePushNotifications';
import { useTheme } from '@/shared/theme';
import { TabBar } from '@/widgets/tab-bar';

const SignedInEffects = () => {
  useProfileSync();
  usePushNotifications();
  return null;
};

export default function TabsLayout() {
  const { colors } = useTheme();
  const isAuthenticated = useUserStore(selectIsAuthenticated);

  if (!isAuthenticated) return <Redirect href="/(auth)/phone" />;

  return (
    <>
      <SignedInEffects />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="tests" />
        <Tabs.Screen name="progress" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </>
  );
}
