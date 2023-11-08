import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const SceneCard = ({
  scenesData,
  handleSceneClick,
  setScenesData,
  isCommunityTabSelected
}) => {
  const [showMenu, setShowMenu] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [editInputValue, setEditInputValue] = useState('');
  const editInputRef = useRef(null);
  const menuRefs = useRef({});

  const handleClickOutside = (event) => {
    if (
      showMenu !== null &&
      !menuRefs.current[showMenu]?.contains(event.target)
    ) {
      setShowMenu(null); // Close the dropdown if the click is outside
    }
  };

  // Effect for handling outside click
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const toggleMenu = (index, event) => {
    event.stopPropagation(); // Prevent the click from "bubbling" up to the document
    setShowMenu(showMenu === index ? null : index);
  };

  const handleDeleteScene = (scene, e) => {
    e.stopPropagation();

    // Show the system confirm dialog
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this scene?'
    );

    // Only proceed with the delete if the user pressed OK
    if (isConfirmed) {
      deleteScene(scene.id);
      const updatedScenesData = scenesData.filter(
        (item) => item.id !== scene.id
      );
      setScenesData(updatedScenesData);
      setShowMenu(null);
    }
  };

  const handleEditScene = (index) => {
    setEditIndex(index);
    setEditInputValue(scenesData[index].data().title);
    setShowMenu(null);
    // After state updates, focus and select the input content
    setTimeout(() => {
      editInputRef.current.focus();
      editInputRef.current.select();
    }, 0);
  };

  const handleSaveTitle = async () => {
    try {
      const scene = scenesData[editIndex];
      await updateSceneIdAndTitle(scene.id, editInputValue);
      setEditIndex(null);
      AFRAME.scenes[0].components['notify'].message(
        `New scene title saved, reopen modal to see changes: ${editInputValue}`,
        'success'
      );
    } catch (error) {
      console.error('Error with update title', error);
      AFRAME.scenes[0].components['notify'].message(
        `Error updating scene title: ${error}`,
        'error'
      );
    }
  };

  const handleCancelClick = () => {
    if (
      scenesData[editIndex] &&
      scenesData[editIndex].data().title !== undefined
    ) {
      setEditInputValue(scenesData[editIndex].data().title);
    }
    setEditIndex(null);
  };

  const handleChange = (event) => {
    setEditInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveTitle();
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
              backgroundImage: `url(${
                scene.data().imagePath || ScenePlaceholder
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div>
            {editIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                defaultValue={scene.data().title}
                className={styles.editInput}
                onChange={handleChange}
                value={editInputValue}
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
                  {/* Placeholder for username + thumbnail support */}
                  {/* <img src={'../../../../assets/avatar.svg'} alt="avatar" /> */}
                  {/* <p>User Name</p> */}
                  <p>
                    <LastModified timestamp={scene.data().updateTimestamp} />
                  </p>
                </div>
                {!isCommunityTabSelected && (
                  <div
                    ref={(el) => (menuRefs.current[index] = el)}
                    onClick={(e) => toggleMenu(index, e)}
                  >
                    <DropdownIcon />
                  </div>
                )}
              </div>
              {/* Placeholder to return LastModified here when username + thumbnail done */}
              {/* <p className={styles.date}>
                <LastModified timestamp={scene.data().updateTimestamp} />
              </p> */}
            </>
          ) : (
            <div className={styles.editButtons}>
              <Button
                variant="toolbtn"
                className={styles.editButton}
                onClick={handleSaveTitle}
                disabled={editInputValue === scene.data().title}
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
        </div>
      ))}
    </div>
  );
};

export { SceneCard };
