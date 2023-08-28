import React, { createContext, useState } from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './menuItem'

type Menumode = 'vertical' | 'horizontal';
type SelectCallback = (selectedIndex: string) => void;
export interface MenuProps {
  /**默认 active 的菜单项的索引值 */
  defaultIndex?: string;
  className?: string;
  /**菜单类型 横向或者纵向 */
  mode?: Menumode;
  style?: React.CSSProperties;
  children?: React.ReactNode; // 添加children类型
  /**点击菜单项触发的回调函数 */
  onselect?: SelectCallback;
  defaultOpenmenu?: string[];
}
interface IMenuContext {
  index: string;
  onSelect?: SelectCallback;
  mode?: string;
  defaultOpenmenu?: string[];
}
export const MenuContext = createContext<IMenuContext>({ index: '0' });
const Menu: React.FC<MenuProps> = (props) => {
  const { defaultIndex, className, mode, style, children, defaultOpenmenu, onselect } = props;
  const [currentActive, setActive] = useState(defaultIndex);
  // 定义类名
  const classes = classNames('viking-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  })
  // 点击改变当前active项
  const handleClick = (index: string) => {
    setActive(index);
    if (onselect) onselect(index);
  }
  // 将currentactive传给下一个组件
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenmenu
  }
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>; // as：将值强制转为别的类型
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        return React.cloneElement(childElement, { index: index.toString() });
      }
      else {
        console.error("warning: Menu has a child which is not a MenuItem component")
      }
    })
  }
  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>)
}
Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenmenu: []
}
export default Menu;