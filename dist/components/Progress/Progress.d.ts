import React, { FC } from 'react';
import { ThemeProps } from '../Icon/Icon';
export interface progressProps {
    percent: number;
    strokeheight?: number;
    showText?: boolean;
    styles?: React.CSSProperties;
    theme?: ThemeProps;
}
declare const Progress: FC<progressProps>;
export default Progress;
