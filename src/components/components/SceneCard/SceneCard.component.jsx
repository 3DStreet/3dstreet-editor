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
      >
        <img src={ScenePlaceholder} alt="scene" className={styles.img} />
        <p style={{ fontSize: '16px' }} className={styles.title}>
          {scene.title}
        </p>
      </div>
    ))}
  </div>
);

export { SceneCard };
