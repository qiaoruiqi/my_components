import React,{ useContext } from 'react'
import classNames from 'classnames';
import {ItemContext} from './Tabs'
export interface TabItemProps {
  index?: number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode; // 添加children类型
  label:string;
}
const TabItem:React.FC<TabItemProps> = (props)=>{
  const {index,disabled,className,style,label,children}= props;
  const context = useContext(ItemContext);
  const classes = classNames('tab-item',className,{
    'is-disabled':disabled,
    'is-active': index === context.index
  }) 
  const handleClick =()=>{
    console.log(9999)

    if(context.onSelect && !disabled && typeof(index)==='number'){
      context.onSelect(index)
    }
  }
  return (
    <li className={classes} style={style} onClick={handleClick}>
      <div >{label}</div>
    </li>
  );
}
export default TabItem;
TabItem.displayName='tabitem'