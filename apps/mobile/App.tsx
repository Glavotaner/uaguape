import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  Button,
  Pressable,
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { AuthError } from "./src/error/Error";
import { Home, Question } from "./src/question/Question";
import { ApiProvider, useApi } from "./src/shared/context/ApiProvider";
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
import { Label } from "./src/shared/components/label/Label";

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
            <PairingProvider>
              <NavigationContainer theme={theme}>
                <Navigation />
              </NavigationContainer>
            </PairingProvider>
          </ApiProvider>
        </AuthProvider>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const Navigation = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  const [image, setImage] = React.useState(null);

  const { hasAuth, isAuthReady } = useAuth();
  const { users } = useApi();

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = await users.get("");
      if (data) {
        setImage(data);
      }
    };
    if (isAuthReady && hasAuth && !image) {
      fetchImage();
    }
  }, [isAuthReady]);

  const { hasPairId, pairId, cancelPair } = usePairing();

  return (
    <Stack.Navigator>
      {!isAuthReady ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : !hasAuth ? (
        <Stack.Screen name="AuthError" component={AuthError} />
      ) : hasPairId ? (
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
