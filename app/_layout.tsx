import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="weekly" options={{ presentation: 'modal' }} />
      <Stack.Screen name="character-chooser" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
