import React,{FC} from 'react'
import { ThemeProps } from '../Icon/Icon';
export interface progressProps{
  percent:number;
  strokeheight?:number;
  showText?:boolean;
  styles?:React.CSSProperties;
  theme?:ThemeProps;
}
const Progress:FC<progressProps> =(props)=>{
  const {
    percent,
    strokeheight,
    showText,
    styles,
    theme
  }=props;
  return (
    <div className='viking-progress-bar' style={styles}>
      <div className='viking-progress-bar-outer' style={{height:`${strokeheight}px`}}>
        <div className={`viking-progress-bar-inner color-${theme}`} style={{width:`${percent}%`}}>
          {showText && <span className='inner-text'>{`${percent}%`}</span>}
        </div>
      </div>
    </div>
  )
}
Progress.defaultProps ={
  strokeheight:15,
  showText:true,
  theme:'primary'
}
export default Progress