import React, { PureComponent } from 'react';
import connect from 'react-redux/es/connect/connect';
import VideoComponent from '../VideoComponent';
import { SET_CURRENT_CLUSTER } from '../../constants';

class Player extends PureComponent {
  constructor(props) {
    super(props);
    this.onChangeClusterPlus = this.onChangeCluster.bind(this, 1);
    this.onChangeClusterMinus = this.onChangeCluster.bind(this, -1);
  }

  onChangeCluster(diff) {
    const newCluster = this.props.currentCluster + diff;
    if (this.props.data.clusterAnalysis.find(c => c.mode === newCluster)) {
      this.props.dispatch({
        type: SET_CURRENT_CLUSTER,
        currentCluster: newCluster,
      });
    }
  }

  renderSelect() {
    return (
      <div className="player-select">
        <div className="title">Clusters</div>

        <div className="count">{this.props.currentCluster}</div>
        <div className="controls">
          <div className="plus" onClick={this.onChangeClusterPlus}>+</div>
          <div className="minus" onClick={this.onChangeClusterMinus}>-</div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.data) {
      return null;
    }
    return (
      <div className="player">
        <VideoComponent
          key={this.props.data.id}
          {...this.props.data}
          clustersIndexes={this.props.clustersIndexes}
          currentCluster={this.props.currentCluster}
        />
        {this.renderSelect()}
      </div>
    );
  }
}
export default connect(
  state => ({
    data: state.player.data,
    currentCluster: state.player.currentCluster,
    clustersIndexes: state.player.clustersIndexes,
  }),
)(Player);
