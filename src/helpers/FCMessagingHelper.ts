import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage} from 'firebase/messaging';

export async function activeFCMessaging() {
  const firebaseApp = initializeApp({
    apiKey: 'AIzaSyCccKZHifMjI-Aqsg2XZ52k_2WzOPDfu0k',
    authDomain: 'notification-de481.firebaseapp.com',
    projectId: 'notification-de481',
    storageBucket: 'notification-de481.appspot.com',
    messagingSenderId: '796008968797',
    appId: '1:796008968797:web:d80f7b6f5570cbf91f93b4'
  });

  const messaging = getMessaging(firebaseApp);

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.log('Unable to get permission to notify.');
  }

  try {
    const token = await getToken(messaging, { vapidKey: 'BOe5t63uynrOT0Q2iYXSUxuwfXqjwNYzkBrhdN1mNWfRl_ky3Pk5KgjXYRkpNcUt8YHI_wjX5w4LGsWUSSTOSYw' });
    console.log('token', token);
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
  });
}
