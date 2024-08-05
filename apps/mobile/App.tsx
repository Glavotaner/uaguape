import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Linking, SafeAreaView, StatusBar, useColorScheme } from "react-native";
import { ApiProvider } from "./src/shared/context/ApiProvider";
import { AuthProvider } from "./src/shared/context/AuthProvider";
import { FontProvider } from "./src/shared/context/ThemeProvider";
import messaging from "@react-native-firebase/messaging";
import { Navigation } from "./src/root-navigation/RootNavigation";
import { LightTheme, DarkTheme } from "./src/shared/constants/theme";
import { deepLink, DEEP_LINK_SCHEMA } from "@uaguape/linking";

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
          <FontProvider>
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
          </FontProvider>
        </ApiProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

export default App;
