import React from 'react';
import ScenePlaceholder from '../../../../assets/scene.png';
import styles from './SceneCard.module.scss';
import { formatDistanceToNow } from 'date-fns';

function LastModified({ timestamp }) {
  // Convert Firestore Timestamp to JavaScript Date object
  const date = timestamp.toDate();

  // Use date-fns to get "time ago" format
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return <p className={styles.date}>Last modified {timeAgo}</p>;
}

const SceneCard = ({ scenesData, handleSceneClick, isLoading }) => {
  return (
    <div className={styles.wrapper}>
      {scenesData.map((scene, index) => {
        const sceneAvailable = scene.data() && scene.data().data !== null;
        console.log('isLoading:', isLoading);
        console.log('sceneAvailable:', sceneAvailable);
        return (
          <div
            key={index}
            className={styles.card}
            onClick={() => handleSceneClick(scene)}
            title={scene.data().title}
          >
            <div
              className={styles.img}
              style={{
                backgroundImage: `url(${
                  isLoading || !sceneAvailable
                    ? '/assets/static-scene.svg'
                    : ScenePlaceholder
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: isLoading || !sceneAvailable ? '126px' : '',
                height: isLoading || !sceneAvailable ? '26px' : '',
                margin: isLoading || !sceneAvailable ? '90px auto' : ''
              }}
            ></div>

            <p className={styles.title}>{scene.data().title}</p>
            <p className={styles.date}>
              <LastModified timestamp={scene.data().updateTimestamp} />
            </p>
          </div>
        );
      })}
    </div>
  );
};

export { SceneCard };
