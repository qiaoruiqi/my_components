var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
import classNames from 'classnames';
import Icon from '../Icon/Icon';
/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 *
 * ~~~js
 * // 这样引用
 * import { Input } from 'vikingship'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */
export var Input = function (props) {
    var _a;
    // 取出各种属性
    var disabled = props.disabled, size = props.size, icon = props.icon, prepend = props.prepend, append = props.append, classname = props.classname, children = props.children, style = props.style, restProps = __rest(props, ["disabled", "size", "icon", "prepend", "append", "classname", "children", "style"]);
    // 根据属性计算不同的className
    var classes = classNames('viking-input-wrapper', (_a = {},
        _a["input-size-".concat(size)] = size,
        _a['is-disabled'] = disabled,
        _a['input-group'] = prepend || append,
        _a['input-group-append'] = !!append,
        _a['input-group-prepend'] = !!prepend,
        _a));
    // 用于处理value初始情况为undefined/null的情况，需要在setstate传错值时，提前进行一个判断和修正
    var fixControlledValue = function (value) {
        if (typeof value === undefined || value === null) {
            return '';
        }
        return value;
    };
    // 由于组件只能是受控组件或者非受控组件，不能两者都是。需要在这里判断来限制一下两者同时发生的情况
    if ('value' in props) {
        delete restProps.defaultValue;
        restProps.value = fixControlledValue(restProps.value);
    }
    return (
    // 根据属性判断是否需要添加特定的节点
    React.createElement("div", { className: classes, style: style },
        prepend && React.createElement("div", { className: "viking-input-group-prepend" }, prepend),
        icon && React.createElement("div", { className: "icon-wrapper" },
            React.createElement(Icon, { icon: icon, title: "title-".concat(icon) })),
        React.createElement("input", __assign({ className: "viking-input-inner", disabled: disabled }, restProps)),
        append && React.createElement("div", { className: "viking-input-group-append" }, append)));
};
export default Input;
