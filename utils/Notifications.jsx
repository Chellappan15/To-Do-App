import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from "./registerForPushNotificationsAsync.jsx";
import { Linking } from 'react-native';

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
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: Task ? Task.title : "Hi from one of your tasks today",
                body: 'Your task is due',
                sound: 'notification.wav'
            },
            trigger: {
                channelId: 'taskNotify',
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(Task.completionDate)
            },
        });
        return identifier;
    } else if (result !== 'granted'){
        return false;
    }
}

const cancelScheduledNotification = async (identifier) => {
    const cancel = await Notifications.cancelScheduledNotificationAsync(identifier);
}

export {scheduleNotification, cancelScheduledNotification, initializeNotifications};