import {
  collection,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  getDoc,
  setDoc,
  updateDoc,
  orderBy
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

const isSceneAuthor = async ({ sceneId, authorId }) => {
  try {
    // Get a reference to the scene document
    const sceneRef = doc(db, 'scenes', sceneId);
    const sceneSnapshot = await getDoc(sceneRef);

    if (sceneSnapshot.exists()) {
      return sceneSnapshot.data().author === authorId;
    } else {
      console.error('Scene not found while running isSceneAuthor');
      return false;
    }
  } catch (error) {
    console.error('Error fetching scene while running isSceneAuthor:', error);
    return false;
  }
};

const getUserScenes = async (currentUserUID) => {
  const userScenesQuery = query(
    collection(db, 'scenes'),
    where('author', '==', currentUserUID),
    orderBy('updateTimestamp', 'desc')
  );

  const scenesSnapshot = await getDocs(userScenesQuery);
  //  const scenesData = scenesSnapshot.docs.map((doc) => doc.data());

  return scenesSnapshot.docs;
};

const getCommunityScenes = async () => {
  const communityScenesQuery = query(
    collection(db, 'scenes'),
    orderBy('updateTimestamp', 'desc')
  );
  try {
    const communityScenesSnapshot = await getDocs(communityScenesQuery);
    // const communityScenesData = communityScenesSnapshot.docs.map((doc) =>
    //   doc.data()
    // );
    return communityScenesSnapshot.docs;
  } catch (error) {
    console.error('Error fetching community scenes:', error);
    return [];
  }
};

export {
  updateScene,
  getUserScenes,
  generateSceneId,
  isSceneAuthor,
  getCommunityScenes
};
