import { Stack } from 'expo-router'

const MainStack = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="(tabs)"
    >
      <Stack.Screen name='index' />
      <Stack.Screen name='vibePage' />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="wheel" />
      <Stack.Screen name="userprofile" />
    </Stack>
  )
}

export default MainStack

