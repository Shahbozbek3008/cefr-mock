import { Tabs } from 'expo-router';
import { usePushNotifications } from '@/features/push-notifications/model/usePushNotifications';
import { useTheme } from '@/shared/theme';
import { TabBar } from '@/widgets/tab-bar';

export default function TabsLayout() {
  const { colors } = useTheme();
  usePushNotifications();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="tests" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
