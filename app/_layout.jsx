// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack>
//       {/* Welcome screen is Index page */}
//       <Stack.Screen name="index" options={{
//         headerShown: false
//       }}/>
//       <Stack.Screen name="register" options={{
//         headerShown: false
//       }}/>
//       <Stack.Screen name="login" options={{
//         headerShown: false
//       }}/>
//       <Stack.Screen name="HomeDashboard" options={{
//         headerShown: false
//       }}/>
//       <Stack.Screen name="profileScreen" options={{
//         headerShown: false
//       }}/>
//     </Stack>
//   );
// }
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView >
      <Stack>
        {/* Welcome screen is Index page */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="[HomeDashboard]" options={{ headerShown: false }} />
        <Stack.Screen name="profileScreen" options={{ headerShown: false }} />
        <Stack.Screen name="Homedetails" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
