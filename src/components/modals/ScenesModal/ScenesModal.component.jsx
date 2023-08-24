import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts';
import { SceneCard, Input, Button } from '../../components';
import Modal from '../Modal.jsx';
import styles from './ScenesModal.module.scss';
import { getUserScenes } from '../../../api';
import { Mangnifier20Icon } from '../../../icons';

const ScenesModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuthContext();
  const [scenesData, setScenesData] = useState([]);
  const [sceneTitle, setSceneTitle] = useState('');

  const fetchScenesData = async () => {
    if (currentUser) {
      const scenesData = await getUserScenes(currentUser.uid);
      setScenesData(scenesData);
    }
  };

  useEffect(() => {
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
        <div className={styles.header}>
          <Input
            onChange={(value) => setSceneTitle(value)}
            className="input"
            placeholder="Search"
            leadingIcon={<Mangnifier20Icon />}
          />
          <div className={styles.buttons}>
            <Button className="loadBtn">Load new scene</Button>
            <Button className="createScene" variant="outlined">
              Create new scene
            </Button>
          </div>
        </div>
        <SceneCard
          scenesData={scenesData.filter(({ title }) =>
            sceneTitle === '' ? true : title.includes(sceneTitle)
          )}
        />
      </div>
    </Modal>
  );
};

export { ScenesModal };
