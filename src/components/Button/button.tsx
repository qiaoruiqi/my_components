import React from "react";
import classNames from 'classnames'
export type ButtonSize = 'lg'| 'sm' ;
export type ButtonType = 'primary'| 'default'| 'danger'| 'link';
interface BaseButtonProps {
  className?: string;
  disabled?: boolean;
  size?: ButtonSize;
  btnType?: ButtonType;
  children?: React.ReactNode;
  href?: string;
}
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;
const Button: React.FC<ButtonProps> = (props) => {
  const {
    btnType,
    className,
    size,
    disabled,
    children,
    href,
    ...restProps
  } = props;
  // btn btn-lg btn-primary
  const classes = classNames('btn', className,{
    [`btn-${btnType}`]: btnType,
    [`btn-${size}`]: size,
    'disabled': (btnType === 'link') && disabled
  })
  if (btnType === 'link' && href) {
    return (
      <a
        className={classes}
        href={href}
        {...restProps}
      >{children}</a>
    )
  } else {
    return (
      <button
      className={classes}
      disabled={disabled}
      {...restProps}
      >{children}</button>
    )
  }
}
//如果父组件调用子组件的时候不给子组件传值，可以在子组件中使用defaultProps定义的默认值
Button.defaultProps = {
  disabled :false,
  btnType:'default'
}
export default Button;