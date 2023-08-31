import React from 'react';
import Scene from '../../../../assets/scene.svg';
import styles from './SceneCard.module.scss';

const SceneCard = ({ scenesData, handleSceneClick }) => (
  <div className={styles.wrapper}>
    {scenesData.map((scene, index) => (
      <div
        key={index}
        className={styles.card}
        onClick={() => handleSceneClick(scene)}
      >
        <img src={Scene} alt="scene" className={styles.img} />
        <p style={{ fontSize: '16px' }} className={styles.title}>
          {scene.title}
        </p>
      </div>
    ))}
  </div>
);

export { SceneCard };
