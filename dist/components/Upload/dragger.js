import React, { useState } from 'react';
import classNames from 'classnames';
export var Dragger = function (props) {
    var onFile = props.onFile, children = props.children;
    var _a = useState(false), dragOver = _a[0], setDragOver = _a[1];
    var classes = classNames('viking-uploader-dragger', {
        'is-dragover': dragOver
    });
    var handledrop = function (e) {
        e.preventDefault();
        setDragOver(false);
        onFile(e.dataTransfer.files);
    };
    var handleDrag = function (e, over) {
        e.preventDefault();
        setDragOver(over);
    };
    return (React.createElement("div", { className: classes, onDragOver: function (e) {
            handleDrag(e, true);
        }, onDragLeave: function (e) {
            handleDrag(e, false);
        }, onDrop: handledrop }, children));
};
export default Dragger;
