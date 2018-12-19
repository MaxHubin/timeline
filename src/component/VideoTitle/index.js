import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

class VideoTitle extends PureComponent {
  render() {
    if (!this.props.active) {
      return null;
    }
    return (
      <div className="videoTitle">
        {this.props.active.title}
      </div>
    );
  }
}
export default connect(
  state => ({
    active: state.menu.active,
  }),
)(VideoTitle);
