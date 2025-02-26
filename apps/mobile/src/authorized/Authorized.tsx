import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect, useCallback } from "react";
import { ToastAndroid } from "react-native";
import { PairingRequest } from "../pairing-request/PairingRequest";
import { ProfileImage } from "../question/components/ProfileImage/ProfileImage";
import { Question } from "../question/components/Question/Question";
import { Home } from "../question/Home";
import { useMessaging } from "../shared/context/MessagingProvider";
import { AuthorizedStackParamList } from "../shared/types/authorized-stack-param.list";
import { HomeProps } from "../shared/types/screen-props";
import { Profile } from "../profile/Profile";

export const AuthorizedStack = () => {
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

  const ProfileImageButton = useCallback(
    ({ navigation }: HomeProps) => (
      <ProfileImage onPress={() => navigation.navigate("Profile")} />
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
          headerRight: () => <ProfileImageButton {...props} />,
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
        name="Profile"
        component={Profile}
        options={{
          presentation: "containedModal",
          title: "Profile",
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
