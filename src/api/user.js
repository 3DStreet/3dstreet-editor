import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const getScenes = () => {
  return query(collection(db, 'scenes'));
};

const userFindByUidQuery = (uid) => {
  return query(collection(db, 'author'), where('author', '==', uid));
};

const getUserByQuery = async (query) => {
  return await getDocs(query);
};

const createInitialUsersCollection = async (author) => {
  await addDoc(collection(db, 'scenes'), {
    author,
    data
  });
};

export {
  userFindByUidQuery,
  getUserByQuery,
  createInitialUsersCollection,
  getScenes
};
