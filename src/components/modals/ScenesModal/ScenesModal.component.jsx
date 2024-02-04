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
import { loginHandler } from '../SignInModal';
import { Load24Icon, Loader, Upload24Icon } from '../../../icons';

const SCENES_PER_PAGE = 20;
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

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();

  const [scenesData, setScenesData] = useState([]);
  const [scenesDataCommunity, setScenesDataCommunity] = useState([]);
  const [totalDisplayedUserScenes, setTotalDisplayedUserScenes] =
    useState(SCENES_PER_PAGE);
  const [totalDisplayedCommunityScenes, setTotalDisplayedCommunityScenes] =
    useState(SCENES_PER_PAGE);
  const [isLoadingScenes, setIsLoadingScenes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('owner');

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

  useEffect(() => {
    const fetchData = async () => {
      console.log({ scenesData, scenesDataCommunity });
      if (isOpen) {
        let collections;
        setIsLoadingScenes(true);

        try {
          if (
            selectedTab === 'owner' &&
            !scenesData.length &&
            currentUser?.uid
          ) {
            collections = await getUserScenes(currentUser.uid, true);
            setScenesData(collections);
          }

          if (selectedTab === 'community' && !scenesDataCommunity.length) {
            collections = await getCommunityScenes(true);
            setScenesDataCommunity(collections);
          }
        } catch (error) {
          AFRAME.scenes[0].components['notify'].message(
            `Error fetching scenes: ${error}`,
            'error'
          );
        } finally {
          setIsLoadingScenes(false);
        }
      }

      if (!isOpen) {
        setScenesData([]);
        setScenesDataCommunity([]);
      }
    };

    fetchData();
  }, [isOpen, currentUser, selectedTab]);

  const fetchUserScenes = async () => {
    return await getUserScenes(currentUser?.uid);
  };

  const fetchCommunityScenes = async () => {
    return await getCommunityScenes();
  };

  const loadData = async (end) => {
    setIsLoading(true);

    if (selectedTab === 'owner') {
      const userScenes = await fetchUserScenes();

      setScenesData([...scenesData, ...userScenes]);
      setTotalDisplayedUserScenes(end);
    } else if (selectedTab === 'community') {
      const communityScenes = await fetchCommunityScenes();

      setScenesDataCommunity([...scenesDataCommunity, ...communityScenes]);
      setTotalDisplayedCommunityScenes(end);
    }

    setIsLoading(false);
  };

  const loadMoreScenes = () => {
    if (selectedTab === 'owner') {
      const start = totalDisplayedUserScenes;
      const end = start + SCENES_PER_PAGE;

      loadData(end);
    } else if (selectedTab === 'community') {
      const start = totalDisplayedCommunityScenes;
      const end = start + SCENES_PER_PAGE;

      loadData(end);
    }
  };

  return (
    <Modal
      className={styles.modalWrapper}
      isOpen={isOpen}
      onClose={onClose}
      extraCloseKeyCode={72}
      currentUser={currentUser}
      selectedTab={selectedTab}
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
              className={styles.tabs}
            />
            <div className={styles.buttons}>
              <Button
                onClick={() => {
                  inputStreetmix();
                  onClose(); // Close the modal
                }}
                leadingicon={<Load24Icon />}
              >
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
                    onChange={(e) => {
                      fileJSON(e);
                      onClose(); // Close the modal
                    }}
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
        {isLoadingScenes ? (
          <div className={styles.loadingSpinner}>
            <Loader className={styles.spinner} />
          </div>
        ) : currentUser || selectedTab !== 'owner' ? (
          <SceneCard
            scenesData={
              selectedTab === 'owner' ? scenesData : scenesDataCommunity
            }
            setScenesData={setScenesData}
            isCommunityTabSelected={selectedTab === 'community'}
            handleSceneClick={handleSceneClick}
          />
        ) : (
          <div className={styles.signInFirst}>
            <div className={styles.title}>
              To view your scenes you have to sign in:
            </div>
            <div className={styles.buttons}>
              <Button onClick={() => loginHandler()}>
                Sign in to 3DStreet Cloud
              </Button>
              <Button
                variant="outlined"
                onClick={() => setSelectedTab('community')}
              >
                View Community Scenes
              </Button>
            </div>
          </div>
        )}
        {!isLoadingScenes && isLoading ? (
          <div className={styles.loadingSpinner}>
            <Loader className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.loadMore}>
            {selectedTab === 'owner' &&
              totalDisplayedUserScenes <= scenesData?.length && (
                <Button className={styles.button} onClick={loadMoreScenes}>
                  Load More
                </Button>
              )}
            {selectedTab === 'community' &&
              totalDisplayedCommunityScenes <= scenesDataCommunity?.length && (
                <Button className={styles.button} onClick={loadMoreScenes}>
                  Load More
                </Button>
              )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export { ScenesModal };
