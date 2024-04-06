import React, { useState, useEffect } from 'react';
import styles from './AddLayerPanel.module.scss';
import classNames from 'classnames';
import { Button } from '../Button';
import { Chevron24Down, Load24Icon, Plus20Circle } from '../../../icons';
import { Dropdown } from '../Dropdown';
import CardPlaceholder from '../../../../assets/card-placeholder.svg';
import { cardsData } from './cardsData';
import {
  createSvgExtrudedEntity,
  createMapbox,
  createStreetmixStreet,
  create3DTiles
} from './createLayerFunctions';

const AddLayerPanel = ({ onClose, isAddLayerPanelOpen }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [groupedMixins, setGroupedMixins] = useState([]);

  useEffect(() => {
    // call getGroupedMixinOptions once time for getting mixinGroups
    const data = getGroupedMixinOptions();
    setGroupedMixins(data);
  }, []);

  // get all mixin data divided into groups, from a-mixin DOM elements
  const getGroupedMixinOptions = () => {
    const mixinElements = document.querySelectorAll('a-mixin');
    const groupedArray = [];
    let categoryName, mixinId;

    const groupedObject = {};
    let ind = 0;
    for (let mixinEl of Array.from(mixinElements)) {
      categoryName = mixinEl.getAttribute('category');
      if (!categoryName) continue;
      mixinId = mixinEl.id;
      if (!groupedObject[categoryName]) {
        groupedObject[categoryName] = [];
      }
      groupedObject[categoryName].push({
        // here could be data from dataCards JSON file
        img: '',
        icon: '',
        mixinId: mixinId,
        name: mixinId,
        id: ind
      });
      ind += 1;
    }

    for (let categoryName of Object.keys(groupedObject)) {
      groupedArray.push({
        label: categoryName,
        options: groupedObject[categoryName]
      });
    }
    return groupedArray;
  };

  const options = [
    {
      value: 'Layers: Streets & Intersections',
      label: 'Layers: Streets & Intersections',
      onClick: () => console.log('Layers: Streets & Intersections')
    },
    {
      value: 'Models: Personal Vehicles',
      label: 'Models: Personal Vehicles',
      mixinGroups: ['vehicles', 'vehicles-rigged'],
      onClick: () => console.log('Models: Personal Vehicles')
    },
    {
      value: 'Models: Transit Vehicles',
      label: 'Models: Transit Vehicles',
      mixinGroups: ['vehicles-transit'],
      onClick: () => console.log('Models: Transit Vehicles')
    },
    {
      value: 'Models: Utility Vehicles',
      label: 'Models: Utility Vehicles',
      mixinGroups: ['vehicles-rigged'],
      onClick: () => console.log('Models: Utility Vehicles')
    },
    {
      value: 'Models: Characters',
      label: 'Models: Characters',
      mixinGroups: ['people', 'people-rigged'],
      onClick: () => console.log('Models: Characters')
    },
    {
      value: 'Models: Street Props',
      label: 'Models: Street Props',
      mixinGroups: ['sidewalk-props', 'intersection-props'],
      onClick: () => console.log('Models: Street Props')
    },
    {
      value: 'Models: dividers',
      label: 'Models: dividers',
      mixinGroups: ['dividers'],
      onClick: () => console.log('Models: dividers')
    },
    {
      value: 'Models: Buildings',
      label: 'Models: Buildings',
      mixinGroups: ['buildings'],
      onClick: () => console.log('Models: Buildings')
    },
    {
      value: 'Models: stencils',
      label: 'Models: stencils',
      mixinGroups: ['stencils'],
      onClick: () => console.log('Models: stencils')
    }
  ];

  // data for layers cards
  const layersData = [
    {
      name: 'Mapbox',
      img: '',
      icon: '',
      description:
        'Create entity with mapbox component, that accepts a long / lat and renders a plane with dimensions that (should be) at a correct scale.',
      id: 1,
      handlerFunction: createMapbox
    },
    {
      name: 'Street from streetmixStreet',
      img: '',
      icon: '',
      description:
        'Create an additional Streetmix street in your 3DStreet scene without replacing any existing streets.',
      id: 2,
      handlerFunction: createStreetmixStreet
    },
    {
      name: 'Entity from extruded SVG',
      img: '',
      icon: '',
      description:
        'Create entity with svg-extruder component, that accepts a svgString and creates a new entity with geometry extruded from the svg and applies the default mixin material grass.',
      id: 3,
      handlerFunction: createSvgExtrudedEntity
    },
    {
      name: '3D Tiles',
      img: '',
      icon: '',
      description:
        'Adds an entity to load and display 3d tiles from Google Maps Tiles API 3D Tiles endpoint. This will break your scene and you cannot save it yet, so beware before testing.',
      id: 4,
      handlerFunction: create3DTiles
    }
  ];

  // get array with objects data (cardsData) from mixinGroups of selectedOption
  const getSelectedMixinCards = (selectedOption) => {
    if (!selectedOption) return [];
    const selectedOptionData = options.find(
      (option) => option.value === selectedOption
    );
    const selectedMixinGroupNames = selectedOptionData.mixinGroups;

    // there are no mixin groups
    if (!selectedMixinGroupNames) return [];

    // filter selected mixin groups from all mixin groups (groupedMixins)
    const cardsData = groupedMixins
      .filter((group) => selectedMixinGroupNames.includes(group.label))
      .flatMap((mixinGroup) => mixinGroup.options);

    return cardsData;
  };

  let selectedCards;
  if (selectedOption == 'Layers: Streets & Intersections') {
    selectedCards = layersData;
  } else {
    selectedCards = getSelectedMixinCards(selectedOption);
  }

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  /* create and preview entity events */

  // entity preview element
  let preEntity = document.createElement('a-entity');
  let cameraFrontVec = new THREE.Vector3();

  preEntity.setAttribute('visible', false);
  // rotate and scale for better view
  preEntity.setAttribute('rotation', { y: 90 });

  AFRAME.scenes[0].appendChild(preEntity);

  const previewEntity = () => {
    if (selectedOption == 'Models: Buildings') {
      preEntity.setAttribute('scale', { x: 0.1, y: 0.1, z: 0.1 });
    } else {
      preEntity.setAttribute('scale', { x: 0.5, y: 0.5, z: 0.5 });
    }
    /* place object in front of active camera */
    const direction = new THREE.Vector3();
    // active camera object
    const activeCamera = AFRAME.INSPECTOR.camera;
    activeCamera.getWorldDirection(direction);
    cameraFrontVec.copy(activeCamera.position);
    cameraFrontVec.add(direction.multiplyScalar(5));

    // place preview entity in front of camera in 5 meters
    preEntity.setAttribute('position', cameraFrontVec);
  };

  const cardMouseEnter = (mixinId) => {
    console.log('mouse enter: ', mixinId);
    preEntity.setAttribute('visible', true);
    preEntity.setAttribute('mixin', mixinId);
    previewEntity();
  };

  const cardMouseLeave = (mixinId) => {
    console.log('mouse leave: ', mixinId);
    preEntity.setAttribute('visible', false);
  };

  const createEntity = (mixinId, parentEl) => {
    console.log('create entity: ', mixinId);
    const newEntity = document.createElement('a-entity');
    newEntity.setAttribute('mixin', mixinId);
    // apppend element in street-container for now. Then it could be a choosed segment for example
    const streetContainer = document.querySelector('#default-street');
    if (streetContainer) {
      streetContainer.appendChild(newEntity);
    } else {
      AFRAME.scenes[0].appendChild(newEntity);
    }
  };

  const cardClick = (card) => {
    if (card.mixinId) {
      createEntity(card.mixinId);
    } else if (card.handlerFunction) {
      card.handlerFunction();
    }
  };
  return (
    <div
      className={classNames(styles.panel, isAddLayerPanelOpen && styles.open)}
    >
      <Button onClick={onClose} variant="custom" className={styles.closeButton}>
        <Chevron24Down />
      </Button>
      <div className={styles.header}>
        <div className={styles.button}>
          <Plus20Circle />
          <p className={styles.buttonLabel}>Add New Entity</p>
        </div>
        <Dropdown
          placeholder="Layers: Maps & Reference"
          options={options}
          onSelect={handleSelect}
          selectedOptionValue={selectedOption}
          className={styles.dropdown}
          smallDropdown={true}
        />
      </div>
      <div className={styles.cards}>
        {selectedCards?.map((card, idx) => (
          <div
            key={Number(card.id + idx)}
            className={styles.card}
            onMouseEnter={() => card.mixinId && cardMouseEnter(card.mixinId)}
            onMouseLeave={() => card.mixinId && cardMouseLeave(card.mixinId)}
            onClick={() => cardClick(card)}
            title={card.description}
          >
            <div
              className={styles.img}
              style={{
                backgroundImage: `url(${card.img || CardPlaceholder})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className={styles.body}>
              {card.icon ? <img src={card.icon} /> : <Load24Icon />}
              <p className={styles.description}>{card.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { AddLayerPanel };
