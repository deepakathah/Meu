import { Stack } from 'expo-router'

const MatchLayout = () => {
  return (
    <Stack 
    screenOptions={{ headerShown: false }}
    initialRouteName="index"
    >
      <Stack.Screen name='index' />
      
    </Stack>
  )
}

export default MatchLayout