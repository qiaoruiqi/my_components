import React, { useContext, createContext, useState } from 'react';
import classNames from 'classnames';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
// import { CSSTransition } from 'react-transition-group' 和下面的<CSSTransition></CSSTransition>对应
import Transition  from '../Transition/transition';
import { MenuContext } from './menu'
import { MenuItemProps } from './menuItem'
import Icon from '../Icon/Icon'
library.add(fas)
export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
  children?: React.ReactNode;

}

const SubMenu: React.FC<SubMenuProps> = ({ index, title, children, className }) => {
  const context = useContext(MenuContext)
  // 功能：竖着的时候，menuOpen默认是打开的
  // 此功能需要从父组件获取一个数组，数组里包含默认打开的submenu的index值
  // 打开的第一个条件是index存在且是竖着的时候，其次是数组里是否包含元素
  const openedMenus = context.defaultOpenmenu as Array<string>;
  const isOpened = (index && context.mode === 'vertical') ? openedMenus.includes(index) : false;
  const [menuOpen, setopen] = useState(isOpened);

  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
    'is-opened': menuOpen,
    'is-vertical': context.mode === 'vertical'
  })
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setopen(!menuOpen);
  }
  //放了一个定时器，可以使submenu滑动出现比较自然
  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    e.preventDefault();
    timer = setTimeout(() => {
      setopen(toggle);
    }, 300);

  }
  //定义事件：这里的事件是对象，因为划过这个动作会出发两个事件
  //当menu竖着排列时，点击有效
  const clickEvents = context.mode === 'vertical' ? {
    onClick: handleClick
  } : {};
  //当menu横着排列时，划过就出现（涉及两个动作：onMouseEnter/onMouseLeave）
  const MouseEvent = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => {
      handleMouse(e, true);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      handleMouse(e, false);
    }
  } : {};
  const renderChildren = () => {
    const subMenuClass = classNames('viking-submenu', {
      
    })
    // 判断组件是否是MenuItem
    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as React.FunctionComponentElement<MenuItemProps>
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`
        })
      } else {
        console.error("Warning: SubMenu has a child which is not a MenuItem component")
      }
    })
    return (
      // <CSSTransition
      //   // 指示组件是否处于“进入”状态 
      //   // 当in属性为true时，CSSTransition组件会自动添加一个enter类名，用于触发“进入”状态的CSS动画效果。
      //   // 此时，我们可以在CSS中定义enter类名的样式，实现进入动画效果。
      //   // 当in属性为false时，CSSTransition组件会自动添加一个exit类名，用于触发“离开”状态的CSS动画效果。
      //   // 此时，我们可以在CSS中定义exit类名的样式，实现离开动画效果。
      //   in={menuOpen} 
      //   timeout={300} //设置CSS动画的持续时间 它是一个对象，包含了两个属性：enter和exit，分别表示“进入”和“离开”动画的持续时间。
      //   classNames='zoom-in-top'
      //   appear // 组件初始渲染时是否会执行过渡效果
      //   // 当unmountOnExit属性为true时，组件在离开DOM后会被卸载，这意味着组件的状态和事件处理程序都会被清除。这对于需要在组件离开DOM后释放资源或避免内存泄漏的情况非常有用。
      //   // 当unmountOnExit属性为false时，组件在离开DOM后不会被卸载，而是保留在DOM中。这对于需要在组件离开DOM后保留状态或避免重新挂载组件的情况非常有用。
      //   unmountOnExit
      // >
      <Transition in={menuOpen} timeout={300} animation='zoom-in-top'>
      <ul className={subMenuClass}>
        {childrenComponent}
      </ul>
      </Transition>
      // </CSSTransition>
    )
  }
  return (
    // 由于事件存放在对象里面，因此解构赋值
    <li key={index} className={classes} {...MouseEvent}>
      <div className="submenu-title"{...clickEvents}>
        {title}
        <Icon icon="angle-down" className='arrow-icon' ></Icon>
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu;