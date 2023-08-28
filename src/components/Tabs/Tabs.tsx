import React,{createContext, useState} from 'react'
import classNames from 'classnames';
import {TabItemProps} from './TabItem'
type SelectCallback = (selectedIndex:number)=>void;
export interface TabsProps{
  defaultIndex?:number,
  onSelect?:SelectCallback,
  className?:string,
  styles?:React.CSSProperties,
  children?:React.ReactNode,
}
 interface TabsContext{
  index:number;
  onSelect?: SelectCallback;
}
export const ItemContext = createContext<TabsContext>({index:0})
const Tabs:React.FC<TabsProps> = (props)=>{
  const {defaultIndex,onSelect,className,styles,children} = props;
  const [currentActive,setActive] = useState(defaultIndex);
  const classes = classNames('viking-tab', className)
  const handleClick = (index:number)=>{
    setActive(index);
    if(onSelect) onSelect(index);
  }
    // 将currentactive传给下一个组件
    const passedContext: TabsContext = {
      index: currentActive ? currentActive : 0,
      onSelect:handleClick,
    }
  const renderChildren = ()=>{
    return React.Children.map(children,(child,index)=>{
      const childrenElement =  child as React.FunctionComponentElement<TabItemProps>; // as：将值强制转为别的类型
      const {displayName}  =childrenElement.type;
      if(displayName==='tabitem'){
        return React.cloneElement(childrenElement,{index})
      }
    })
  }
  return (
    <ul className={classes} >
      <ItemContext.Provider value={passedContext}>
     {renderChildren()}
     </ItemContext.Provider>
    </ul>
  )
}
Tabs.defaultProps = {
  defaultIndex: 0
}
export default Tabs;