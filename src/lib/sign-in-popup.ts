import { getAuth, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {NullUser, type User} from "$lib/user-types"

export function callSignInWithPopup(callback: (user:User) => void) {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();    
    signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential){
        const token = credential.accessToken;
        console.log("Token:", token)
        // The signed-in user info.
        const user = result.user;
        console.log("User:", user)
        callback({name: user.displayName!, email:user.email!, photoURL:user.photoURL!})
      } else {
        console.log("Yikes! It's a null credential.")
      }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log("Error!", errorCode, errorMessage, email, credential)
      // ...
    });
}

export function callSignOut(callback: (user:User) => void) {
  const auth = getAuth();
  signOut(auth).then(() => {
    callback(NullUser)
  }).catch((error) => {
    // An error happened.
    console.log("Ack, no sign out?" + error.message)
  });
  
}

