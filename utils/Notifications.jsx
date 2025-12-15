import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from "./registerForPushNotificationsAsync.jsx";

const initializeNotifications = async () => {
  console.log('Init');
  await Notifications.requestPermissionsAsync();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

const scheduleNotification = async (Task) => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: Task ? Task.title : "Hi from one of your tasks today",
                body: 'Your task is due',
                sound: 'notification.wav'
            },
            trigger: {
                channelId: 'taskNotify',
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(Task.scheduleNotificationDate)
            },
        });
    } else {
        Alert.alert(
            "Unable to schedule notification",
            "Enable the notifications permission for Expo Go in settings",
        );
    }
}

export {scheduleNotification, initializeNotifications};