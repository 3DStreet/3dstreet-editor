import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './Input.module.scss';
import { useRef } from 'react';
import { v4 } from 'uuid';

const id = v4();

/**
 * Input component.
 *
 * @author Oleksii Medvediev
 * @category Components
 */
const Input = ({
  className,
  type = 'text',
  onChange,
  leadingIcon,
  tailingIcon,
  leadingSubtext,
  tailingSubtext,
  label,
  inputId = id,
  placeholder,
  errorMessage,
  successMessage,
  disabled
}) => {
  const inputElement = useRef(null);

  return (
    <div className={classnames(styles.wrapper, className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={classnames(styles.label, disabled && styles.disabledLabel)}
        >
          {label}
        </label>
      )}
      <div
        role={'button'}
        tabIndex={0}
        onClick={() => {
          inputElement.current.focus();
        }}
        className={classnames(
          styles.inputElementContainer,
          disabled && styles.disabledInputContainer,
          errorMessage &&
            !successMessage &&
            !disabled &&
            styles.erroredInputContainer,
          successMessage &&
            !errorMessage &&
            !disabled &&
            styles.successInputContainer
        )}
      >
        {leadingIcon && (
          <div className={styles.iconContainer}>{leadingIcon}</div>
        )}
        {leadingSubtext && (
          <span className={styles.subtext}>{leadingSubtext}</span>
        )}
        <input
          ref={inputElement}
          type={type === 'number' ? 'number' : type}
          onChange={onChange}
          id={inputId}
          placeholder={placeholder}
          className={styles.inputElement}
          disabled={disabled}
        />
        {tailingSubtext && (
          <span className={styles.subtext}>{tailingSubtext}</span>
        )}
        {tailingIcon && (
          <div className={styles.iconContainer}>{tailingIcon}</div>
        )}
      </div>
      {errorMessage && !successMessage && !disabled && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
      {successMessage && !errorMessage && !disabled && (
        <span className={styles.successMessage}>{successMessage}</span>
      )}
    </div>
  );
};

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  leadingIcon: PropTypes.node,
  tailingIcon: PropTypes.node,
  leadingSubtext: PropTypes.string,
  tailingSubtext: PropTypes.string,
  label: PropTypes.string,
  inputId: PropTypes.string,
  placeholder: PropTypes.string,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  disabled: PropTypes.bool
};

export { Input };
