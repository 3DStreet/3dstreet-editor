import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { SceneCard } from '../../components';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';
import { createElementsForScenesFromJSON } from '../../../lib/toolbar';
import { subscribeToUserScenes } from '../../../api/scene';

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();
  const [scenesData, setScenesData] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeToUserScenes(
        currentUser.uid,
        (updatedScenes) => {
          setScenesData(updatedScenes);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const handleSceneClick = (scene) => {
    if (scene && scene.data) {
      createElementsForScenesFromJSON(scene.data);
      window.location.hash = `#/scenes/${scene.uuid}.json`;
      onClose();
      AFRAME.scenes[0].components['notify'].message(
        'Scene loaded from 3DStreet Cloud.',
        'success'
      );
    } else {
      AFRAME.scenes[0].components['notify'].message(
        'Error trying to load 3DStreet scene from cloud. Error: Scene data is undefined or invalid.',
        'error'
      );
      console.error('Scene data is undefined or invalid.');
    }
  };

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
          <SceneCard
            scenesData={scenesData}
            handleSceneClick={handleSceneClick}
          />
        </div>
      </div>
    </Modal>
  );
};

export { ScenesModal };
