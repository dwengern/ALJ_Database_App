import { collection, query, where, getDocs, getDoc, addDoc, onSnapshot, doc } from "firebase/firestore";
import { loadApp } from '$lib/firebase-client';
import type { Community } from '$lib/community-type'

const { db } = loadApp();

const q = query(collection(db, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});

//Communities
export const fetchCommunities = async () => { 
  const q = query(collection(db!, 'communities'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
}

export const addCommunity = async (community: Community) => { 
  return await addDoc(collection(db!, 'communities'), community)
}

export const subscribeToCommunities = (callback) => { 
  const q = collection(db!, 'communities')
  
  return onSnapshot(q, (snapshot) => { 
    const communities = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    callback(communities)
  })
}

export const fetchCommunityById = async (id) => { 
  const commDoc = doc(db!, 'communities', id)
  const docSnap = await getDoc(commDoc)

  if (docSnap.exists()) { 
    return {id: docSnap.id, ...docSnap.data()}
  } else { 
    throw new Error('Community not found')
  }
}