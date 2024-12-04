import { collection, query, where, getDocs, getDoc, addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { loadApp } from '$lib/firebase-client';
import type { Community } from '$lib/community-type'

const {db} = loadApp()

const q = query(collection(db!, "cities"), where("capital", "==", true));

const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});

//Communities
export const fetchCommunities = async () => { 
  try { 
    const q = query(collection(db!, 'communities'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
  } catch (err) { 
    console.error('Error when fetching communities: ', err)
    return
  }
}

export const addCommunity = async (community: Community) => { 
  try { 
    return await addDoc(collection(db!, 'communities'), community)
  } catch (err) { 
    console.error('Error when adding community: ', err)
    return
  }
  
}

export const subscribeToCommunities = (callback: (communities: Community[]) => void) => { 
  const q = collection(db!, 'communities')
  
  return onSnapshot(q, (snapshot) => { 
    const communities = snapshot.docs.map(doc => ({id: doc.id, ...(doc.data() as Community)}))
    callback(communities)
  })
} 

export const fetchCommunityById = async (id: string) => { 
  
  try { 
    const commDoc = doc(db!, 'communities', id)
    const docSnap = await getDoc(commDoc)

    if (docSnap.exists()) { 
      return {id: docSnap.id, ...(docSnap.data() as Community)}
    } else { 
      throw new Error('Community not found')
    }
  } catch (err) { 
    console.error(`Error when fetching community with ID ${id}: `, err)
    return
  } 
}

export const deleteCommunityById = async (id: string): Promise<void> => { 
  try { 
    const commDoc = doc(db!, 'communities', id)
    await deleteDoc(commDoc)
  } catch (err) { 
    console.error(`Error when deleting community with ID ${id}: `, err)
    return
  }
}

