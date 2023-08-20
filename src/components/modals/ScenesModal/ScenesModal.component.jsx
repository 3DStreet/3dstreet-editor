import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { db } from '../../../services/firebase';
import { SceneCard } from '../../components/SceneCard/SceneCard.component.jsx';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();
  const [scenesData, setScenesData] = useState([]);

  useEffect(() => {
    const fetchScenesData = async () => {
      if (currentUser) {
        const userScenesQuery = query(
          collection(db, 'scenes'),
          where('author', '==', currentUser.uid)
        );

        const scenesSnapshot = await getDocs(userScenesQuery);
        const scenesData = scenesSnapshot.docs.map((doc) => doc.data());

        setScenesData(scenesData);
      }
    };

    fetchScenesData();
  }, [currentUser]);

  return (
    <Modal
      className={styles.modalWrapper}
      isOpen={isOpen}
      onClose={onClose}
      extraCloseKeyCode={72}
      title="Open scene"
    >
      <div className={styles.contentWrapper}>
        <div className={styles.scrollContainer}>
          <SceneCard scenesData={scenesData} />
        </div>
      </div>
    </Modal>
  );
};

export { ScenesModal };
