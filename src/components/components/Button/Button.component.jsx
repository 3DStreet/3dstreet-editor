import { bool, func, node, number, string } from 'prop-types';

import classNames from 'classnames';
import styles from './Button.module.scss';

const variants = {
  filled: styles.filledButton,
  outlined: styles.outlinedButton,
  ghost: styles.ghostButton,
  toolbtn: styles.toolButton,
  white: styles.whiteButton
};

/**
 * Button component.
 *
 * @author Oleksii Medvediev
 * @category Components
 * @param {{
 *  className?: string;
 *  onClick?: () => void;
 *  type?: string;
 *  children?: Element;
 *  variant?: string;
 *  disabled?: boolean;
 *  id?: string | number;
 * }} props
 */
const Button = ({
  className,
  onClick,
  type = 'button',
  children,
  variant = 'filled',
  disabled,
  id
}) => (
  <button
    className={classNames(styles.buttonWrapper, variants[variant], className)}
    onClick={onClick}
    type={type}
    tabIndex={0}
    disabled={disabled}
    id={id}
  >
    {children}
  </button>
);

Button.propTypes = {
  className: string,
  onClick: func,
  type: string,
  children: node,
  variant: string,
  disabled: bool,
  id: string || number
};

export { Button };
