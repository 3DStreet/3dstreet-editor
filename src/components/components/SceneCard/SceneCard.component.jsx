import React from 'react';
import ScenePlaceholder from '../../../../assets/scene.png';
import styles from './SceneCard.module.scss';

const SceneCard = ({ scenesData, handleSceneClick }) => (
  <div className={styles.wrapper}>
    {scenesData.map((scene, index) => (
      <div
        key={index}
        className={styles.card}
        onClick={() => handleSceneClick(scene)}
        title={scene.title}
      >
        <img src={ScenePlaceholder} alt="scene" className={styles.img} />
        <p className={styles.title}>{scene.title}</p>
        {/* <p className={styles.date}>
          Last modified 2 hours ago
        </p> */}
      </div>
    ))}
  </div>
);

export { SceneCard };
