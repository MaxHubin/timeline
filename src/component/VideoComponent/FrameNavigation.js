import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const ControlBar = videojs.getComponent('ControlBar');

class FrameNavigation extends Component {
  constructor(player, options) {
    super(player, options);
    this.timestamps = options.timestamps;
    this.player().on('loadedmetadata', this.init);
  }

  init =() => {
    const controlBar = this.player().getChild('ControlBar');
    controlBar.el().insertBefore(this.timelineLeft, controlBar.getChild('PlayToggle').el());

    this.player().getChild('ControlBar').el().appendChild(this.timelineRight);
    this.on(this.timelineLeft, 'mousedown', this.handleChangeFrame.bind(this, -1));
    this.on(this.timelineRight, 'mousedown', this.handleChangeFrame.bind(this, 1));
  }

  toFrame(frame) {
    return this.player().currentTime(this.timestamps[frame]);
  }

  handleChangeFrame = (diff) => {
    let currentFrame = 0;
    const currentTime = this.player().currentTime();
    for (let i = 0; i < (this.timestamps.length - 1); i += 1) {
      if ((this.timestamps[i] < (currentTime + 0.000001)) && (this.timestamps[i + 1] > (currentTime + 0.000001))) {
        currentFrame = i;
        break;
      }
    }
    this.toFrame(currentFrame + diff);
  }

  createEl() {
    const el = this.el() || super.createEl('div', {
      className: 'vjs-frameNavigation-control vjs-control',
    });
    el.innerHTML = '';
    const timelineLeft = super.createEl('div', {
      className: 'timelineLeft  fas fa-step-backward',
    });
    const timelineRight = super.createEl('div', {
      className: 'timelineRight  fas fa-step-forward',
    });

    this.timelineLeft = timelineLeft;
    this.timelineRight = timelineRight;
    return el;
  }
}

Component.registerComponent('FrameNavigation', FrameNavigation);

ControlBar.prototype.options_.children.push('FrameNavigations');
export default FrameNavigation;
