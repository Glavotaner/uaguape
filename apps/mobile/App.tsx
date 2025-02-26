import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Linking, SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { ApiProvider, useApi } from "./src/shared/context/ApiProvider";
import { AuthProvider, useAuth } from "./src/shared/context/AuthProvider";
import messaging from "@react-native-firebase/messaging";
import { LightTheme, DarkTheme } from "./src/shared/constants/theme";
import { deepLink, DEEP_LINK_SCHEMA } from "@uaguape/linking";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCallback } from "react";
import { AuthorizedStack } from "./src/authorized/Authorized";
import { AuthError } from "./src/error/Error";
import { MessagingProvider } from "./src/shared/context/MessagingProvider";
import { RootStackParamList } from "./src/shared/types/root-stack-param-list";
import { SplashScreen } from "./src/splash/Splash";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const theme = isDarkMode ? DarkTheme : LightTheme;

  const backgroundStyle = {
    backgroundColor: theme.colors.primary,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <AuthProvider>
        <ApiProvider>
          <NavigationContainer
            theme={theme}
            linking={{
              prefixes: [DEEP_LINK_SCHEMA],
              config: {
                screens: {
                  Authorized: {
                    screens: {
                      PairingRequest: {
                        path: deepLink.PairingRequest.path,
                        parse: deepLink.PairingRequest.parse,
                      },
                      Question: {
                        path: deepLink.Question.path,
                        parse: deepLink.Question.parse,
                      },
                    },
                  },
                },
              },
              subscribe(listener) {
                const linkingListener = Linking.addEventListener(
                  "url",
                  ({ url }) => listener(url)
                );
                const messageOpenedAppListener =
                  messaging().onNotificationOpenedApp((message) => {
                    if (message.data?.url) {
                      listener(message.data.url as string);
                    }
                  });

                return () => {
                  linkingListener.remove();
                  messageOpenedAppListener();
                };
              },
            }}
          >
            <Navigation />
          </NavigationContainer>
        </ApiProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  const { hasAuth, isAuthReady } = useAuth();
  const { isReady: isApiReady } = useApi();

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
      {!isAuthReady || !isApiReady ? (
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

export default App;
