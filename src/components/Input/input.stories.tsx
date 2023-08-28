import React, { useState } from 'react'
import type { Meta, StoryObj, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions'
import { Input } from './input'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(fas)
const meta = {
  title: 'Example/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const defaultInput: Story = {
  args: {
    style:{width: '300px'},
    placeholder:"placeholder",
    onChange:action('changed')
  },
};

export const disabledInput: Story = {
  args: {
    style:{width: '300px'},
    placeholder:"disabled input",
    disabled:true
  },
};

export const iconInput: Story = {
  args: {
    style:{width: '300px'},
    placeholder:"input with icon",
    icon:"search"
  },
};


// const sizeInput = () => (
//   <>
//     <Input
//       style={{width: '300px'}}
//       defaultValue="large size"
//       size="lg"
//     />
//     <Input
//       style={{width: '300px'}}
//       placeholder="small size"
//       size="sm"
//     />
//   </>
// )

// const pandInput = () => (
//   <>
//     <Input
//       style={{width: '300px'}}
//       defaultValue="prepend text"
//       prepend="https://"
//     />
//     <Input
//       style={{width: '300px'}}
//       defaultValue="google"
//       append=".com"
//     />
    
//   </>
// )


