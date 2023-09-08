import {
  collection,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { v4 as uuidv4 } from 'uuid';

const generateSceneId = async (authorId) => {
  const userScenesRef = collection(db, 'scenes');

  // Generate a new UUID
  const newSceneId = uuidv4();

  const newSceneDocRef = doc(userScenesRef, newSceneId);

  // Use setDoc to set data on the specified document
  await setDoc(newSceneDocRef, {
    createTimestamp: serverTimestamp(),
    updateTimestamp: serverTimestamp(),
    author: authorId
  });

  return newSceneId;
};

const updateScene = async (sceneId, userUID, sceneData, title, version) => {
  try {
    const userScenesRef = collection(db, 'scenes');
    const sceneDocRef = doc(userScenesRef, sceneId);

    const sceneSnapshot = await getDoc(sceneDocRef);
    if (sceneSnapshot.exists()) {
      await updateDoc(sceneDocRef, {
        data: sceneData,
        updateTimestamp: serverTimestamp(),
        title: title,
        version: version,
        author: userUID
      });
      console.log('Firebase updateDoc fired');
    } else {
      throw new Error('No existing sceneSnapshot exists.');
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getUserScenes = async (currentUserUID) => {
  const userScenesQuery = query(
    collection(db, 'scenes'),
    where('author', '==', currentUserUID)
  );

  const scenesSnapshot = await getDocs(userScenesQuery);
  const scenesData = scenesSnapshot.docs.map((doc) => doc.data());

  return scenesData;
};

const subscribeToUserScenes = (currentUserUID, onUpdate) => {
  const userScenesQuery = query(
    collection(db, 'scenes'),
    where('author', '==', currentUserUID)
  );

  const unsubscribe = onSnapshot(userScenesQuery, (querySnapshot) => {
    const scenesData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    onUpdate(scenesData);
  });

  return unsubscribe;
};

export { updateScene, getUserScenes, subscribeToUserScenes, generateSceneId };
