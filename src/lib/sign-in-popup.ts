import { signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import type {Auth} from "firebase/auth"

import {NullUser, type User} from "$lib/user-types"

export function callSignInWithPopup(auth:Auth) {
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

export function callSignOut(auth: Auth) {
  signOut(auth).then(() => {
    console.log("Signed out")
  }).catch((error) => {
    // An error happened.
    console.log("Ack, no sign out?" + error.message)
  })
}

