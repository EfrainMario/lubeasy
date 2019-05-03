// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBB1_kiiIbtMbR5s5CcsgYtGwk6JK0PwI4",
    authDomain: "lubssy-818a4.firebaseapp.com",
    databaseURL: "https://lubssy-818a4.firebaseio.com",
    projectId: "lubssy-818a4",
    storageBucket: "lubssy-818a4.appspot.com",
    messagingSenderId: "1020319819161"
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    var notificationTitle = 'Background Message Title';
    var notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };
    notificationOptions.click = function() {
        window.open("http://stackoverflow.com", "lubeasy");
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});