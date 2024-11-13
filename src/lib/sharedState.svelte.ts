
import type { User } from '$lib/user-types';
import { NullUser } from '$lib/user-types';
import type {Firestore} from 'firebase/firestore';

import type { Auth } from 'firebase/auth';

type SharedState = {
    db: Firestore | null;
    user: User;
    auth: Auth | null;
}

const initSharedState:SharedState = { db: null, user: NullUser, auth: null };
export const sharedState = $state(initSharedState);

export function updateUser({ name, email, photoURL, uid, bio }: User): void {
    sharedState.user = { name, email, photoURL, uid, bio };
}
