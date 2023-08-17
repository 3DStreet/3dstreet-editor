import { collection, doc, setDoc } from 'firebase/firestore';
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
      title,
      version
    });
  } catch (error) {
    console.error(error);
  }
};
export { uploadScene };
