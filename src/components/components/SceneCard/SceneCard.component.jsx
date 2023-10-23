import React, { useState } from 'react';
import ScenePlaceholder from '../../../../assets/scene.png';
import styles from './SceneCard.module.scss';
import { formatDistanceToNow } from 'date-fns';
import { DropdownIcon } from '../../../icons';
import { deleteScene, updateSceneIdAndTitle } from '../../../api/scene';
import { Button } from '../Button';

function LastModified({ timestamp }) {
  // Convert Firestore Timestamp to JavaScript Date object
  const date = timestamp.toDate();

  // Use date-fns to get "time ago" format
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return <p className={styles.date}>Last modified {timeAgo}</p>;
}

const SceneCard = ({ scenesData, handleSceneClick, setScenesData }) => {
  const [showMenu, setShowMenu] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [title, setTitle] = useState('');

  const toggleMenu = (index) => {
    if (showMenu === index) {
      setShowMenu(null);
    } else {
      setShowMenu(index);
    }
    setEditIndex(null);
  };

  const handleDeleteScene = (scene, e) => {
    e.stopPropagation();
    deleteScene(scene.id);
    const updatedScenesData = scenesData.filter((item) => item.id !== scene.id);
    setScenesData(updatedScenesData);
    setShowMenu(null);
  };

  const handleEditScene = (index) => {
    setEditIndex(index);
    setTitle(scenesData[index].data().title);
    setShowMenu(null);
  };

  const handleSaveClick = async () => {
    try {
      const scene = scenesData[editIndex];
      await updateSceneIdAndTitle(scene.id, title);
      AFRAME.scenes[0].setAttribute('metadata', 'sceneTitle', title);
      AFRAME.scenes[0].setAttribute('metadata', 'sceneId', scene.id);
      setEditIndex(null);
    } catch (error) {
      console.error('Error with update title', error);
    }
  };

  const handleCancelClick = () => {
    if (
      scenesData[editIndex] &&
      scenesData[editIndex].data().title !== undefined
    ) {
      setTitle(scenesData[editIndex].data().title);
    }
    setEditIndex(null);
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveClick();
    } else if (event.key === 'Escape') {
      handleCancelClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      {scenesData?.map((scene, index) => (
        <div key={index} className={styles.card} title={scene.data().title}>
          <div
            className={styles.img}
            onClick={() => handleSceneClick(scene)}
            style={{
              backgroundImage: `url(${ScenePlaceholder})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {showMenu === index && (
            <div className={styles.menuBlock}>
              <div
                className={styles.menuItem}
                onClick={() => handleEditScene(index)}
              >
                Edit scene name
              </div>
              <div
                className={styles.menuItem}
                onClick={(e) => handleDeleteScene(scene, e)}
              >
                Delete scene
              </div>
            </div>
          )}
          <div>
            {editIndex === index ? (
              <input
                type="text"
                defaultValue={scene.data().title}
                className={styles.editInput}
                onChange={handleChange}
                value={title}
                onKeyDown={handleKeyDown}
              />
            ) : (
              <p className={styles.title}>{scene.data().title}</p>
            )}
          </div>
          {editIndex !== index ? (
            <>
              <div className={styles.userBlock}>
                <div className={styles.userName}>
                  <img src={'../../../../assets/avatar.svg'} alt="avatar" />
                  <p>User Name</p>
                </div>
                <div onClick={() => toggleMenu(index)}>
                  <DropdownIcon />
                </div>
              </div>
              <p className={styles.date}>
                <LastModified timestamp={scene.data().updateTimestamp} />
              </p>
            </>
          ) : (
            <div className={styles.editButtons}>
              <Button
                variant="toolbtn"
                className={styles.editButton}
                onClick={handleSaveClick}
                disabled={title === scene.data().title}
              >
                Save changes
              </Button>
              <Button
                variant="toolbtn"
                className={styles.editButton}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export { SceneCard };
