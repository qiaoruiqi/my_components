import React, { FC, ReactElement, InputHTMLAttributes, ChangeEvent} from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames';
import Icon from '../Icon/Icon';
type InputSize = 'lg' | 'sm'
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  disabled?: boolean;
  size?: InputSize;
  icon?: IconProp;
  prepend?: string | ReactElement;
  append?: string | ReactElement;
  classname?: string;
  onChange? : (e: ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 * 
 * ~~~js
 * // 这样引用
 * import { Input } from 'vikingship'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */
export const Input: FC<InputProps> = (props) => {
  // 取出各种属性
  const { disabled, size, icon, prepend, append,
  classname, children, style,...restProps
  } = props;
  // 根据属性计算不同的className
  const classes = classNames('viking-input-wrapper', {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prepend || append,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend
  })
  // 用于处理value初始情况为undefined/null的情况，需要在setstate传错值时，提前进行一个判断和修正
  const fixControlledValue = (value:any)=>{
    if(typeof value === undefined || value ===null){
        return ''
    }
    return value 
  }
  // 由于组件只能是受控组件或者非受控组件，不能两者都是。需要在这里判断来限制一下两者同时发生的情况
  if('value' in props){
    delete restProps.defaultValue;
    restProps.value = fixControlledValue(restProps.value );
  }
  return (
    // 根据属性判断是否需要添加特定的节点
    <div className={classes} style={style}>
      {prepend && <div className="viking-input-group-prepend">{prepend}</div>}
      {icon && <div className="icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
      <input 
        className="viking-input-inner"
        disabled={disabled}
        {...restProps}
      />
      {append && <div className="viking-input-group-append">{append}</div>}
    </div>
  )
}
export default Input;