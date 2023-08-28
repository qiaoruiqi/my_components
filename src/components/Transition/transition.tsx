import React from 'react';
import { CSSTransition } from 'react-transition-group'
import { CSSTransitionProps } from 'react-transition-group/CSSTransition'

type AnimationName = 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-right' | 'zoom-in-bottom';


//在 TypeScript 中，接口只能扩展静态已知成员的对象类型或交叉类型。
//此处的CSSTransitionProps是一个具有动态成员的对象类型或交叉类型 
//应当使用类型别名来定义您的类型，而不是使用接口
// interface MyTransitionProps extends CSSTransitionProps {
//    animation?: AnimationName;
// }
type TransitionProps = CSSTransitionProps & {
  animation?: AnimationName;
  //由于Button也有transition，解决方案就是在外层包裹一层节点，transition属性不会继承
  wrapper?: boolean;
  children?:React.ReactNode;
}

const Transition: React.FC<TransitionProps> = (props) => {
  const {
    wrapper,
    children,
    className,
    animation,
    ...resProps
  } = props;
  return (
    <CSSTransition classNames={className ? className : animation} {...resProps}>
     {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  );
}
Transition.defaultProps = {
  unmountOnExit: true,
  appear: true
}
export default Transition;