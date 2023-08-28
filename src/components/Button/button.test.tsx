import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button, { ButtonProps, ButtonSize, ButtonType } from './button'
const defaultProps = {
  onClick: jest.fn()
}

const testProps: ButtonProps = {
  btnType: 'primary',
  size: 'lg',
  className: 'class'
}
const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn()
}
// test ('our first react test case',()=>{
//   const wrapper = render(<Button>Nice</Button>)
//   const element = wrapper.queryByText('Nice')
//   expect(element).toBeTruthy()
//   expect(element).toBeInTheDocument();//判断组件是否在文档中
// })

describe('test Button component', () => {
  it('should render the correct default button', () => {
    const wrapper = render(<Button {...defaultProps}>Nice</Button>)
    // getByText 返回htmlelement，queryByText 返回null 或者 htmlelement
    const element = wrapper.getByText('Nice')  as HTMLButtonElement
    expect(element).toBeInTheDocument();//判断组件是否在文档中
    expect(element.tagName).toEqual('BUTTON')
    expect(element).toHaveClass('btn btn-default')
    expect(element.disabled).toBeFalsy();
    fireEvent.click(element)
    expect(defaultProps.onClick).toHaveBeenCalled()
  })
  it('should render the correct component based on different props', () => {
    const wrapper = render(<Button {...testProps}>Nice</Button>)
    // getByText 返回htmlelement，queryByText 返回null 或者 htmlelement
    const element = wrapper.getByText('Nice')
    expect(element).toBeInTheDocument();//判断组件是否在文档中
    expect(element).toHaveClass('btn btn-primary btn-lg class')
  })
  it('should render a link when btnType equals link and href is provided', () => {
    const wrapper = render(<Button btnType={'link'} href='http://dummyurl'>Link</Button>)
    // getByText 返回htmlelement，queryByText 返回null 或者 htmlelement
    const element = wrapper.getByText('Link');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual('A')
    expect(element).toHaveClass('btn btn-link')
  })
  it('should render disabled button when disabled set to true', () => {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>)
    // getByText 返回htmlelement，queryByText 返回null 或者 htmlelement
    const element = wrapper.getByText('Nice') as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element.disabled).toBeTruthy()
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  })
})
