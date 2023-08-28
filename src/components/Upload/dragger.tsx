import React, { FC, useState, DragEvent } from 'react';
import classNames from 'classnames';
interface DraggerProps {
  onFile: (files: FileList) => void;
  children?: React.ReactNode
}
export const Dragger: FC<DraggerProps> = (props) => {
  const { onFile, children } = props;
  const [dragOver, setDragOver] = useState(false);
  const classes = classNames('viking-uploader-dragger', {
    'is-dragover': dragOver
  })
  const handledrop = (e:DragEvent<HTMLElement>)=>{
    e.preventDefault()
    setDragOver(false);
    onFile(e.dataTransfer.files);
  }
  const handleDrag = (e:DragEvent<HTMLElement>,over:boolean)=>{
      e.preventDefault();
      setDragOver(over)
  }
  return (
    <div className={classes}
    onDragOver={e=>{
      handleDrag(e,true)
    }}
    onDragLeave={e=>{
      handleDrag(e,false)
    }}
    onDrop={handledrop}
    >
      {children}
    </div>
  )
}
export default Dragger;