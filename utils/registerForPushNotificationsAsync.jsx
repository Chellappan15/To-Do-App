import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("taskNotify", {
      name: "Task Notifier",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      showBadge: false,
      sound: 'notification.wav'
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status;
    } else {
      return existingStatus;
    }
  } else {
    return null;
  }
}