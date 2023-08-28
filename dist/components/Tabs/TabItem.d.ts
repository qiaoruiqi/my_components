import React from 'react';
export interface TabItemProps {
    index?: number;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    label: string;
}
declare const TabItem: React.FC<TabItemProps>;
export default TabItem;
