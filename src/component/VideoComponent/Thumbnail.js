import videojs from 'video.js';

const ThumbnailPlugin = function ThumbnailPlugin() {
  this.on('loadedmetadata', () => {
    const thumbnailEl = document.createElement('div');
    const thumbnailImgEl = document.createElement('img');

    thumbnailEl.className = 'vjs-thumbnail-holder';
    thumbnailEl.appendChild(thumbnailImgEl);
    thumbnailImgEl.className = 'vjs-thumbnail';

    // add the thumbnail to the player
    const seekBar = this.controlBar.progressControl.seekBar;
    seekBar.el().appendChild(thumbnailEl);

    const moveListener = (event) => {
    };

    // update the thumbnail while hovering
    seekBar.on('mousemove', moveListener);
    seekBar.on('touchmove', moveListener);
  });
};


/**
 * register the thubmnails plugin
 */
videojs.plugin('thumbnails', ThumbnailPlugin);

export default ThumbnailPlugin;
