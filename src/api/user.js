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
    author
  });
};

const isUserPremium = async (userId) => {
  const ordersCollection = query(
    collection(db, 'orders'),
    where('userId', '==', userId)
  );

  return !(await getDocs(ordersCollection)).empty;
};

export {
  userFindByUidQuery,
  getUserByQuery,
  createInitialUsersCollection,
  getScenes,
  isUserPremium
};
