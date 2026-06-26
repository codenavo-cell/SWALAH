import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';

// Hardcoded default fallback from the provisioned firebase-applet-config.json
const firebaseConfig = {
  // @ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAbAmD9UHpL0nkht1Zj5OPhI0V748NFo9w",
  // @ts-ignore
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0286098172.firebaseapp.com",
  // @ts-ignore
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0286098172",
  // @ts-ignore
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0286098172.firebasestorage.app",
  // @ts-ignore
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "617403429783",
  // @ts-ignore
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:617403429783:web:dfb71b57e9cdec2115cad2"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
// Use the specific firestoreDatabaseId from the config if available
export const db = getFirestore(app, "ai-studio-remixswalahunion-3aa332ae-9890-4ecd-bf83-a323b888b1f0");
export const auth = getAuth(app);

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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Generic Firebase helper functions for the Swalah Union database.
 */

// Helper to save a single document
export async function saveToFirebase(collectionName: string, docId: string, data: any) {
  try {
    const cleanData = JSON.parse(JSON.stringify(data)); // strip any undefined properties
    await setDoc(doc(db, collectionName, docId), cleanData);
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
  }
}

// Helper to delete a single document
export async function deleteFromFirebase(collectionName: string, docId: string) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true };
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
  }
}

// Helper to fetch all documents in a collection
export async function fetchCollection(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items: any[] = [];
    querySnapshot.forEach((doc) => {
      items.push({ ...doc.data() });
    });
    return { success: true, data: items };
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

// Bulk Sync Helper: Push an entire local array to Firebase
export async function bulkSyncToFirebase(collectionName: string, items: any[], idKey: string = 'id') {
  try {
    const batch = writeBatch(db);
    
    // Process in batches (Firestore allows max 500 operations per batch)
    const batchLimit = 400;
    let count = 0;
    
    for (const item of items) {
      const id = String(item[idKey] || item.id || item.admissionNumber || item.title);
      if (!id) continue;
      
      const cleanData = JSON.parse(JSON.stringify(item));
      const docRef = doc(db, collectionName, id);
      batch.set(docRef, cleanData);
      count++;
      
      if (count >= batchLimit) {
        await batch.commit();
        count = 0;
      }
    }
    
    if (count > 0) {
      await batch.commit();
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in bulkSyncToFirebase for ${collectionName}:`, error);
    return { success: false, error };
  }
}

// Sync all database collections to Firebase
export async function pushAllDataToFirebase(allData: {
  students: any[];
  teams: any[];
  programs: any[];
  notices: any[];
  gallery: any[];
  transactions: any[];
  attendance: any[];
  resources: any[];
  ideas: any[];
  memories: any[];
  winners: any[];
  calendarEvents: any[];
  committee: any[];
}) {
  try {
    const results = await Promise.all([
      bulkSyncToFirebase('students', allData.students, 'admissionNumber'),
      bulkSyncToFirebase('teams', allData.teams, 'id'),
      bulkSyncToFirebase('programs', allData.programs, 'id'),
      bulkSyncToFirebase('notices', allData.notices, 'id'),
      bulkSyncToFirebase('gallery', allData.gallery, 'id'),
      bulkSyncToFirebase('transactions', allData.transactions, 'id'),
      bulkSyncToFirebase('attendance', allData.attendance, 'id'),
      bulkSyncToFirebase('resources', allData.resources, 'id'),
      bulkSyncToFirebase('ideas', allData.ideas, 'id'),
      bulkSyncToFirebase('memories', allData.memories, 'id'),
      bulkSyncToFirebase('winners', allData.winners, 'id'),
      bulkSyncToFirebase('calendarEvents', allData.calendarEvents, 'id'),
      bulkSyncToFirebase('committee', allData.committee, 'id'),
    ]);
    
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      return { success: false, error: 'Some collections failed to sync.' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error in pushAllDataToFirebase:', error);
    return { success: false, error };
  }
}

// Pull all database collections from Firebase
export async function pullAllDataFromFirebase() {
  try {
    const collectionsToFetch = [
      'students', 'teams', 'programs', 'notices', 'gallery', 
      'transactions', 'attendance', 'resources', 'ideas', 
      'memories', 'winners', 'calendarEvents', 'committee'
    ];
    
    const results = await Promise.all(collectionsToFetch.map(c => fetchCollection(c)));
    
    const data: any = {};
    collectionsToFetch.forEach((name, idx) => {
      data[name] = results[idx].data;
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in pullAllDataFromFirebase:', error);
    return { success: false, error };
  }
}
