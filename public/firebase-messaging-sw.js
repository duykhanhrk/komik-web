importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCccKZHifMjI-Aqsg2XZ52k_2WzOPDfu0k',
  authDomain: 'notification-de481.firebaseapp.com',
  projectId: 'notification-de481',
  storageBucket: 'notification-de481.appspot.com',
  messagingSenderId: '796008968797',
  appId: '1:796008968797:web:d80f7b6f5570cbf91f93b4'
});

firebase.messaging();
