import './App.less';
import React from 'react';
import { Anchor, UrlSync } from '@r/platform/components';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Anchor href='/r/cfb'>
          Hello World
        </Anchor>
        <UrlSync/>
      </div>
    );
  }
}
