import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { Button, SceneCard, Tabs } from '../../components';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';
import {
  createElementsForScenesFromJSON,
  fileJSON,
  inputStreetmix
} from '../../../lib/toolbar';
import { getCommunityScenes, getUserScenes } from '../../../api/scene';
import Events from '../../../lib/Events';
import { Load24Icon, Upload24Icon } from '../../../icons';

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
      // this is where we should update sceneid and scenetitle in metadata and toolbar state
      const sceneId = scene.id;
      const sceneTitle = scene.data().title;
      AFRAME.scenes[0].setAttribute('metadata', 'sceneId', sceneId);
      AFRAME.scenes[0].setAttribute('metadata', 'sceneTitle', sceneTitle);
      // also should update
      Events.emit('entitycreate', { element: 'a-entity', components: {} });
      AFRAME.scenes[0].components['notify'].message(
        'Scene loaded from 3DStreet Cloud.',
        'success'
      );
      onClose();
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
          <div className={styles.header}>
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
            <div className={styles.buttons}>
              <Button onClick={inputStreetmix} leadingicon={<Load24Icon />}>
                Load from Streetmix
              </Button>

              <Button
                leadingicon={<Upload24Icon />}
                className={styles.uploadBtn}
              >
                <label
                  style={{
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="file"
                    onChange={fileJSON}
                    style={{ display: 'none' }}
                    accept=".js, .json, .txt"
                  />
                  Upload 3DStreet JSON File
                </label>
              </Button>
            </div>
          </div>
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
