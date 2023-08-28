import { Header } from './Header';
var meta = {
    title: 'Example/Header',
    component: Header,
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
    tags: ['autodocs'],
    parameters: {
        // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
        layout: 'fullscreen',
    },
};
export default meta;
export var LoggedIn = {
    args: {
        user: {
            name: 'Jane Doe',
        },
    },
};
export var LoggedOut = {};
