import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import MenuItem from '../MenuItem';
import { loadPlayerData } from '../../api';

class Menu extends PureComponent {
  onClick = (id) => {
    loadPlayerData(this.props.dispatch, id);
  }

  render() {
    return (
      <div className="menu">
        <div className="menu-title">
          {'Library'}
        </div>
        <div className="menu-links">
          {this.props.items.map(item => (
            <MenuItem
              key={item.id}
              onClick={this.onClick}
              {...item}
              isActive={this.props.active && (item.id === this.props.active.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}
export default connect(
  state => ({
    items: state.menu.items,
    active: state.menu.active,
  }),
)(Menu);
