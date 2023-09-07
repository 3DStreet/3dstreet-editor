import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';

const generateSceneId = async () => {
  const userScenesRef = collection(db, 'scenes');

  const newSceneDocRef = await addDoc(userScenesRef, {
    createTimestamp: serverTimestamp(),
    updateTimestamp: serverTimestamp()
  });

  return newSceneDocRef.id;
};

const uploadScene = async (sceneId, userUID, sceneData, title, version) => {
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
    } else {
      await setDoc(sceneDocRef, {
        data: sceneData,
        author: userUID,
        title: title,
        version: version,
        createTimestamp: serverTimestamp(),
        updateTimestamp: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('error', error);
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

export { uploadScene, getUserScenes, subscribeToUserScenes, generateSceneId };
