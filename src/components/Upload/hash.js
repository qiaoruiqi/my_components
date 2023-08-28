/* eslint-disable no-restricted-globals */
const hashWorker = () => {
  // 导入脚本
// import script for encrypted computing
self.importScripts("http://localhost:3001/spark-md5.min.js");

// 生成文件 hash
// create file hash
// 接收主线程的消息
self.onmessage = e => {
  console.log('Received message from main thread:', e.data);
  const { fileChunkList } = e.data;
  // ArrayBuffer 提供了一种方式来存储和操作原始的二进制数据
  const spark = new self.SparkMD5.ArrayBuffer();
  // percentage 计算进度 count 已处理的文件块数量
  let percentage = 0;
  let count = 0;
  const loadNext = index => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    // 当 FileReader 对象调用 readAsArrayBuffer() 方法并成功读取文件内容时，
    // 会触发 reader.onload 事件，并将文件内容存储在 e.target.result 中
    reader.onload = e => {
      count++;
      // 其文件内容追加到 SparkMD5 实例中的哈希计算
      spark.append(e.target.result);
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end() //spark.end() 返回的是所有文件块追加后计算得到的最终哈希值
        });
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage
        });
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
}
export default hashWorker