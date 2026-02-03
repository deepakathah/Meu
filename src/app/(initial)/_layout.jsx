import { Stack } from 'expo-router'

const MainStack = () => {
  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName="index"
    >
      <Stack.Screen name='index' />
    </Stack>
  )
}

export default MainStack

