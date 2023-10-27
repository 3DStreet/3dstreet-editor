import React, { useEffect, useState } from 'react';
import styles from './SceneEditTitle.module.scss';
import { CheckMark32Icon, Cross32Icon, Edit32Icon } from '../../../icons';
import { updateSceneIdAndTitle } from '../../../api/scene';

const SceneEditTitle = ({ sceneData }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(sceneData?.sceneTitle);

  const sceneId = STREET.utils.getCurrentSceneId();

  useEffect(() => {
    if (sceneData.sceneId === sceneId) {
      setTitle(sceneData.sceneTitle);
    }
  }, [sceneData?.sceneTitle, sceneData?.sceneId, sceneId]);

  const handleEditClick = () => {
    const newTitle = prompt('Edit the title:', title);

    if (newTitle !== null) {
      if (newTitle !== title) {
        setTitle(newTitle);
        handleSaveClick(newTitle);
      }
    }
  };

  const handleSaveClick = async (newTitle) => {
    setEditMode(false);
    try {
      await updateSceneIdAndTitle(sceneData?.sceneId, newTitle);

      AFRAME.scenes[0].setAttribute('metadata', 'sceneTitle', newTitle);
      AFRAME.scenes[0].setAttribute('metadata', 'sceneId', sceneData?.sceneId);
    } catch (error) {
      console.error('Error with update title', error);
    }
  };

  const handleCancelClick = () => {
    if (sceneData && sceneData.sceneTitle !== undefined) {
      setTitle(sceneData.sceneTitle);
    }
    setEditMode(false);
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
      {editMode ? (
        <div className={styles.edit}>
          <input
            className={styles.title}
            value={title}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.buttons}>
            <div
              onClick={() => handleSaveClick(title)}
              className={styles.check}
            >
              <CheckMark32Icon />
            </div>
            <div onClick={handleCancelClick} className={styles.cross}>
              <Cross32Icon />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.readOnly}>
          <p className={styles.title}>{title}</p>
          {!editMode && (
            <div className={styles.editButton} onClick={handleEditClick}>
              <Edit32Icon />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { SceneEditTitle };
