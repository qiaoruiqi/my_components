import React from 'react';
type Menumode = 'vertical' | 'horizontal';
type SelectCallback = (selectedIndex: string) => void;
export interface MenuProps {
    /**默认 active 的菜单项的索引值 */
    defaultIndex?: string;
    className?: string;
    /**菜单类型 横向或者纵向 */
    mode?: Menumode;
    style?: React.CSSProperties;
    children?: React.ReactNode;
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
export declare const MenuContext: React.Context<IMenuContext>;
declare const Menu: React.FC<MenuProps>;
export default Menu;
