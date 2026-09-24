import { Tabs } from 'expo-router';
import { light } from '@/shared/theme';
import { TabBar } from '@/widgets/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: light.bg } }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="tests" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
