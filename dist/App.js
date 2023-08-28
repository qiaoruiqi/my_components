import React from 'react';
import axios from 'axios';
import Upload from './components/Upload/upload';
import Icon from './components/Icon/Icon';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fas);
var App = function () {
    // const defaultFileList: UploadFile[] = [
    //   { uid: '123', size: 1234, name: 'hello.md', status: 'uploading', percent: 30 },
    //   { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
    //   { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 }
    // ]
    var handleChange = function (e) {
        var files = e.target.files;
        if (files) {
            var uploadedFile = files[0];
            var formData = new FormData();
            formData.append(uploadedFile.name, uploadedFile);
            axios.post("https://jsonplaceholder.typicode.com/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function (resp) {
                console.log(resp);
            });
        }
    };
    // 验证文件能否上传
    var checkFileSize = function (file) {
        if (Math.round(file.size / 1024) > 50) {
            alert('file too big');
            return false;
        }
        return true;
    };
    // 替换
    var filePromise = function (file) {
        var newFile = new File([file], 'new_name.docx', { type: file.type });
        return Promise.resolve(newFile);
    };
    return (React.createElement("div", { className: "App" },
        React.createElement(Upload, { action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76', accept: ".jpg", multiple: true, name: 'fileName', data: { 'key': 'value' }, headers: { 'X-Powered-By': 'viking-ship' }, drag: true },
            React.createElement(Icon, { icon: "upload", size: "5x", theme: "secondary" }),
            React.createElement("br", null),
            React.createElement("p", null, "Drag file over to upload"))));
};
export default App;
