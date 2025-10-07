import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="screen-one" />
      <Stack.Screen name="screen-two" />
      <Stack.Screen name="screen-three" />
    </Stack>
  );
}
