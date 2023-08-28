import React, { useState } from 'react';
import Button, { ButtonSize, ButtonType } from "./components/Button/button";
import Menu from './components/Menu/menu'
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';
import Transition from './components/Transition/transition';
import { Input } from './components/Input/input';
import Icon from './components/Icon/Icon';
// import Tabs from './components/Tabs/Tabs';
// import TabItem from './components/Tabs/TabItem';
import AutoComplete, { DataSourceType } from './components/AutoComplete/autocomplete';
const App: React.FC = () => {
  const [show, setShow] = useState(false);
  const [value, setvalue] = useState('')
  //  const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins',
  // 'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando']
  // interface LakerPlayerProps {
  //   value: string;
  //   number: number;
  // }
  //   const lakersWithNumber = [
  //   {value: 'bradley', number: 11},
  //   {value: 'pope', number: 1},
  //   {value: 'caruso', number: 4},
  //   {value: 'cook', number: 2},
  //   {value: 'cousins', number: 15},
  //   {value: 'james', number: 23},
  //   {value: 'AD', number: 3},
  //   {value: 'green', number: 14},
  //   {value: 'howard', number: 39},
  //   {value: 'kuzma', number: 0},
  // ]
  interface GithubUserProps {
    login: string;
    url: string;
    avatar_url: string;
  }
  const handlefetch = (query: string) => {
    // 针对字符串类型的
    // return lakers.filter(name=>name.includes(query))
    // 针对对象类型的
    // return lakersWithNumber.filter(name=>name.value.includes(query))
    // 针对异步结果
    return fetch(`https://api.github.com/search/users?q=${query}`)
      .then(res => res.json())
      .then(({ items }) => {
        console.log(items);
        const formatItems = items.slice(0, 10).map((item:any) => ({
          value: item.login, ...item }))
          return formatItems
      })
  }
  const renderOption = (item: DataSourceType) => {
   const githubItem = item as DataSourceType<GithubUserProps>
    return (
      <>
        <h2>
          Name:{githubItem.value}
        </h2>
        <p>url:{githubItem.url}</p>

      </>
    )
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* <AutoComplete
          style={{ width: '500px' }}
          fetchSuggestions={handlefetch}
          onSelect={(item) => { console.log('selected', item) }}
          renderOption={renderOption}
        >

        </AutoComplete> */}
        {/* <Input style={{width: '300px'}} value={value} onChange={e=>{setvalue(e.target.value)}}></Input> */}
        {/* 
      <Icon icon={"search"}></Icon>
        <Menu defaultIndex={'2'} onselect={(index)=>{alert(index)}} defaultOpenmenu={['2']}>
          <MenuItem >cool link</MenuItem>
          <MenuItem  disabled>cool link 2</MenuItem>
          <SubMenu title="dropdown">
          <MenuItem >dropdown 1</MenuItem>
          <MenuItem  >dropdown2</MenuItem>
          </SubMenu>
          <MenuItem >cool link 3</MenuItem>
        </Menu> */}

        {/* <Tabs defaultIndex={0}>
          <TabItem label='card1'></TabItem>
          <TabItem label='card2' disabled></TabItem>
        </Tabs> */}
        <Button disabled>hello</Button>
        <Button onClick={(e) => { e.preventDefault(); alert(123); }} btnType={'primary'} size={'lg'}> Large Primary </Button>
        <Button btnType={'primary'} size={'sm'}> small Primary  </Button>
        <Button btnType={'link'} href="http://www.baidu.com" disabled>Hello</Button>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

        {/* <Button size='lg' onClick={()=>{setShow(!show)}}>toggle </Button>
        <Transition in={show} timeout={300} animation='zoom-in-left'>
          <div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        </div>
        </Transition> */}
      </header>
    </div>
  );
}

export default App;
