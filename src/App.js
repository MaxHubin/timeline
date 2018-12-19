import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Layout from './component/Layout';
import Player from './component/Player';
import { loadMenu } from './api';

class App extends PureComponent {
  componentWillMount() {
    loadMenu(this.props.dispatch);
  }

  render() {
    return (
      <Layout>
        <Player />
      </Layout>
    );
  }
}

export default connect()(App);
