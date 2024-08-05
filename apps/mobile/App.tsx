import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState } from "react";
import {
  Linking,
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
  MessagingProvider,
  useMessaging,
} from "./src/shared/context/MessagingProvider";
import { AuthorizedStackParamList } from "./src/shared/types/authorized-stack-param.list";
import { Question } from "./src/question/components/Question/Question";
import { ProfileImage } from "./src/question/components/ProfileImage/ProfileImage";
import { HomeProps } from "./src/shared/types/screen-props";
import messaging from "@react-native-firebase/messaging";

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
            <NavigationContainer
              theme={theme}
              linking={{
                prefixes: ["uaguape://"],
                config: {
                  screens: {
                    Authorized: {
                      screens: {
                        PairingRequest: {
                          path: "pair/:pairId",
                          parse: { pairId: String },
                        },
                        Question: {
                          path: "question/:id",
                          parse: { id: String },
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
    </ThemeProvider>
  );
}

const Navigation = () => {
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

  const Profile = useCallback(
    ({ navigation }: HomeProps) => (
      <ProfileImage onPress={() => navigation.navigate("Pairing")} />
    ),
    []
  );

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={(props) => ({
          title: "Questions",
          headerRight: () => <Profile {...props} />,
        })}
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
      <Stack.Screen
        name="PairingRequest"
        component={PairingRequest}
        options={{
          presentation: "modal",
          title: "Pairing Request",
          animation: "fade_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};

export default App;
