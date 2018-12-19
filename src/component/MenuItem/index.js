import React, { PureComponent } from 'react';

class MenuItem extends PureComponent {
  onClick = () => {
    this.props.onClick(this.props.id);
  }

  render() {
    return (
      <div className={`menu-item ${this.props.isActive ? 'active' : ''}`} onClick={this.onClick}>
        <div className="preview">
          <img alt={this.props.title} className="preview-image" src={this.props.image} />
        </div>
        <div>{this.props.title}</div>
        <div>{this.props.timeString}</div>
      </div>
    );
  }
}
export default MenuItem;
