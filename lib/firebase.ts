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
  setDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  type Unsubscribe,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Only initialize Firebase if we have a valid API key
const hasValidConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: ReturnType<typeof initializeApp> | null = null;

if (hasValidConfig) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export const auth = hasValidConfig && app ? getAuth(app) : null;
export const db = hasValidConfig && app ? getFirestore(app) : null;
export const googleProvider = new GoogleAuthProvider();

export const signUp = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase not initialized');
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase not initialized');
  return signInWithEmailAndPassword(auth, email, password);
};

export const signOut = (): Promise<void> => {
  if (!auth) throw new Error('Firebase not initialized');
  return firebaseSignOut(auth);
};

export const signInWithGoogle = (): Promise<UserCredential> => {
  if (!auth) throw new Error('Firebase not initialized');
  return signInWithPopup(auth, googleProvider);
};

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
  if (!db) throw new Error('Firebase not initialized');
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
  if (!db) throw new Error('Firebase not initialized');
  const linkRef = doc(db, "users", userId, "links", linkId);
  
  // Remove undefined fields
  const cleanData: any = { title: linkData.title, url: linkData.url };
  if (linkData.icon !== undefined && linkData.icon !== "") cleanData.icon = linkData.icon;
  if (linkData.activeFrom !== undefined) cleanData.activeFrom = linkData.activeFrom;
  if (linkData.activeTo !== undefined) cleanData.activeTo = linkData.activeTo;
  
  return await updateDoc(linkRef, cleanData);
};

export const deleteLink = async (userId: string, linkId: string) => {
  if (!db) throw new Error('Firebase not initialized');
  const linkRef = doc(db, "users", userId, "links", linkId);
  return await deleteDoc(linkRef);
};

export const subscribeToLinks = (
  userId: string,
  callback: (links: Link[]) => void
): Unsubscribe => {
  if (!db) {
    console.warn('Firebase not initialized');
    return () => {};
  }
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

// Appearance Types
export interface AppearanceSettings {
  themeColor: 'indigo' | 'pink' | 'green' | 'orange' | 'slate';
  buttonStyle: 'rounded' | 'pill' | 'square';
  profileIcon?: string;
}

// Public Profile Types
export interface UserProfile {
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  appearance?: AppearanceSettings;
}

// Update Appearance Settings
export const updateAppearance = async (
  userId: string,
  appearance: AppearanceSettings
) => {
  if (!db) throw new Error('Firebase not initialized');
  const userRef = doc(db, "users", userId);
  return await setDoc(userRef, { appearance }, { merge: true });
};

// Public Profile Operations
export const getUserByUsername = async (
  username: string
): Promise<{ userId: string; profile: UserProfile } | null> => {
  if (!db) {
    console.warn('Firebase not initialized');
    return null;
  }
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
  if (!db) {
    console.warn('Firebase not initialized');
    return [];
  }
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

// Analytics Types
export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  viewHistory: { date: string; count: number }[];
  clickHistory: { date: string; count: number }[];
}

// Track profile view
export const trackProfileView = async (userId: string) => {
  if (!db) {
    console.warn('Firebase not initialized');
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = doc(db, "users", userId, "analytics", "stats");
  
  try {
    const analyticsDoc = await getDoc(analyticsRef);
    if (analyticsDoc.exists()) {
      const data = analyticsDoc.data();
      const viewHistory = data.viewHistory || [];
      const todayIndex = viewHistory.findIndex((v: any) => v.date === today);
      
      if (todayIndex >= 0) {
        viewHistory[todayIndex].count += 1;
      } else {
        viewHistory.push({ date: today, count: 1 });
      }
      
      await setDoc(analyticsRef, {
        totalViews: (data.totalViews || 0) + 1,
        viewHistory: viewHistory.slice(-30), // Keep last 30 days
      }, { merge: true });
    } else {
      await setDoc(analyticsRef, {
        totalViews: 1,
        totalClicks: 0,
        viewHistory: [{ date: today, count: 1 }],
        clickHistory: [],
      });
    }
  } catch (error) {
    console.error("Error tracking view:", error);
  }
};

// Track link click
export const trackLinkClick = async (userId: string, linkId: string) => {
  if (!db) {
    console.warn('Firebase not initialized');
    return;
  }
  const today = new Date().toISOString().split('T')[0];
  const analyticsRef = doc(db, "users", userId, "analytics", "stats");
  
  try {
    const analyticsDoc = await getDoc(analyticsRef);
    if (analyticsDoc.exists()) {
      const data = analyticsDoc.data();
      const clickHistory = data.clickHistory || [];
      const todayIndex = clickHistory.findIndex((c: any) => c.date === today);
      
      if (todayIndex >= 0) {
        clickHistory[todayIndex].count += 1;
      } else {
        clickHistory.push({ date: today, count: 1 });
      }
      
      await setDoc(analyticsRef, {
        totalClicks: (data.totalClicks || 0) + 1,
        clickHistory: clickHistory.slice(-30),
      }, { merge: true });
    } else {
      await setDoc(analyticsRef, {
        totalViews: 0,
        totalClicks: 1,
        viewHistory: [],
        clickHistory: [{ date: today, count: 1 }],
      });
    }
  } catch (error) {
    console.error("Error tracking click:", error);
  }
};

// Get analytics data
export const getAnalytics = async (userId: string): Promise<AnalyticsData | null> => {
  if (!db) {
    console.warn('Firebase not initialized');
    return null;
  }
  const analyticsRef = doc(db, "users", userId, "analytics", "stats");
  
  try {
    const analyticsDoc = await getDoc(analyticsRef);
    if (analyticsDoc.exists()) {
      return analyticsDoc.data() as AnalyticsData;
    }
    return {
      totalViews: 0,
      totalClicks: 0,
      viewHistory: [],
      clickHistory: [],
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return null;
  }
};

// Subscribe to analytics updates
export const subscribeToAnalytics = (
  userId: string,
  callback: (data: AnalyticsData) => void
): Unsubscribe => {
  if (!db) {
    console.warn('Firebase not initialized');
    return () => {};
  }
  const analyticsRef = doc(db, "users", userId, "analytics", "stats");
  
  return onSnapshot(analyticsRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as AnalyticsData);
    } else {
      callback({
        totalViews: 0,
        totalClicks: 0,
        viewHistory: [],
        clickHistory: [],
      });
    }
  });
};
