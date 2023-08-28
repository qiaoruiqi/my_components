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
import React, { useState, useEffect, useRef } from 'react';
import Input from '../Input/input';
import Icon from '../Icon/Icon';
import Transition from '../Transition/transition';
import useDebounce from '../../hooks/useDebounce';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import useClickOutside from '../../hooks/useClickOutside';
library.add(fas);
;
/**
 * AutoComplete 在输入框输入内容的时候，下方会自动提示文字
 *
 * ~~~js
 * // 这样引用
 * import { AutoComplete } from 'vikingship'
 * ~~~
 *
 */
var AutoComplete = function (props) {
    var _a;
    var fetchSuggestions = props.fetchSuggestions, onSelect = props.onSelect, value = props.value, renderOption = props.renderOption, restProps = __rest(props, ["fetchSuggestions", "onSelect", "value", "renderOption"]);
    // 需要有两个状态：输入框的值 inputValue， 下方提示文字的内容 suggestions
    var _b = useState((_a = value) !== null && _a !== void 0 ? _a : ''), inputValue = _b[0], setInputValue = _b[1];
    var _c = useState([]), suggestions = _c[0], setsuggestions = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(-1), highlightIndex = _e[0], sethighlightIndex = _e[1];
    var _f = useState(false), showDropdown = _f[0], setShowDropdown = _f[1];
    // 由于debounceValue每次修改时都会查找，但是实际上点击enter键时，已经无需搜索了，那么需要一个值来索引完成的状态，以防止不必要的搜索
    var triggerSearch = useRef(false);
    // componentRef指向组件整个dom节点
    var componentRef = useRef(null);
    var debounceValue = useDebounce(inputValue, 500);
    useClickOutside(componentRef, function () { setsuggestions([]); });
    useEffect(function () {
        // 当inutValue发生改变时，做如下操作
        if (debounceValue && triggerSearch.current) {
            var result = fetchSuggestions(debounceValue);
            // fetchSuggestions返回的suggestion为异步结果时，Promise<DataSourceType[]>
            if (result instanceof Promise) {
                setLoading(true);
                result.then(function (data) {
                    setLoading(false);
                    setsuggestions(data);
                    if (data.length > 0)
                        setShowDropdown(true);
                });
            }
            else {
                setsuggestions(result);
                setShowDropdown(true);
                if (result.length > 0) {
                    setShowDropdown(true);
                }
            }
        }
        else {
            setShowDropdown(false);
        }
        sethighlightIndex(-1);
    }, [debounceValue]);
    /**
     * 键盘按下去的事件
     */
    var highlight = function (index) {
        if (index < 0)
            index = 0;
        if (index >= suggestions.length) {
            index = suggestions.length - 1;
        }
        sethighlightIndex(index);
    };
    var handleKeyDown = function (e) {
        switch (e.keyCode) {
            // 回车键
            case 13:
                if (suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex]);
                }
                break;
            // 向上的箭头
            case 38:
                highlight(highlightIndex - 1);
                break;
            // 向下的箭头
            case 40:
                highlight(highlightIndex + 1);
                break;
            // esc
            case 27:
                setShowDropdown(false);
                break;
            default:
                break;
        }
    };
    /**
     * @param handleChange 输入框的内容发生变化时
     * 1、输入的不为空，那么就去找下方提示文字的内容
     * 2、找下方提示文字的内容返回的suggestion为异步/同步结果
     */
    var handleChange = function (e) {
        var value = e.target.value.trim();
        setInputValue(e.target.value);
        // 
        triggerSearch.current = true;
        // 输入的不为空，那么就去找下方提示文字的内容
    };
    // 点中列表中的值，触发一系列事件：
    // 1、选中的值，填充进入菜单
    // 2、隐藏下拉菜单
    var handleSelect = function (item) {
        setInputValue(item.value);
        setsuggestions([]);
        triggerSearch.current = false;
        if (onSelect) {
            onSelect(item.value);
        }
    };
    var renderTemplate = function (item) {
        return renderOption ? renderOption(item) : item.value;
    };
    var generateDropdown = function () {
        return (React.createElement(Transition, { style: { width: '500px' }, in: showDropdown || loading, animation: "zoom-in-top", timeout: 300, onExited: function () { setsuggestions([]); } },
            React.createElement("ul", { className: "viking-suggestion-list" },
                loading &&
                    React.createElement("div", { className: "suggstions-loading-icon" },
                        React.createElement(Icon, { icon: "spinner", spin: true })),
                suggestions.map(function (item, index) {
                    var cnames = classNames('suggestion-item', {
                        'is-active': index === highlightIndex
                    });
                    return (React.createElement("li", { key: index, className: cnames, onClick: function () { return handleSelect(item); } }, renderTemplate(item)));
                }))));
    };
    return (React.createElement("div", { className: 'viking-auto-complete', ref: componentRef },
        React.createElement(Input, __assign({ value: inputValue, onChange: handleChange }, restProps, { onKeyDown: handleKeyDown })),
        generateDropdown()));
};
export default AutoComplete;
