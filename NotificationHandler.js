import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import { app, auth, db, database } from "./Firebase";
import { onValue, ref, set, update } from "firebase/database";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function NotificationHandler(send, phoneNumber, title, body, data) {

  // console.log(title, body, data)

  // await Notifications.scheduleNotificationAsync({
  //   content: {
  //     title: title,
  //     body: body,
  //     data: { data: data },
  //   },
  //   trigger: { seconds: 1 },
  // })

  var expoPushToken = ''

  if (send) {

    onValue(ref(database, `users/${phoneNumber}/`), async (users) => {
      expoPushToken = users.val()["fcmToken"]
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: data },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    });
  }

}

export async function NotificationData() {
  Notifications.addNotificationResponseReceivedListener(response => {
    const url = response.notification.request.content.data;
    // Linking.openURL(url);
    console.log(url)
  });
}

export async function NotificationPermission() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Notification Permission Disabled', 'Please enable notification permissions to get updates about your order!');
      return '';
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Device Not Found', 'Must use physical device for Push Notifications');
    return '';
  }
}