import { Stack } from 'expo-router';
import { WeeklyPlanProvider } from '../src/context/WeeklyPlanContext';
import { HabitProvider } from '../src/context/HabitContext';
import { ProfileProvider } from '../src/context/ProfileContext';

export default function RootLayout() {
  return (
    <WeeklyPlanProvider>
      <HabitProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="weekly" options={{ presentation: 'modal' }} />
            <Stack.Screen name="character-chooser" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
          </Stack>
        </ProfileProvider>
      </HabitProvider>
    </WeeklyPlanProvider>
  );
}
