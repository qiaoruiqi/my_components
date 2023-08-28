import { Button } from '../../stories/Button';
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
var meta = {
    title: 'Example/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: { control: 'color' },
    },
};
export default meta;
// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export var Primary = {
    args: {
        primary: true,
        label: 'Button',
    },
};
export var Secondary = {
    args: {
        label: 'Button',
    },
};
export var Large = {
    args: {
        size: 'large',
        label: 'Button',
    },
};
export var Small = {
    args: {
        size: 'small',
        label: 'Button',
    },
};
export var myButton = {
    args: {
        primary: true,
        label: 'Button',
    },
};
