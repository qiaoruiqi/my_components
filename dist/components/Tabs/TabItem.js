import React, { useContext } from 'react';
import classNames from 'classnames';
import { ItemContext } from './Tabs';
var TabItem = function (props) {
    var index = props.index, disabled = props.disabled, className = props.className, style = props.style, label = props.label, children = props.children;
    var context = useContext(ItemContext);
    var classes = classNames('tab-item', className, {
        'is-disabled': disabled,
        'is-active': index === context.index
    });
    var handleClick = function () {
        console.log(9999);
        if (context.onSelect && !disabled && typeof (index) === 'number') {
            context.onSelect(index);
        }
    };
    return (React.createElement("li", { className: classes, style: style, onClick: handleClick },
        React.createElement("div", null, label)));
};
export default TabItem;
TabItem.displayName = 'tabitem';
