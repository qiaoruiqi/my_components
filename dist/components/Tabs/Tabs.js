import React, { createContext, useState } from 'react';
import classNames from 'classnames';
export var ItemContext = createContext({ index: 0 });
var Tabs = function (props) {
    var defaultIndex = props.defaultIndex, onSelect = props.onSelect, className = props.className, styles = props.styles, children = props.children;
    var _a = useState(defaultIndex), currentActive = _a[0], setActive = _a[1];
    var classes = classNames('viking-tab', className);
    var handleClick = function (index) {
        setActive(index);
        if (onSelect)
            onSelect(index);
    };
    // 将currentactive传给下一个组件
    var passedContext = {
        index: currentActive ? currentActive : 0,
        onSelect: handleClick,
    };
    var renderChildren = function () {
        return React.Children.map(children, function (child, index) {
            var childrenElement = child; // as：将值强制转为别的类型
            var displayName = childrenElement.type.displayName;
            if (displayName === 'tabitem') {
                return React.cloneElement(childrenElement, { index: index });
            }
        });
    };
    return (React.createElement("ul", { className: classes },
        React.createElement(ItemContext.Provider, { value: passedContext }, renderChildren())));
};
Tabs.defaultProps = {
    defaultIndex: 0
};
export default Tabs;
