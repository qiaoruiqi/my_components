import React from 'react';
var Progress = function (props) {
    var percent = props.percent, strokeheight = props.strokeheight, showText = props.showText, styles = props.styles, theme = props.theme;
    return (React.createElement("div", { className: 'viking-progress-bar', style: styles },
        React.createElement("div", { className: 'viking-progress-bar-outer', style: { height: "".concat(strokeheight, "px") } },
            React.createElement("div", { className: "viking-progress-bar-inner color-".concat(theme), style: { width: "".concat(percent, "%") } }, showText && React.createElement("span", { className: 'inner-text' }, "".concat(percent, "%"))))));
};
Progress.defaultProps = {
    strokeheight: 15,
    showText: true,
    theme: 'primary'
};
export default Progress;
