import React, { useState } from 'react';
import styles from './AddLayerPanel.module.scss';
import classNames from 'classnames';
import { Button } from '../Button';
import { Chevron24Down, Load24Icon, Plus20Circle } from '../../../icons';
import { Dropdown } from '../Dropdown';
import CardPlaceholder from '../../../../assets/card-placeholder.svg';

const AddLayerPanel = ({ onClose, isAddLayerPanelOpen }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    {
      value: 'Layers: Streets & Intersections',
      label: 'Layers: Streets & Intersections',
      onClick: () => console.log('Layers: Streets & Intersections')
    },
    {
      value: 'Models: Personal Vehicles',
      label: 'Models: Personal Vehicles',
      onClick: () => console.log('Models: Personal Vehicles')
    },
    {
      value: 'Models: Transit Vehicles',
      label: 'Models: Transit Vehicles',
      onClick: () => console.log('Models: Transit Vehicles')
    },
    {
      value: 'Models: Utility Vehicles',
      label: 'Models: Utility Vehicles',
      onClick: () => console.log('Models: Utility Vehicles')
    },
    {
      value: 'Models: Characters',
      label: 'Models: Characters',
      onClick: () => console.log('Models: Characters')
    },
    {
      value: 'Models: Street Props',
      label: 'Models: Street Props',
      onClick: () => console.log('Models: Street Props')
    },
    {
      value: 'Models: Buildings',
      label: 'Models: Buildings',
      onClick: () => console.log('Models: Buildings')
    }
  ];

  const cardsData = [
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 1
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 2
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 3
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 4
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 5
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 6
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 7
    },
    {
      img: '',
      icon: '',
      description: 'Description',
      id: 8
    }
  ];

  const handleSelect = (value) => {
    setSelectedOption(value);
  };
  return (
    <div
      className={classNames(styles.panel, isAddLayerPanelOpen && styles.open)}
    >
      <Button onClick={onClose} variant="custom" className={styles.closeButton}>
        <Chevron24Down />
      </Button>
      <div className={styles.header}>
        <div
          type="button"
          tabIndex={0}
          className={styles.button}
          onClick={() => console.log('add entity')}
        >
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
        {cardsData?.map((card, idx) => (
          <div key={Number(card.id + idx)} className={styles.card}>
            <div
              className={styles.img}
              onClick={() =>
                card.id && console.log((card.id, `card click ${card.id}`))
              }
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
