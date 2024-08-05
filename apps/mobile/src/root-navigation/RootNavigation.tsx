import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { AuthorizedStack } from "../authorized/Authorized";
import { AuthError } from "../error/Error";
import { useAuth } from "../shared/context/AuthProvider";
import { MessagingProvider } from "../shared/context/MessagingProvider";
import { RootStackParamList } from "../shared/types/root-stack-param-list";
import { SplashScreen } from "../splash/Splash";

export const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { hasAuth, isAuthReady } = useAuth();

  const Authorized = useCallback(
    () => (
      <MessagingProvider>
        <AuthorizedStack />
      </MessagingProvider>
    ),
    []
  );

  return (
    <Stack.Navigator>
      {!isAuthReady ? (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      ) : !hasAuth ? (
        <Stack.Screen name="AuthError" component={AuthError} />
      ) : (
        <Stack.Screen
          name="Authorized"
          component={Authorized}
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};
