import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Upload, { UploadFile } from './components/Upload/upload';
import Icon from './components/Icon/Icon';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)
const App: React.FC = () => {
  // const defaultFileList: UploadFile[] = [
  //   { uid: '123', size: 1234, name: 'hello.md', status: 'uploading', percent: 30 },
  //   { uid: '122', size: 1234, name: 'xyz.md', status: 'success', percent: 30 },
  //   { uid: '121', size: 1234, name: 'eyiha.md', status: 'error', percent: 30 }
  // ]
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const uploadedFile = files[0];
      const formData = new FormData();
      formData.append(uploadedFile.name, uploadedFile)
      axios.post("https://jsonplaceholder.typicode.com/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        console.log(resp)
      })
    }
  }
  // 验证文件能否上传
  const checkFileSize = (file: File) => {
    if (Math.round(file.size / 1024) > 50) {
      return false;
    }
    return true
  }
  // 替换
  const filePromise = (file: File) => {
    const newFile = new File([file], 'new_name.docx', { type: file.type });
    return Promise.resolve(newFile)
  }
  return (
    <div className="App">
      <Upload 
     
        action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
        multiple
        name='fileName'
        data={{'key':'value'}}
        headers={{'X-Powered-By':'viking-ship'}}
        drag
      >
   <Icon icon="upload" size="5x" theme="secondary" />
      <br/>
      <p>Drag file over to upload</p>

      </Upload>
      {/* <input type="file" name="myFile" onChange={handleChange} /> */}
    </div>
  );
}

export default App;
