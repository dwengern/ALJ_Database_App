// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "alj-firebase.firebaseapp.com",
  projectId: "alj-firebase",
  storageBucket: "alj-firebase.appspot.com",
  messagingSenderId: "930702959478",
  appId: "1:930702959478:web:dea7a808c32870f5191057",
  measurementId: "G-0KVXES7FRE"
};

// Initialize Firebase
export const loadApp = () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);


    let analytics = null;
    if (typeof window !== "undefined") {
      isSupported()
        .then ((supported) => { 
          if (supported) { 
            analytics = getAnalytics(app)
          }          
        })
        .catch((error) => { 
          console.warn("Analytics not supported: ", error)
        })
    }
    
    return {app, analytics, db};
}