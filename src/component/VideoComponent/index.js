import React, { PureComponent } from 'react';
import videojs from 'video.js';
import './CustomControlBar/CustomControlBar';
import './FrameNavigation';

class VideoComponent extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
    };

    this.videoPlayer = null;
    this.options = {
      autoplay: false,
      controls: true,
      //   plugins: {
      //     thumbnails: {},
      // /  },

      CustomControlBar: {
        children: {
          Stripes: {},
          WaveSurfer: { audioData: this.props.audioData },
          Timeline: {
            timestamps: this.props.timestamps,
            startCluster: this.getClusters(this.props.currentCluster),
          },
        },
      },
      controlBar: {
        children: {
          volumePanel: {
            inline: false,
          },
          FullscreenToggle: {},
          FrameNavigation: { timestamps: this.props.timestamps },
          playToggle: {},
          remainingTimeDisplay: {},
        },
      },
      sources: [{
        src: props.url,
        type: 'video/mp4',
      }],
    };
  }

  componentDidMount() {
    this.playerLib = videojs(this.videoPlayer, this.options);
    this.playerLib.on('loadedmetadata', () => this.setState({ hidden: false }));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.currentCluster !== this.props.currentCluster) {
      this.playerLib.trigger('setCluster', {
        clusters: this.getClusters(nextProps.currentCluster),
      });
    }
  }

  getClusters(currentCluster, clusterAnalysis = this.props.clusterAnalysis) {
    console.log(currentCluster);
    return clusterAnalysis.find(cl => cl.mode === currentCluster)
  }
  render() {
    return (
      <div style={{ hidden: this.state.hidden }}>
        <div data-vjs-player>
          <video
            ref={(videoPlayer) => { this.videoPlayer = videoPlayer; }}
            className="video-js"
          >
            {this.props.children}
          </video>
        </div>
      </div>
    );
  }
}
export default VideoComponent;
