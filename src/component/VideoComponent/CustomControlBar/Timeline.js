import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const ControlBar = videojs.getComponent('ControlBar');

const HEIGHT_PIXEL = 50;

class Timeline extends Component {
  constructor(player, options) {
    super(player, options);
    this.timestamps = options.timestamps;
    this.startCluster = options.startCluster;
    this.player().on('loadedmetadata', this.init);
  }

  init =() => {
    this.timeline.width = this.player().el().offsetWidth;
    this.timeline.height = HEIGHT_PIXEL;

    this.pixelMap = [{
      start: 0,
      end: this.timeline.width,
      startFrame: 0,
    }];

    this.setCluster(null, this.startCluster);
    this.on(this.timeline, 'mousedown', this.handleMouseDown);

    this.on(this.player(), 'setCluster', this.setCluster);
  }

  toFrame(frame) {
    return this.player().currentTime(this.timestamps[frame - 1]);
  }

  handleMouseDown = (e) => {
    const frame = this.pixelMap.find(val => ((val.start <= e.offsetX) && (val.end >= e.offsetX))).startFrame;
    this.toFrame(frame);
  }


  createEl() {
    return this.createTimeLine();
  }

  createTimeLine() {
    const el = this.el() || super.createEl('div', {
      className: 'vjs-timeline-control vjs-control',
    });
    el.innerHTML = '';
    const timelineWrap = super.createEl('div', {
      className: 'timelineWrap',
    });
    const timeline = super.createEl('canvas', {
      className: 'timeline',
    });

    timelineWrap.appendChild(timeline);

    el.appendChild(timelineWrap);
    this.timeline = timeline;
    return el;
  }

  toPixel(frame) {
    const sec = this.timestamps[frame - 1];
    return (this.timeline.width / this.player().duration()) * sec;
  }

  drawCluster(ctx, cluster, nextCluster) {
    ctx.beginPath();
    const start = cluster ? this.toPixel(cluster.clusterStartFrame) : 0;
    const end = nextCluster ? this.toPixel(nextCluster.clusterStartFrame) : this.timeline.width;
    this.pixelMap.push({
      start,
      end,
      startFrame: cluster ? cluster.clusterStartFrame : 1,
    });
    ctx.fillStyle = cluster ? cluster.clusterColor : '#ccc';
    ctx.fillRect(start, 0, end, 150);
    if (cluster) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '10px Arial';
      ctx.fillStyle = '#fff';

      ctx.fillText(cluster.clusterClass, (start + end) / 2, HEIGHT_PIXEL / 2);
    }
  }

  setCluster = (event, data) => {
    const clusters = data.clusters;
    const ctx = this.timeline.getContext('2d');
    ctx.clearRect(0, 0, this.timeline.width, this.timeline.height);
    this.pixelMap = [];
    for (let i = 0; i < clusters.length; i += 1) {
      const cluster = clusters[i];
      const nextCluster = clusters[i + 1];
      this.drawCluster(ctx, cluster, nextCluster);
    }
  };
}

Component.registerComponent('Timeline', Timeline);
ControlBar.prototype.options_.children.push('timeline');

export default Timeline;
