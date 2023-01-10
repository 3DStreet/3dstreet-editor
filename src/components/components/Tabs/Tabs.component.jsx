import { arrayOf, bool, func, shape, string } from 'prop-types';

import { Hint } from './components';
import classNames from 'classnames';
import styles from './Tabs.module.scss';

/**
 * Tabs component.
 *
 * @author Oleksii Medvediev
 * @category Components.
 * @param {{
 *  tabs?: {
 *    isSelected: boolean;
 *    onClick: (value: string) => void;
 *    label: string;
 *    value: string;
 *    hint?: string;
 *  };
 *  selectedTabClassName: string;
 * }} props
 */
const Tabs = ({ tabs, selectedTabClassName }) => (
  <div id={'tabsWrapper'} className={styles.wrapper}>
    {!!tabs?.length &&
      tabs.map(({ label, value, onClick, isSelected, hint }) => (
        <button
          className={classNames(
            styles.tabButton,
            isSelected && (selectedTabClassName ?? styles.selectedTab)
          )}
          type={'button'}
          tabIndex={0}
          onClick={onClick}
          key={value}
        >
          {label}
          {hint && <Hint hint={hint} tab={value} />}
        </button>
      ))}
  </div>
);

Tabs.propTypes = {
  tabs: arrayOf(
    shape({
      isSelected: bool.isRequired,
      onClick: func.isRequired,
      label: string.isRequired,
      value: string.isRequired,
      hint: string
    })
  ),
  selectedTabClassName: string
};

export { Tabs };
