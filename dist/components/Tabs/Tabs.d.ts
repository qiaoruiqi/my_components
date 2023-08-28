import React from 'react';
type SelectCallback = (selectedIndex: number) => void;
export interface TabsProps {
    defaultIndex?: number;
    onSelect?: SelectCallback;
    className?: string;
    styles?: React.CSSProperties;
    children?: React.ReactNode;
}
interface TabsContext {
    index: number;
    onSelect?: SelectCallback;
}
export declare const ItemContext: React.Context<TabsContext>;
declare const Tabs: React.FC<TabsProps>;
export default Tabs;
