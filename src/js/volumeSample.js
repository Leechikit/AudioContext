/**
 * 开始暂停，设置音频音量
 *
 */
window.VolumeSample = {
};

// Gain node needs to be mutated by volume control.
VolumeSample.gainNode = null;

VolumeSample.play = function() {
  this.gainNode = context.createGain();
  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;

  // Connect source to a gain node
  source.connect(this.gainNode);
  // Connect gain node to destination
  this.gainNode.connect(context.destination);
  // Start playback in a loop
  source.loop = true;
  source.start();
  this.source = source;
};

VolumeSample.changeVolume = function(element) {
  var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  this.gainNode.gain.value = fraction * fraction;
};

VolumeSample.stop = function() {
  this.source.stop();
};

VolumeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};