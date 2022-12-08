import './Tabs.styles.styl';

import React, { Component } from 'react';

import { Hint } from './components';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Tabs component.
 *
 * @author Oleksii Medvediev
 * @category Components.
 */
class Tabs extends Component {
  render() {
    const { tabs, selectedTabClassName } = this.props;

    return (
      <div id={'tabsWrapper'} className={'tabsWrapper'}>
        {tabs.map(({ label, value, onClick, isSelected, hint }) => (
          <button
            className={classNames(
              'tabButton',
              isSelected && (selectedTabClassName || 'selectedTab')
            )}
            type={'button'}
            onClick={onClick}
            key={value}
          >
            {label}
            {hint && <Hint hint={hint} tab={value} />}
          </button>
        ))}
      </div>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      isSelected: PropTypes.bool.isRequired,
      onClick: PropTypes.func.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      hint: PropTypes.string
    })
  ),
  selectedTabClassName: PropTypes.string
};

export { Tabs };
