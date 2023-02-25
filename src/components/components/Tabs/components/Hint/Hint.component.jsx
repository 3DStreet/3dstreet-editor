import { string } from 'prop-types';
import styles from './Hint.module.scss';
import { useEffect } from 'react';

/**
 * Hint component.
 * Exclusively for the Tabs component's tab button.
 *
 * @author Oleksii Medvediev
 * @category Components.
 * @param {{
 *  hint: string;
 *  tab: string;
 * }} props
 */
const Hint = ({ hint, tab }) => {
  useEffect(() => {
    const hintElement = document?.getElementById(this.props.tab.concat('Tab'));

    hintElement &&
      !hintElement.hasAttribute('style') &&
      hintElement.setAttribute(
        'style',
        `left: calc(50% - ${hintElement.clientWidth / 2}px)`
      );
  }, [document]);

  return (
    <div id={tab.concat('Tab')} className={styles.wrapper}>
      <span>{hint}</span>
    </div>
  );
};

Hint.propTypes = {
  hint: string.isRequired,
  tab: string.isRequired
};

export { Hint };
