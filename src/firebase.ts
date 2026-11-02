import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { SavedProjectIdea, SavedStudentSession } from './types/recommender';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Auth & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Export Firestore with explicit database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore Connection as required by Firebase skill
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// -------------------------------------------------------------
// FIRESTORE ERROR HANDLING (SESUAI DOKUMENTASI FIREBASE SKILL)
// -------------------------------------------------------------
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// -------------------------------------------------------------
// GOOGLE AUTHENTICATION HELPERS
// -------------------------------------------------------------
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error saat login dengan Google:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error saat logout:', error);
    throw error;
  }
}

export async function getUserAuthToken(): Promise<string | null> {
  if (!auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch (err) {
    console.warn('Gagal mengambil ID token user:', err);
    return null;
  }
}

// -------------------------------------------------------------
// FIRESTORE USER DATA SYNC (ISOLASI DATA PER PENGGUNA)
// -------------------------------------------------------------
export async function fetchUserFirestoreIdeas(userId: string): Promise<SavedProjectIdea[]> {
  const path = `users/${userId}/savedProjectIdeas`;
  try {
    const colRef = collection(db, 'users', userId, 'savedProjectIdeas');
    const snapshot = await getDocs(colRef);
    const ideas: SavedProjectIdea[] = [];
    snapshot.forEach((d) => {
      ideas.push(d.data() as SavedProjectIdea);
    });
    return ideas;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveUserFirestoreIdea(
  userId: string,
  idea: SavedProjectIdea
): Promise<void> {
  const cleanId = idea.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const path = `users/${userId}/savedProjectIdeas/${cleanId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedProjectIdeas', cleanId);
    await setDoc(docRef, {
      ...idea,
      id: cleanId,
      userId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserFirestoreIdea(
  userId: string,
  ideaId: string
): Promise<void> {
  const cleanId = ideaId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const path = `users/${userId}/savedProjectIdeas/${cleanId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedProjectIdeas', cleanId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function fetchUserFirestoreSessions(
  userId: string
): Promise<SavedStudentSession[]> {
  const path = `users/${userId}/savedSessions`;
  try {
    const colRef = collection(db, 'users', userId, 'savedSessions');
    const snapshot = await getDocs(colRef);
    const sessions: SavedStudentSession[] = [];
    snapshot.forEach((d) => {
      sessions.push(d.data() as SavedStudentSession);
    });
    return sessions;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveUserFirestoreSession(
  userId: string,
  session: SavedStudentSession
): Promise<void> {
  const cleanId = session.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const path = `users/${userId}/savedSessions/${cleanId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedSessions', cleanId);
    await setDoc(docRef, {
      ...session,
      id: cleanId,
      userId,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserFirestoreSession(
  userId: string,
  sessionId: string
): Promise<void> {
  const cleanId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const path = `users/${userId}/savedSessions/${cleanId}`;
  try {
    const docRef = doc(db, 'users', userId, 'savedSessions', cleanId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
