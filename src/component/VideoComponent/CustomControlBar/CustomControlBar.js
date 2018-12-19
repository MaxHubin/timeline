import videojs from 'video.js';
import './Stripes';
import './WaveSurfer';
import './Timeline';


const Component = videojs.getComponent('Component');

class CustomControlBar extends Component {
  createEl() {
    return super.createEl('div', {
      className: 'vjs-custom-control-bar',
      dir: 'ltr',
    });
  }
}

CustomControlBar.prototype.options_ = {
  children: [
    'Stripes',
    'WaveSurfer',
    'Timeline',
  ],
};

Component.registerComponent('CustomControlBar', CustomControlBar);

export default CustomControlBar;
