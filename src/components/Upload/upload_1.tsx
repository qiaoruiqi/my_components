import React, { FC, useRef, ChangeEvent, useState } from 'react'
import axios from 'axios'
import Button from '../Button/button'
import UploadList from './uploadList'
import Dragger from './dragger'
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  raw?: File;
  response?: any;
  error?: any;

}
interface sliceDatePorps {
  chunk: Blob;
  // 文件名 + 数组下标
   hash:string;
}
export interface UploadPrpos {
  action: string;
  defaultFileList?: UploadFile[];
  beforeUpload?: (file: File) => boolean | Promise<File> // 验证（boolean）和转换（Promise<File>）
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
  onRemove?: (file: UploadFile) => void;
  // 丰富请求的内容:自定义Http post请求
  headers?: { [key: string]: any };
  name?: string;
  data?: { [key: string]: any };
  withCredentials?: boolean; // 是否携带cookie
  // 自定义input属性
  accept?: string; // 筛选可以选择的文件
  multiple?: boolean; // 允许上传多个文件
  drag?: boolean;
  children?: React.ReactNode;
}
export const Upload: FC<UploadPrpos> = (props) => {
  const {
    action,
    defaultFileList,
    headers,
    name,
    data,
    withCredentials,
    accept,
    multiple,
    drag,
    children,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove
  } = props;
  const SIZE = 10 * 1024 * 1024;
  const [sliceData,setSliceData] = useState<sliceDatePorps[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  const fileInput = useRef<HTMLInputElement>(null);
  // 在异步环境中，只要之前的值发生变化，就会更改Filelist的值
  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj };
        } else {
          return file
        }
      })
    })
  }
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid != file.uid);
    })
    if (onRemove) {
      onRemove(file)
    }
  }
  // 由于展示的界面为button，input实际被display隐藏起来，那么需要触发点击事件的话，就需要使用useRef
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }
  // input 的onchange事件，实际上就是拿到了文件，接下来进行上传文件的操作
  const handleFilechange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      uploadFiles(files);
    }
    else return;
    if (fileInput.current) {
      fileInput.current.value = '';
    }
  }
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files);
    postFiles.forEach(file => {
      // 有beforeUpload
      if (!beforeUpload) {
       post(file);
      } else {
        const result = beforeUpload(file);
        if (result && result instanceof Promise) {
          result.then(processedFile => {
          //  post(processedFile);
          })
        }
        else if (result === false) {
          // 大文件上传
          const fileChunkList = createFileChunk(file);
          //这里暂时使用文件名 + 下标,给每个切片一个标识作为 hash
          let data = fileChunkList.map((item,index) => ({
            chunk: item.file,
                  // 文件名 + 数组下标
             hash: file.name + "-" + index
          }))
          setSliceData((prev)=>{return [...prev,...data]});
          // post(file,true,data);
            
        } else {
        
        } 
      }
    })

  }
 
  // const post = (file: File, isSlice:boolean,slicedata:sliceDatePorps[]=[]) => {
  //   debugger
  //   let _file: UploadFile = {
  //     uid: Date.now() + 'upload-file',
  //     status: 'ready',
  //     name: file.name,
  //     size: file.size,
  //     percent: 0,
  //     raw: file
  //   }
  //   setFileList((prevList) => {
  //     return [_file, ...prevList]
  //   })
  //   const formData = new FormData();
  //   let formDataList = [];
  //   if(isSlice===true) {
  //       formDataList = slicedata.map((item) => {
  //       const formData = new FormData();
  //       formData.append("chunk", item.chunk);
  //       formData.append("hash", item.hash);
  //       formData.append("filename", file.name);
  //       return { formData };
  //       })
  //   }
  //   else{
  //     formData.append(name || 'file', file)
  //     if (data) {
  //       Object.keys(data).forEach(key => {
  //         formData.append(key, data[key]);
  //       })
  //     }
  //     formDataList.push(formData)

  //   }
  //   const requestList = formDataList.map(formData=>{
  //     axios.post("https://jsonplaceholder.typicode.com/posts", formData, {
  //       headers: {
  //         ...headers,
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       withCredentials,
  //       onUploadProgress: (e) => {
  //         let percentage = Math.round((e.loaded * 100) / (e.total as number)) || 0;
  //         if (percentage < 100) {
  //           updateFileList(_file, { percent: percentage, status: 'uploading' })
  //           if (onProgress) {
  //             onProgress(percentage, file)
  //           }
  //         }
  //       }
  //     })
  //   })
  //    Promise.all(requestList).then(resp => {
  //     updateFileList(_file, { status: 'success', response: resp })
  //     if (onSuccess) {
  //       onSuccess(resp, file);
  //     }
  //     if (onChange) {
  //       onChange(file);
  //     }
  //   }).catch(err => {
  //     updateFileList(_file, { status: 'error', error: err })
  //     if (onError) {
  //       onError(err, file);
  //     }
  //     if (onChange) {
  //       onChange(file);
  //     }
  //   })
  // }
  const post = (file: File) => {
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }
    //setFileList([_file, ...fileList])
    setFileList(prevList => {
      return [_file, ...prevList]
    })
    const formData = new FormData()
    formData.append(name || 'file', file)
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    } 
    axios.post('https://jsonplaceholder.typicode.com/posts', formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      },
      withCredentials,
      onUploadProgress: (e) => {
        let percentage = Math.round((e.loaded * 100) / (e.total as number)) || 0;
        if (percentage < 100) {
          updateFileList(_file, { percent: percentage, status: 'uploading'})
          if (onProgress) {
            onProgress(percentage, file)
          }
        }
      }
    }).then(resp => {
      updateFileList(_file, {status: 'success', response: resp.data})
      console.log(resp)
      if (onSuccess) {
        console.log(resp.data)
        onSuccess(resp.data, file)
      }
      if (onChange) {
        onChange(file)
      }
    }).catch(err => {
      updateFileList(_file, { status: 'error', error: err})
      if (onError) {
        onError(err, file)
      }
      if (onChange) {
        onChange(file)
      }
    })
  }
  /**
   * 大文件上传-文件切片
   * @param file 
   * @param size 
   * @returns 
   */
  const createFileChunk = (file: File, size: number = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    debugger
    return fileChunkList;
  }

  return (
    <div
      className='viking-upload-component'
      style={{ width: '500px' }}
    >
      <div className="viking-upload-input"
        style={{ display: 'inline-block' }}
        onClick={handleClick}>
        {drag ?
          <Dragger onFile={(files) => { uploadFiles(files) }}>
            {children}
          </Dragger> :
          children
        }
        <input className="viking-file-input"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={handleFilechange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>
      {/* <UploadList
        fileList={fileList}
        onRemove={handleRemove}
      /> */}
    </div>
  )
}
Upload.defaultProps = {
  name: 'file'
}
export default Upload;