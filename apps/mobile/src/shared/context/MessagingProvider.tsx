import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUsers } from "../hooks/users";
import { NotificationDto } from "@uaguape/common";

const messagingClient = messaging();

const MessagingContext = createContext<{
  receivedMessage?: NotificationDto | null;
}>({});
export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const users = useUsers();
  const [hasNotificationPermissions, setHasNotificationPermissions] =
    useState(false);
  const [receivedMessage, setReceivedMessage] =
    useState<NotificationDto | null>(null);

  const permission = "android.permission.POST_NOTIFICATIONS" as const;

  const hasPermission = () => PermissionsAndroid.check(permission);

  const requestPermission = async () => {
    // Notification runtime permissions are only a thing since API Level 33
    if (Platform.OS === "android" && Platform.Version < 32) return true;

    const _hasPermission = await hasPermission();
    if (_hasPermission) return true;
    const permissionStatus = await PermissionsAndroid.request(permission);
    return permissionStatus === "granted";
  };

  const getToken = async () => messagingClient.getToken();

  const setup = async () => {
    const permissionGranted = await requestPermission();
    if (permissionGranted) {
      setHasNotificationPermissions(true);
      const initialNotification =
        await messagingClient.getInitialNotification();
      setReceivedMessage({
        notification: initialNotification?.notification,
        data: initialNotification?.data,
      });
      const pushToken = await getToken();
      updateUser(pushToken);
    }
  };

  const updateUser = useCallback(
    (pushToken?: string) => users.update({ pushToken }),
    [users]
  );

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    const subscribers: (() => void)[] = [];
    if (hasNotificationPermissions) {
      subscribers.push(
        messagingClient.onMessage(async (message) => {
          setReceivedMessage({
            notification: message?.notification,
            data: message?.data,
          });
        }),
        messagingClient.onNotificationOpenedApp(async (message) => {
          setReceivedMessage({
            notification: message?.notification,
            data: message?.data,
          });
        }),
        messagingClient.onTokenRefresh((pushToken) => {
          updateUser(pushToken);
        })
      );
    }
    return () => {
      subscribers.forEach((subscriber) => subscriber());
    };
  }, [hasNotificationPermissions]);

  return (
    <MessagingContext.Provider value={{ receivedMessage }}>
      {children}
    </MessagingContext.Provider>
  );
};
