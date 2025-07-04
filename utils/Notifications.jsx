import * as Notifications from 'expo-notifications';

export const initializeNotifications = async () => {
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