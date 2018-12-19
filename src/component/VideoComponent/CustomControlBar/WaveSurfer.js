// https://github.com/collab-project/videojs-wavesurfer/pull/38#issuecomment-385286097
import videojs from 'video.js';
import WaveSurferJS from 'wavesurfer.js';

const Component = videojs.getComponent('Component');

class WaveSurfer extends Component {
  constructor(player, options) {
    super(player, options);
    this.audioData = options.audioData;
    this.player().on('loadedmetadata', this.onLoad);
  }

  onLoad = () => {
    const mediaElt = document.querySelector('video');
    this.wavesurfer.load(mediaElt.cloneNode(true), this.audioData);
  }

  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-wave-surfer-control',
    });
    el.innerHTML = '';
    const wavesurferContainer = super.createEl('div', {
      id: 'wavesurfer',
    });
    el.appendChild(wavesurferContainer);
    this.wavesurfer = WaveSurferJS.create({
      container: wavesurferContainer,
      waveColor: '#e50040',
      backend: 'MediaElement',
      cursorColor: 'transparent',
      height: '50',
      barHeight: 4,
      interact: false,
    });

    return el;
  }
}

Component.registerComponent('WaveSurfer', WaveSurfer);

export default WaveSurfer;
