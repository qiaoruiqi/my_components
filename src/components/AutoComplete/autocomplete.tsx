import React, { FC, useState, ChangeEvent, KeyboardEvent, ReactElement, useEffect ,useRef} from 'react'
import Input, { InputProps } from '../Input/input'
import Icon from '../Icon/Icon'
import Transition from '../Transition/transition'
import useDebounce from '../../hooks/useDebounce';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import useClickOutside from '../../hooks/useClickOutside';
library.add(fas)
interface DataSourceObject {
  value: string;
};
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  onSelect?: (item: string) => void;
  fetchSuggestions: (keyword: string) => DataSourceType[] | Promise<DataSourceType[]>;
  renderOption?: (item: DataSourceType) => ReactElement
}
/**
 * AutoComplete 在输入框输入内容的时候，下方会自动提示文字
 * 
 * ~~~js
 * // 这样引用
 * import { AutoComplete } from 'vikingship'
 * ~~~
 * 
 */
const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {
    fetchSuggestions,
    onSelect,
    value,
    renderOption,
    ...restProps
  } = props;
  // 需要有两个状态：输入框的值 inputValue， 下方提示文字的内容 suggestions
  const [inputValue, setInputValue] = useState<string>(value as string ?? '');
  const [suggestions, setsuggestions] = useState<DataSourceType[]>([])
  const [loading, setLoading] = useState(false)
  const [highlightIndex, sethighlightIndex] = useState(-1)
  const [ showDropdown, setShowDropdown] = useState(false)
  // 由于debounceValue每次修改时都会查找，但是实际上点击enter键时，已经无需搜索了，那么需要一个值来索引完成的状态，以防止不必要的搜索
  const triggerSearch = useRef(false)
  // componentRef指向组件整个dom节点
  const componentRef = useRef<HTMLDivElement>(null);
  const debounceValue = useDebounce(inputValue, 500);
  useClickOutside(componentRef,()=>{setsuggestions([])})
  useEffect(() => {
    // 当inutValue发生改变时，做如下操作
    if (debounceValue &&  triggerSearch.current) {
      const result = fetchSuggestions(debounceValue);
      // fetchSuggestions返回的suggestion为异步结果时，Promise<DataSourceType[]>
      if (result instanceof Promise) {
        setLoading(true)
        result.then(data => {
          setLoading(false)
          setsuggestions(data);
          if(data.length>0)
          setShowDropdown(true)
        })
      }
      else {
        setsuggestions(result);
        setShowDropdown(true)
        if (result.length > 0) {
          setShowDropdown(true)
        } 
      }
    } else {
      setShowDropdown(false)
    }
    sethighlightIndex(-1)
  }, [debounceValue])
  /**
   * 键盘按下去的事件 
   */
  const highlight = (index: number) => {
    if (index < 0) index = 0;
    if (index >= suggestions.length) { index = suggestions.length - 1 }
    sethighlightIndex(index);
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      // 回车键
      case 13:
        if(suggestions[highlightIndex]){
          handleSelect(suggestions[highlightIndex])
        }
        break;
      // 向上的箭头
      case 38:
        highlight(highlightIndex - 1)
        break;
      // 向下的箭头
      case 40:
        highlight(highlightIndex + 1)
        break;
      // esc
      case 27:
        setShowDropdown(false)
        break;
      default:
        break;
    }
  }
  /**
   * @param handleChange 输入框的内容发生变化时
   * 1、输入的不为空，那么就去找下方提示文字的内容
   * 2、找下方提示文字的内容返回的suggestion为异步/同步结果
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(e.target.value);
    // 
    triggerSearch.current = true;
    // 输入的不为空，那么就去找下方提示文字的内容
  }
  // 点中列表中的值，触发一系列事件：
  // 1、选中的值，填充进入菜单
  // 2、隐藏下拉菜单
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value);
    setsuggestions([])
    triggerSearch.current = false;
    if (onSelect) {
      onSelect(item.value);
    }
  }
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value;
  }
  const generateDropdown = () => {
    return (
      <Transition
      style={{ width: '500px' }}
      in={showDropdown || loading}
      animation="zoom-in-top"
      timeout={300}
      onExited={() => {setsuggestions([])}}
    >
      <ul className="viking-suggestion-list">
      { loading &&
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin/>
            </div>
          }
        {suggestions.map((item, index) => {
          const cnames = classNames('suggestion-item', {
            'is-active': index === highlightIndex
          })
          return (
            <li key={index} className={cnames} onClick={() => handleSelect(item)}>
              {renderTemplate(item)}
            </li>
          )
        })}
      </ul>
      </Transition>
    )
  }
  return (
    <div className='viking-auto-complete' ref={componentRef}>
      <Input
        value={inputValue}
        onChange={handleChange}
        {...restProps}
        onKeyDown={handleKeyDown}
      ></Input>
      { generateDropdown()}
    </div>

  )

}
export default AutoComplete;