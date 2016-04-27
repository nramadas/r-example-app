import './App.less';
import React from 'react';
import Login from './components/login/Login';
import { Anchor, UrlSync } from '@r/platform/components';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Login />
        {/*<Anchor href='/r/cfb?foo=bar'>
          Hello World
        </Anchor>*/}
        <UrlSync/>
      </div>
    );
  }
}
