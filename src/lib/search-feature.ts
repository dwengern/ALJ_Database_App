/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import type { Voyage } from '$lib/voyage-type';
import {sharedState} from '$lib/sharedState.svelte';
import { getFirestore, Firestore, collection, getDocs, query, where, CollectionReference } from "firebase/firestore";


export async function getAllShips(): Promise<Voyage[]> {
    try {
        const shipsCollectionRef = collection(sharedState.db!, 'voyages_db') as CollectionReference<Voyage>;
        const querySnapshot = await getDocs(shipsCollectionRef);
        return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error("Error getting all ships: ", error);
        throw error;
    }
}

export async function searchShipByName(shipName: string): Promise<Voyage[] | null> {
    try {
        const shipsCollectionRef = collection(sharedState.db!, 'voyages_db') as CollectionReference<Voyage>;

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
