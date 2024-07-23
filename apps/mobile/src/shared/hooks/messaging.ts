import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform, ToastAndroid } from "react-native";
import { useApi } from "../context/ApiProvider";
import { useEffect, useState } from "react";
import { UpdateUserDto } from "uaguape-common";

const messagingClient = messaging();

export const useMessaging = () => {
  const { users } = useApi();
  const [hasNotificationPermissions, setHasNotificationPermissions] =
    useState(false);

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
            console.log("showing", title ?? body);
            ToastAndroid.showWithGravity(
              (body ?? title)!,
              ToastAndroid.LONG,
              ToastAndroid.TOP
            );
          }
        }),
        messagingClient.onNotificationOpenedApp(async (message) => {
          if (message.notification) {
            const { title, body } = message.notification;
            ToastAndroid.showWithGravity(
              (body ?? title)!,
              ToastAndroid.LONG,
              ToastAndroid.TOP
            );
          }
        }),
        messagingClient.onTokenRefresh((pushToken) => {
          const dto: UpdateUserDto = { pushToken: pushToken ?? undefined };
          users.patch("", dto);
        })
      );
    }
    return () => {
      subscribers.forEach((subscriber) => subscriber());
    };
  }, [hasNotificationPermissions]);

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
      if (initialNotification) {
        // TODO do something
      }
      const pushToken = await getToken();
      const dto: UpdateUserDto = { pushToken: pushToken! };
      users.patch("", dto);
    }
  };
};
