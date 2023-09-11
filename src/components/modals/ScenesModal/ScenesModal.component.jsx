import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { SceneCard, Tabs } from '../../components';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';
import { createElementsForScenesFromJSON } from '../../../lib/toolbar';
import {
  getCommunityScenes,
  getUserScenes,
  subscribeToUserScenes
} from '../../../api/scene';

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();
  const [scenesData, setScenesData] = useState([]);

  const tabs = [
    {
      label: 'My Scenes',
      value: 'owner'
    },
    {
      label: 'Community Scenes',
      value: 'community'
    }
  ];

  const [selectedTab, setSelectedTab] = useState('owner');
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

  useEffect(() => {
    async function fetchScenes() {
      if (selectedTab === 'owner' && currentUser) {
        const userScenes = await getUserScenes(currentUser.uid);
        userScenes.sort((a, b) => b.updateTimestamp - a.updateTimestamp);

        setScenesData(userScenes);
      } else if (selectedTab === 'community') {
        const communityScenes = await getCommunityScenes();
        communityScenes.sort((a, b) => b.updateTimestamp - a.updateTimestamp);

        setScenesData(communityScenes);
      }
    }
    fetchScenes();
  }, [selectedTab, currentUser]);

  const handleSceneClick = (scene) => {
    if (scene && scene.data) {
      createElementsForScenesFromJSON(scene.data);
      const sceneId = scene.id;
      window.location.hash = `#/scenes/${sceneId}.json`;
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
        <Tabs
          tabs={tabs.map((tab) => {
            return {
              ...tab,
              isSelected: selectedTab === tab.value,
              onClick: () => setSelectedTab(tab.value)
            };
          })}
          selectedTabClassName={'selectedTab'}
          className={styles.tabs}
        />
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
