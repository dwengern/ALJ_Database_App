/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import type { Voyage } from '$lib/voyage-type';
import { getFirestore, Firestore, collection, getDocs, query, where, CollectionReference } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0WPpH52vz7ATRg-6bI-OCOOxDPNYmj9I",
  authDomain: "alj-firebase.firebaseapp.com",
  projectId: "alj-firebase",
  storageBucket: "alj-firebase.firebasestorage.app",
  messagingSenderId: "930702959478",
  appId: "1:930702959478:web:dea7a808c32870f5191057",
  measurementId: "G-0KVXES7FRE"
};

// Initialize Firebase app and Firestore
const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export async function getAllShips(): Promise<Voyage[]> {
    try {
        const shipsCollectionRef = collection(db, 'voyages_db') as CollectionReference<Voyage>;
        const querySnapshot = await getDocs(shipsCollectionRef);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error getting all ships: ", error);
        throw error;
    }
}

export async function searchShipByName(shipName: string): Promise<Voyage[] | null> {
    try {
        const shipsCollectionRef = collection(db, 'voyages_db') as CollectionReference<Voyage>;

        const q = query(shipsCollectionRef, where("SHIPNAME", "==", shipName));

        const querySnapshot = await getDocs(q);

        if(querySnapshot.empty) {
            console.log(`No ship found with the name "${shipName}".`);
            return null;
        }

        const ships = querySnapshot.docs.map(doc => doc.data());
        return ships;
    } catch (error) {
        console.error("Error searching for ship: ", error);
        throw error;
    }
}
