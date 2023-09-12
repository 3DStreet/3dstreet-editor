import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { SceneCard, Tabs } from '../../components';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';
import { createElementsForScenesFromJSON } from '../../../lib/toolbar';
import { getCommunityScenes, getUserScenes } from '../../../api/scene';

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();
  const [scenesData, setScenesData] = useState([]);
  const [scenesDataCommunity, setScenesDataCommunity] = useState([]);

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
    if (!isOpen) return; // Only proceed if the modal is open

    async function fetchScenesCommunity() {
      const communityScenes = await getCommunityScenes();
      setScenesDataCommunity(communityScenes);
    }
    fetchScenesCommunity();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !currentUser) return; // Only proceed if modal open and currentUser exists

    async function fetchScenesUser() {
      const userScenes = await getUserScenes(currentUser.uid);
      setScenesData(userScenes);
    }
    fetchScenesUser();
  }, [currentUser, isOpen]);

  const handleSceneClick = (scene) => {
    if (scene.data() && scene.data().data) {
      createElementsForScenesFromJSON(scene.data().data);
      // const sceneId = scene.id;
      window.location.hash = `#/scenes/${scene.id}.json`;
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
      titleElement={
        <>
          <h3
            style={{
              fontSize: '20px',
              marginTop: '26px',
              marginBottom: '0px',
              position: 'relative'
            }}
          >
            Open scene
          </h3>
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
        </>
      }
    >
      <div className={styles.contentWrapper}>
        <div className={styles.scrollContainer}>
          <SceneCard
            scenesData={
              selectedTab === 'owner' ? scenesData : scenesDataCommunity
            }
            handleSceneClick={handleSceneClick}
          />
        </div>
      </div>
    </Modal>
  );
};

export { ScenesModal };
