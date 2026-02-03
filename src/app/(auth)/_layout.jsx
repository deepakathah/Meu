import { Stack } from 'expo-router'

const AuthStack = () => {
  return (
    <Stack 
    screenOptions={{ headerShown: false }}
    initialRouteName="index"
    >
      <Stack.Screen name='index' />
      <Stack.Screen name="register" />
    </Stack>
  )
}

export default AuthStack