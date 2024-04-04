import React, { useState, useEffect } from 'react';
import cardsData from './cardsData';
import styles from './AddLayerPanel.module.scss';
import classNames from 'classnames';
import { Button } from '../Button';
import { Chevron24Down, Load24Icon, Plus20Circle } from '../../../icons';
import { Dropdown } from '../Dropdown';
import CardPlaceholder from '../../../../assets/card-placeholder.svg';

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
        description: mixinId,
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

  // get array with objects data (cardsData) from mixinGroups of selectedOption
  const getSelectedMixins = (selectedOption) => {
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

  const selectedCards = getSelectedMixins(selectedOption);

  const handleSelect = (value) => {
    setSelectedOption(value);
  };

  /* create and preview entity events */

  const createEntity = (mixinId, parentEl) => {
    console.log('create entity: ', mixinId);
    const newEntity = document.createElement('a-entity');
    newEntity.setAttribute('mixin', mixinId);
    // apppend element in street-container for now. Then it could be a choosed segment for example
    const streetContainer = document.querySelector('street-container');
    if (streetContainer) {
      streetContainer.appendChild(newEntity);
    } else {
      AFRAME.scenes[0].appendChild(newEntity);
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
            onClick={() =>
              card.mixinId &&
              createEntity(card.mixinId) &&
              console.log((card.mixinId, `card click ${card.id}`))
            }
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
              <p className={styles.description}>{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { AddLayerPanel };
