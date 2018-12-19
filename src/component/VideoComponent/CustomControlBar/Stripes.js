import videojs from 'video.js';
import moment from 'moment';
import 'moment-duration-format';
import './CustomProgressControl';

const Component = videojs.getComponent('Component');

const STRIPES_HEIGHT = 28;

const POSSIBLE_PERIOD = [
  1,
  5,
  10,
  20,
  30,
  60,
  5 * 60,
  10 * 60,
  30 * 60,
  60 * 60,
  10 * 60 * 60,
];

const MAX_LENGTH = 140;

class Stripes extends Component {
  constructor(player, options) {
    super(player, options);
    this.stripes.width = this.player().el().offsetWidth;
    this.stripes.height = STRIPES_HEIGHT;

    this.player().on('loadedmetadata', this.onLoad);
  }

  onLoad = () => {
    const eventsProgressBar = {
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
      mousedown: 'handleMouseDown',
    };

    Object.keys(eventsProgressBar).forEach((key) => {
      this.on(this.stripesWrap, key, this.callProgressBar.bind(this, eventsProgressBar[key]));
    });

    const duration = this.player().duration();
    const period = this.getPeriod(duration, POSSIBLE_PERIOD, this.stripes.width);
    this.period = period;
    this.widthPeriodBlock = (this.stripes.width / duration) * period;
    this.render();
  }

  getPeriod(duration, possiblePeriod, width) {
    let period = possiblePeriod[0];
    for (let i = 1; i < possiblePeriod.length - 1; i++) {
      const possible = possiblePeriod[i];
      const possibleWidth = (width / duration) * possible;
      if (possibleWidth > MAX_LENGTH) {
        break;
      }
      period = possible;
    }
    return period;
  }

  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-stripes-control',
    });
    el.innerHTML = '';
    const stripesWrap = super.createEl('div', {
      className: 'stripesWrap',
    });
    const stripes = super.createEl('canvas', {
      className: 'stripes',
    });
    stripesWrap.appendChild(stripes);
    this.stripes = stripes;
    this.stripesWrap = stripesWrap;
    el.appendChild(stripesWrap);
    return el;
  }

  renderTimes(ctx) {
    const countTimes = (this.stripes.width / this.widthPeriodBlock);
    for (let i = 0; i < countTimes; i++) {
      ctx.textAlign = 'center';
      if (!i) {
        ctx.textAlign = 'left';
      }


      const timeSting = moment.duration.format([
        moment.duration(i * this.period, 'second'),
        moment.duration(1, 'minute'),
        moment.duration(1, 'hour'),
      ], 'd [days] hh:mm:ss')[0];
      ctx.fillText(timeSting, this.widthPeriodBlock * i, 10);
    }
  }

  renderBottom(ctx) {
    ctx.beginPath();
    ctx.strokeStyle = '#e50040';
    ctx.moveTo(0, this.stripes.height - 1);
    ctx.lineTo(this.stripes.width, this.stripes.height - 1);
    ctx.stroke();
  }

  renderBig(ctx, x) {
    ctx.beginPath();
    ctx.strokeStyle = '#e50040';
    ctx.moveTo(x, this.stripes.height - 1);
    ctx.lineTo(x, this.stripes.height - 14);
    ctx.stroke();
  }

  renderSmall(ctx, x) {
    ctx.beginPath();
    ctx.strokeStyle = '#e50040';
    ctx.moveTo(x, this.stripes.height - 1);
    ctx.lineTo(x, this.stripes.height - 9);
    ctx.stroke();
  }

  renderStripes(ctx) {
    this.renderBottom(ctx);
    const distance = this.widthPeriodBlock / 10;
    const count = this.stripes.width / distance;
    for (let i = 0; i < count; i++) {
      if (!(i % 10)) {
        this.renderBig(ctx, i * distance);
      } else {
        this.renderSmall(ctx, i * distance);
      }
    }
  }

  render() {
    const ctx = this.stripes.getContext('2d');
    ctx.clearRect(0, 0, this.stripes.width, this.stripes.height);
    ctx.textAlign = 'left';
    ctx.font = '10px Arial';
    ctx.fillStyle = '#e50040';
    this.renderTimes(ctx);
    this.renderStripes(ctx);
    return 1;
  }

  callProgressBar = (func, event) => {
    const progressBar = this.getChild('CustomProgressControl');
    progressBar[func](event);
  }
}

Stripes.prototype.options_ = {
  children: [
    'CustomProgressControl',
  ],
};

Component.registerComponent('Stripes', Stripes);

export default Stripes;
