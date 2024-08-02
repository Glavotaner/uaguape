import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform, View } from "react-native";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUsers } from "../hooks/users";

const messagingClient = messaging();

const MessagingContext = createContext<{
  receivedMessage?: { title?: string; body?: string } | null;
}>({});
export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const users = useUsers();
  const [hasNotificationPermissions, setHasNotificationPermissions] =
    useState(false);
  const [receivedMessage, setReceivedMessage] = useState<{
    title?: string;
    body?: string;
  } | null>(null);

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
      if (initialNotification?.notification) {
        setReceivedMessage({
          title: initialNotification.notification.title,
          body: initialNotification.notification.body,
        });
      }
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
          if (message.notification) {
            const { title, body } = message.notification;
            setReceivedMessage({ title, body });
          }
        }),
        messagingClient.onNotificationOpenedApp(async (message) => {
          if (message.notification) {
            const { title, body } = message.notification;
            setReceivedMessage({ title, body });
          }
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
