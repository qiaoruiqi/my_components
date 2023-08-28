import { FC, ReactElement } from 'react';
import { InputProps } from '../Input/input';
interface DataSourceObject {
    value: string;
}
export type DataSourceType<T = {}> = T & DataSourceObject;
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    onSelect?: (item: string) => void;
    fetchSuggestions: (keyword: string) => DataSourceType[] | Promise<DataSourceType[]>;
    renderOption?: (item: DataSourceType) => ReactElement;
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
declare const AutoComplete: FC<AutoCompleteProps>;
export default AutoComplete;
