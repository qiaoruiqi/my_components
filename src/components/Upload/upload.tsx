import React, { FC, useRef, ChangeEvent, useState, useEffect } from 'react'
import axios, { CancelToken, Canceler,AxiosRequestConfig, AxiosProgressEvent } from 'axios'
import Button from '../Button/button'
import UploadList from './uploadList'
import Dragger from './dragger'
import hashWorker from "./hash";
import WorkerBuilder from "./worker-build";
export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
type containerProps = {
  file: Blob | null,
  hash: string,
  worker: Worker | null
}
interface MyRequestConfig extends AxiosRequestConfig {
  requestList?: AxiosRequestConfig[];
  iscancel?:boolean;
}

export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status?: UploadFileStatus;
  percent?: number;
  chunk?: File;
  response?: any;
  error?: any;
  hash: string;
  index?: number;
}
interface sliceDatePorps {
  chunk: Blob;
  // 文件名 + 数组下标
  hash: string;
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
  const [len, setlen] = useState({ updatelen: 0, requstlen: 0, filllen: 0 });
  const [sliceData, setSliceData] = useState<sliceDatePorps[]>([])
  const [container, setcontainer] = useState<containerProps>({ file: null, hash: "", worker: null })
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || []);
  const [hashPercentage, sethashPercentage] = useState(0);
  const [requestList_all, setrequestList] = useState<any[]>([]);
  const [ispause,setIspause] = useState<boolean>();
  const [controller,setIscontroller] = useState<AbortController | undefined>()
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
  useEffect(() => {
    // setlen({updatelen:uploadedList.length,requstlen:requestList.length,filllen:fililist.length})
    async function merge() {
      // if (len.updatelen + len.requstlen === len.filllen && len.filllen != 0) {
      //   // debugger
      //   // await mergeRequest();
      // }
    }
    merge();
  }, [container, len.filllen]);
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files);
    postFiles.forEach(async file => {
      if (!beforeUpload) {
        // 进行大文件上传
        // 切片
        const fileChunkList = createFileChunk(file);
        // 计算文件的hash值
        let hash = await calculateHash(fileChunkList);

        setcontainer((prevContainer) => {
          const newValue = { ...container, file: file, hash: hash } as containerProps;
          console.log(newValue); // 打印更新后的值
          return newValue;
        });
        // 文件秒传 -- 原理：利用了服务器只要存在该资源，用户再次上传就会提示上传成功
        const { shouldUpload, uploadedList } = await verifyUpload(file, hash);
        if (!shouldUpload) {
          return;
        }
        let fililist = fileChunkList.map(({ file }, index) => ({
          uid: hash as string,
          name: (file as File).name,
          index,
          hash: hash + "-" + index,
          chunk: file as File,
          size: file.size,
          percentage: uploadedList.includes(index) ? 100 : 0
        }));
        debugger
        await uploadChunks(uploadedList, fililist);
      }
    })

  }


  // 发送请求
  const request = (
    { url,
      method = "post",
      data,
      headers = {},
      signal,
      requestList
    }: MyRequestConfig
  ) => {
    
    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      headers,
      signal: signal,
    };
    let promise = axios(config)
      .then((resp) => {
        if (requestList) {
          const requestIndex = requestList.findIndex((item: any) => item === request);
          requestList.splice(requestIndex, 1);
        }
        return resp;
      })
      .catch((err) => {
        return err;
      });
    setrequestList((prev) => { return (requestList as AxiosRequestConfig<any>[]) })
    return promise;
  };


  /**
   * 大文件上传部分-文件切片
   * @param file 
   * @param size 
   * @returns 
   */
  // 1、文件切片
  const createFileChunk = (file: File, size: number = SIZE) => {
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + size) });
      cur += size;
    }
    return fileChunkList;
  }
  // 2、计算文件hash值
  const calculateHash = (fileChunkList: { file: Blob }[]) => {
    return new Promise(resolve => {
      const worker = new WorkerBuilder(hashWorker)
      const updateContainer = (prevContainer: { file: Blob | null; hash: string; worker: Worker | null }) => {
        return { ...prevContainer, worker: worker };
      };
      setcontainer(updateContainer);
      // 向Worker发送消息
      worker.postMessage({ fileChunkList });
      // 接收Worker的消息
      worker.onmessage = e => {
        const { percentage, hash } = e.data;
        let hashPercentage = percentage;
        sethashPercentage(hashPercentage);
        if (hash) {
          resolve(hash);
        }
      };
    });
  }
  // 3、根据 hash 验证文件是否曾经已经被上传过
  //    没有才进行上传
  //   verify that the file has been uploaded based on the hash
  //   skip if uploaded
  const verifyUpload = async (file: any, fileHash: any) => {
    let filename = file.name;
    const { data } = await request(
      {
        url: "http://localhost:3000/verify",
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          filename,
          fileHash
        })
      });
    return data
  }
  // 4、上传切片，同时过滤已上传的切片
  // upload chunks and filter uploaded chunks
  const uploadChunks = async (uploadedList: string[] = [], fililist: UploadFile[]) => {
    setIscontroller((prev)=>{return new AbortController();})
    console.log(99, requestList_all)
    const requestList: any = fililist
      .filter(({ hash }) => !uploadedList.includes(hash))
      .map(({ uid, name, chunk, hash, index }) => {
        const formData = new FormData();
        formData.append("chunk", chunk as File);
        formData.append("hash", hash);
        formData.append("filename", name);
        formData.append("fileHash", uid);
        return { formData, index };
      })
      .map(({ formData, index }) =>
        request({
          url: "http://localhost:3000",
          data: formData,
          signal:controller?controller.signal:undefined,
          requestList: requestList_all
        })
      );
     // 全量并发
     // await Promise.all(requestList);
     // 控制并发,并实现暂停效果  
    const ret =  await sendRequest(requestList,4)
    // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量时合并切片
    // merge chunks when the number of chunks uploaded before and
    // the number of chunks uploaded this time
    // are equal to the number of all chunks
    setlen({ updatelen: uploadedList.length, requstlen: requestList.length, filllen: fililist.length })
    if (uploadedList.length + requestList.length === fililist.length) {
      await mergeRequest();
     }
  }
  const sendRequest = (forms:AxiosRequestConfig[],max = 10)=>{
    return new Promise(resolve => {
      const len = forms.length;
      let idx = 0;
      let counter = 0;
      const start = async ()=> {
        while (idx < len && max > 0) {
          if(ispause==true) break;
          max--; // 占用通道
          console.log(idx, "start");
          const form = forms[idx].form;
          const index = forms[idx].index;
          idx++;
          request({
            url: "http://localhost:3000",
            data: form,
            signal:controller?controller.signal:undefined,
            requestList: requestList_all
          }).then(() => {
            max++; // 释放通道
            counter++;
            if (counter === len) {
              resolve();
            } else {
              start();
            }
          });
        }
      }
    });
  }
  // 用闭包保存每个 chunk 的进度数据
  // use closures to save progress data for each chunk
  const createProgressHandler = (item: any) => {
    return (e: any) => {
      item.percentage = parseInt(String((e.loaded / e.total) * 100));
    };
  }
  // 上传请求，将之前的请求合并
  const mergeRequest = async () => {
    await request({
      url: "http://localhost:3000/merge",
      headers: {
        "content-type": "application/json"
      },
      data: JSON.stringify({
        size: SIZE,
        fileHash: container.hash,
        filename: (container.file as File).name
      })
    });


    console.log("upload success, check /target directory");
    // this.status = Status.wait;
  }
  const handlePause = () => {
    setIspause((prev)=>{return true});;
  }
  const resetData =() =>{
    debugger
    if(controller)
    controller.abort()
  }
  return (
    <div
      className='viking-upload-component'
      style={{ width: '500px' }}
    >
      <Button btnType="primary" onClick={handlePause}>暂停</Button>
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