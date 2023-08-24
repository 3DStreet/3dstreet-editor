import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where
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
    await setDoc(doc(userScenesRef, sceneId), {
      data: sceneData,
      uuid,
      author: userUID,
      title: title,
      version: version
    });
  } catch (error) {
    console.error(error);
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

export { uploadScene, getUserScenes };
