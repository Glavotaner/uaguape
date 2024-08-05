import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  ToastAndroid,
  useColorScheme,
} from "react-native";
import { AuthError } from "./src/error/Error";
import { Home } from "./src/question/Home";
import { ApiProvider } from "./src/shared/context/ApiProvider";
import { AuthProvider, useAuth } from "./src/shared/context/AuthProvider";
import { RootStackParamList } from "./src/shared/types/root-stack-param-list";
import { SplashScreen } from "./src/splash/Splash";
import { ThemeProvider, useTheme } from "./src/shared/context/ThemeProvider";
import { PairingRequest } from "./src/pairing-request/PairingRequest";
import { Pairing } from "./src/pairing/Pairing";
import {
  PairingProvider,
  usePairing,
} from "./src/shared/context/PairingProvider";
import {
  MessagingProvider,
  useMessaging,
} from "./src/shared/context/MessagingProvider";
import { AuthorizedStackParamList } from "./src/shared/types/authorized-stack-param.list";
import { Question } from "./src/question/components/Question/Question";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const theme = useTheme();

  const backgroundStyle = {
    backgroundColor: theme.colors.primary,
    flex: 1,
  };

  return (
    <ThemeProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <AuthProvider>
          <ApiProvider>
            <NavigationContainer theme={theme}>
              <Navigation />
            </NavigationContainer>
          </ApiProvider>
        </AuthProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { hasAuth, isAuthReady } = useAuth();

  const Authorized = useCallback(
    () => (
      <PairingProvider>
        <MessagingProvider>
          <AuthorizedStack />
        </MessagingProvider>
      </PairingProvider>
    ),
    []
  );

  return (
    <Stack.Navigator>
      {!isAuthReady ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
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

const AuthorizedStack = () => {
  const Stack = createNativeStackNavigator<AuthorizedStackParamList>();
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const { hasPair, pairId, cancelPair } = usePairing();
  const { receivedMessage } = useMessaging();
  const navigation = useNavigation();

  useEffect(() => {
    return navigation.addListener("state", (r) => {
      const [authorizedScreen] = r.data.state.routes;
      const routes = authorizedScreen.state?.routes;
      if (routes) {
        const currentRoute = routes[routes.length - 1].name;
        setCurrentRoute(currentRoute);
      }
    });
  }, []);

  useEffect(() => {
    if (receivedMessage) handleNotification();
  }, [receivedMessage]);

  const handleNotification = useCallback(() => {
    const hasNotification = receivedMessage!.notification;

    if (hasNotification) {
      const { title, body } = receivedMessage!.notification!;
      const url = receivedMessage!.data?.url;
      if (!url || !url.endsWith(currentRoute!)) {
        ToastAndroid.show(body ?? title!, ToastAndroid.SHORT);
      }
    }
  }, [currentRoute, receivedMessage]);

  return (
    <Stack.Navigator>
      {hasPair ? (
        <Stack.Screen
          name="PairingRequest"
          component={PairingRequest}
          initialParams={{ pairId: pairId! }}
          options={{
            presentation: "modal",
            title: "Pairing Request",
            animation: "fade_from_bottom",
            headerLeft: () => <Button title="Cancel" onPress={cancelPair} />,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Questions" }}
          />
          <Stack.Screen
            name="Question"
            component={Question}
            options={{
              headerBackVisible: true,
              animation: "fade_from_bottom",
              title: "Question",
            }}
          />
          <Stack.Screen
            name="Pairing"
            component={Pairing}
            options={{
              presentation: "containedModal",
              title: "Generate Pairing Code",
              animation: "fade_from_bottom",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default App;
