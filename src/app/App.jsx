import './App.less';
import React from 'react';
import Login from './components/login/Login';
import { Anchor, UrlSync } from '@r/platform/components';
import { PageSelector, Page } from '@r/platform/page';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <PageSelector>
          <Page url='/'>
            <div>
              <div>
                <Anchor href='/r/cfb?foo=bar'>Go to r/cfb</Anchor>
              </div>
              <div>
                <Anchor href='/login'>Login</Anchor>
              </div>
            </div>
          </Page>
          <Page url='/r/:subredditName'>
            <Anchor href='/'>Homepage</Anchor>
          </Page>
          <Page url='/login'>
            <Login/>
          </Page>
        </PageSelector>
        <UrlSync/>
      </div>
    );
  }
}
