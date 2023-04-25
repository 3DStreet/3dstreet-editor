import { ArrowDown24Icon, Search20Icon } from '../../../icons';
import React, { useRef, useState } from 'react';

import classNames from 'classnames';
import styles from './Selector.module.scss';
import { v4 } from 'uuid';

const id = v4();
/**
 * Input component.
 *
 * @author Ihor Dubas
 * @category Components
 * @param {{
 *  className?: string;
 *  onChange: (value: string) => void;
 *  icon?: boolean;
 *  label?: string;
 *  placeholder?: string;
 *  disabled?: boolean;
 *  selectorId?: string;
 *  options: Options
 *
 *  Option = {value: string, label: string, icon?: ReactNode, isDisabled?: boolean}
 *  Options = Array<Option | Array<Option>>
 * }} props
 */
const Selector = ({
  label,
  icon,
  placeholder,
  options,
  defaultValue,
  onSelect
}) => {
  const [value, setValue] = useState(defaultValue ?? '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const selectorRef = useRef(null);
  const filteredOptions = options.filter((option) =>
    option.label.toString().includes(value)
  );
  return (
    <div className={styles.selectorWrapper}>
      <span className={styles.label}>{label}</span>
      <div
        ref={selectorRef}
        className={classNames(styles.selector, isActive && styles.active)}
        onClick={() => {
          selectorRef.current && selectorRef.current.focus();
          setIsExpanded((prev) => !prev);
          setIsActive(true);
        }}
      >
        {icon && (
          <div className={styles.searchIcon}>
            <Search20Icon />
          </div>
        )}
        <input
          ref={selectorRef}
          type="text"
          id={id}
          className={styles.input}
          placeholder={placeholder}
          onChange={({ currentTarget: { value } }) => {
            setValue(value);
          }}
          value={value}
        />
        <div
          className={classNames(
            styles.arrowDownIcon,
            isExpanded && styles.expanded
          )}
        >
          <ArrowDown24Icon />
        </div>
      </div>
      {/* TODO: add folders to options */}
      {isExpanded && (
        <div className={styles.menu}>
          {filteredOptions.length > 0 &&
            filteredOptions.map((option, idx) => (
              <div
                key={option.value}
                className={classNames(
                  styles.item,
                  option.isDisabled && styles.disabled,
                  value === option.value && styles.active,
                  idx === 0 && styles.firstItem,
                  idx === filteredOptions.length - 1 && styles.lastItem
                )}
                onClick={() => {
                  setValue(option.label);
                  onSelect(option);
                  setIsExpanded(false);
                  setIsActive(false);
                }}
              >
                {option.icon && (
                  <div className={styles.icon}>{option.icon}</div>
                )}
                <span className={styles.label}>{option.label}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export { Selector };
