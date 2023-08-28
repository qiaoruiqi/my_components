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
import React, { useState } from 'react';
// import Tabs from './components/Tabs/Tabs';
// import TabItem from './components/Tabs/TabItem';
import AutoComplete from './components/AutoComplete/autocomplete';
var App = function () {
    var _a = useState(false), show = _a[0], setShow = _a[1];
    var _b = useState(''), value = _b[0], setvalue = _b[1];
    var handlefetch = function (query) {
        // 针对字符串类型的
        // return lakers.filter(name=>name.includes(query))
        // 针对对象类型的
        // return lakersWithNumber.filter(name=>name.value.includes(query))
        // 针对异步结果
        return fetch("https://api.github.com/search/users?q=".concat(query))
            .then(function (res) { return res.json(); })
            .then(function (_a) {
            var items = _a.items;
            console.log(items);
            var formatItems = items.slice(0, 10).map(function (item) { return (__assign({ value: item.login }, item)); });
            return formatItems;
        });
    };
    var renderOption = function (item) {
        var githubItem = item;
        return (React.createElement(React.Fragment, null,
            React.createElement("h2", null,
                "Name:",
                githubItem.value),
            React.createElement("p", null,
                "url:",
                githubItem.url)));
    };
    return (React.createElement("div", { className: "App" },
        React.createElement("header", { className: "App-header" },
            React.createElement(AutoComplete, { style: { width: '500px' }, fetchSuggestions: handlefetch, onSelect: function (item) { console.log('selected', item); }, renderOption: renderOption }))));
};
export default App;
