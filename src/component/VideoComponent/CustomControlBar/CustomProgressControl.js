import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const ProgressControl = videojs.getComponent('ProgressControl');

class CustomProgressControl extends ProgressControl {
}

Component.registerComponent('CustomProgressControl', CustomProgressControl);

export default CustomProgressControl;
