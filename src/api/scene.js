import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from '../services/firebase';

const uploadScene = async (
  sceneId,
  userUID,
  sceneData,
  uuid,
  title,
  version
) => {
  try {
    const userScenesRef = collection(db, 'scenes');
    const sceneDocRef = doc(userScenesRef, sceneId);
    const sceneSnapshot = await getDoc(sceneDocRef);
    if (sceneSnapshot.exists()) {
      await updateDoc(sceneDocRef, {
        data: sceneData,
        updateTimestamp: serverTimestamp(),
        title: title,
        version: version
      });
    } else {
      await setDoc(sceneDocRef, {
        data: sceneData,
        uuid: uuid,
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
    const scenesData = querySnapshot.docs.map((doc) => doc.data());
    onUpdate(scenesData);
  });

  return unsubscribe;
};

export { uploadScene, getUserScenes, subscribeToUserScenes };
