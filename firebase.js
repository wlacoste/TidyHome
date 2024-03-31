// import AsyncStorage from "@react-native-async-storage/async-storage";
import {initializeApp} from 'firebase/app';
import {getAuth, setPersistence, browserLocalPersistence} from 'firebase/auth';
// import { getReactNativePersistence } from "firebase/auth/react-native";
// import Constants from "expo-constants";
// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: process.env.EXPO_API_KEY,
  // authDomain: process.env.EXPO_AUTH_DOMAIN,
  // projectId: process.env.EXPO_PROJECT_ID,
  // storageBucket: process.env.EXPO_STORAGE_BUCKET,
  // messagingSenderId: process.env.EXPO_MESSAGING_SENDER_ID,
  // appId: process.env.EXPO_APP_ID,

  // apiKey: Constants.expoConfig.extra.firebaseApiKey,
  // authDomain: Constants.expoConfig.extra.firebaseAuthDomain,
  // projectId: Constants.expoConfig.extra.firebaseProjectId,
  // storageBucket: Constants.expoConfig.extra.firebaseStorageBucket,
  // messagingSenderId: Constants.expoConfig.extra.firebaseMessagingSenderId,
  // appId: Constants.expoConfig.extra.firebaseAppId,

  apiKey: 'AIzaSyA-zgo6FrQepRU6KgddKuRT5phP55For-M',
  authDomain: 'appgestion-af959.firebaseapp.com',
  projectId: 'appgestion-af959',
  storageBucket: 'appgestion-af959.appspot.com',
  messagingSenderId: '773047202408',
  appId: '1:773047202408:web:ef4f3707630cb7556681dd',
};

// Initialize Firebase
// let app;
// if(firebase.apps.lenght === 0){
//     app = firebase.initializeApp(firebaseConfig);
// }else{
//     app= firebase.app()
// }
// const auth = firebase.auth();
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log("Local persistence enabled");
//   })
//   .catch((error) => {
//     console.error("Error setting React Native persistence:", error);
//   });

// export const db = getFirestore(app);
export default app;
