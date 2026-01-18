import { initializeApp, getApp, getApps } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type UserCredential,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  type Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Debug: log if config is missing
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.error('Firebase config missing! Check .env.local file and restart dev server');
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const signUp = (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

export const signIn = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

export const signOut = (): Promise<void> => firebaseSignOut(auth);

export const signInWithGoogle = (): Promise<UserCredential> =>
  signInWithPopup(auth, googleProvider);

// Link Management Types
export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  activeFrom?: number;
  activeTo?: number;
  createdAt: any;
}

// Firestore Link Operations
export const addLink = async (
  userId: string,
  linkData: { title: string; url: string; icon?: string; activeFrom?: number; activeTo?: number }
) => {
  const linksRef = collection(db, "users", userId, "links");
  
  // Remove undefined fields
  const cleanData: any = { title: linkData.title, url: linkData.url };
  if (linkData.icon !== undefined && linkData.icon !== "") cleanData.icon = linkData.icon;
  if (linkData.activeFrom !== undefined) cleanData.activeFrom = linkData.activeFrom;
  if (linkData.activeTo !== undefined) cleanData.activeTo = linkData.activeTo;
  
  return await addDoc(linksRef, {
    ...cleanData,
    createdAt: serverTimestamp(),
  });
};

export const updateLink = async (
  userId: string,
  linkId: string,
  linkData: { title: string; url: string; icon?: string; activeFrom?: number; activeTo?: number }
) => {
  const linkRef = doc(db, "users", userId, "links", linkId);
  
  // Remove undefined fields
  const cleanData: any = { title: linkData.title, url: linkData.url };
  if (linkData.icon !== undefined && linkData.icon !== "") cleanData.icon = linkData.icon;
  if (linkData.activeFrom !== undefined) cleanData.activeFrom = linkData.activeFrom;
  if (linkData.activeTo !== undefined) cleanData.activeTo = linkData.activeTo;
  
  return await updateDoc(linkRef, cleanData);
};

export const deleteLink = async (userId: string, linkId: string) => {
  const linkRef = doc(db, "users", userId, "links", linkId);
  return await deleteDoc(linkRef);
};

export const subscribeToLinks = (
  userId: string,
  callback: (links: Link[]) => void
): Unsubscribe => {
  const linksRef = collection(db, "users", userId, "links");
  const q = query(linksRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const links: Link[] = [];
    snapshot.forEach((doc) => {
      links.push({ id: doc.id, ...doc.data() } as Link);
    });
    callback(links);
  });
};

// Public Profile Types
export interface UserProfile {
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
}

// Public Profile Operations
export const getUserByUsername = async (
  username: string
): Promise<{ userId: string; profile: UserProfile } | null> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("username", "==", username));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const userDoc = snapshot.docs[0];
  return {
    userId: userDoc.id,
    profile: userDoc.data() as UserProfile,
  };
};

export const getPublicLinks = async (userId: string): Promise<Link[]> => {
  const linksRef = collection(db, "users", userId, "links");
  const q = query(linksRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  const links: Link[] = [];
  snapshot.forEach((doc) => {
    links.push({ id: doc.id, ...doc.data() } as Link);
  });

  return links;
};

// Helper function to check if a link is currently active
export const isLinkActive = (link: Link, now: Date = new Date()): boolean => {
  if (link.activeFrom === undefined || link.activeTo === undefined) {
    return true;
  }

  const currentHour = now.getHours();
  const from = link.activeFrom;
  const to = link.activeTo;

  if (from === to) {
    return true;
  }

  if (from < to) {
    return currentHour >= from && currentHour < to;
  } else {
    return currentHour >= from || currentHour < to;
  }
};
