import React, { PureComponent } from 'react';
import Menu from '../Menu';
import VideoTitle from '../VideoTitle';

class Layout extends PureComponent {
  render() {
    return (
      <div className="layout">
        <div className="layout-menu">
          <Menu />
        </div>
        <div className="layout-content">
          <div className="layout-videoTitle">
            <VideoTitle />
          </div>
          <div className="layout-player">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
export default Layout;
