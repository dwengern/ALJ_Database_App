import { collection, query, where, getDocs } from "firebase/firestore";
import { loadApp } from '$lib/firebase-client';

const { db } = loadApp();

const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});