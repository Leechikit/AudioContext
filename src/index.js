// Keep track of all playing sources
var SOURCES = [];
// Keep track of all loaded buffers.
var BUFFERS = {};
// Page-wide audio context.
var context = null;

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
  kick: '../sounds/kick.wav',
  snare: '../sounds/snare.wav',
  hihat: '../sounds/hihat.wav',
  jam: '../sounds/br-jam-loop.wav',
  crowd: '../sounds/clapping-crowd.wav',
  drums: '../sounds/blueyellow.wav',
  organ: '../sounds/organ-echo-chords.wav',
  techno: '../sounds/techno.mp3'
};

// Stops all playing sources
function stopSources() {
  for (var i = 0; i < SOURCES.length; i++) {
    var source = SOURCES[i];
    source.noteOff(0);
  }
  SOURCES = [];
}

// Loads all sound samples into the buffers object.
function loadBuffers() {
  // Array-ify
  var names = [];
  var paths = [];
  for (var name in BUFFERS_TO_LOAD) {
    var path = BUFFERS_TO_LOAD[name];
    names.push(name);
    paths.push(path);
  }
  bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      BUFFERS[name] = buffer;
    }
  });
  bufferLoader.load();
}

document.addEventListener('DOMContentLoaded', function() {
  try {
    context = new (window.AudioContext || window.webkitAudioContext)();
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser");
  }
  loadBuffers();
});

/**
 * 播放音频
 *
 */
window.RhythmSample = {
};

RhythmSample.play = function() {
  var kick = BUFFERS.kick;
  var snare = BUFFERS.snare;
  var hihat = BUFFERS.hihat;
  function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  }



  // 立刻播放这段节奏
  var startTime = context.currentTime + 0.100;
  var tempo = 80; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;

  // 播放两个主音调:
  for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // 播放打击音1和5
    playSound(kick, time);
    playSound(kick, time + 4 * eighthNoteTime);

    // 播放3，7
    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);

    // 播放伴奏音.
    for (var i = 0; i < 8; ++i) {
      playSound(hihat, time + i * eighthNoteTime);
    }
  }
};

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

/**
 * 混合两个音频
 *
 */
window.CrossfadeSample = {};

CrossfadeSample.play = function() {
  // Create two sources.
  this.ctl1 = createSource(BUFFERS.drums);
  this.ctl2 = createSource(BUFFERS.organ);
  // Mute the second source.
  this.ctl1.gainNode.gain.value = 0;
  // Start playback in a loop
  this.ctl1.source.start();
  this.ctl2.source.start();
  // Set the initial crossfade to be just source 1.
  //this.crossfade({});

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = buffer;
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }
};

CrossfadeSample.stop = function() {
  this.ctl1.source.stop();
  this.ctl2.source.stop();
};

// Fades between 0 (all source 1) and 1 (all source 2)
CrossfadeSample.crossfade = function(element) {
  var x = parseInt(element.value) / parseInt(element.max);
  // Use an equal-power crossfading curve:
  var gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
  var gain2 = 0.5 * (1.0 + Math.cos((1.0 - x) * Math.PI));
  this.ctl1.gainNode.gain.value = gain1;
  this.ctl2.gainNode.gain.value = gain2;
};

CrossfadeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};

/**
 * 播放交叉淡入淡出
 *
 */
window.CrossfadePlaylistSample = {
  FADE_TIME: 1, // Seconds
  playing: false
};

CrossfadePlaylistSample.play = function() {
  var ctx = this;
  playHelper(BUFFERS.jam, BUFFERS.crowd);

  function createSource(buffer) {
    var source = context.createBufferSource();
    var gainNode = context.createGain();
    source.buffer = buffer;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);

    return {
      source: source,
      gainNode: gainNode
    };
  }

  function playHelper(bufferNow, bufferLater) {
    var playNow = createSource(bufferNow);
    var source = playNow.source;
    ctx.source = source;
    var gainNode = playNow.gainNode;
    var duration = bufferNow.duration;
    var currTime = context.currentTime;
    // Fade the playNow track in.
    gainNode.gain.linearRampToValueAtTime(0, currTime);
    gainNode.gain.linearRampToValueAtTime(1, currTime + ctx.FADE_TIME);
    // Play the playNow track.
    source.start();
    // At the end of the track, fade it out.
    gainNode.gain.linearRampToValueAtTime(1, currTime + duration-ctx.FADE_TIME);
    gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
    // Schedule a recursive track change with the tracks swapped.
    var recurse = arguments.callee;
    ctx.timer = setTimeout(function() {
      recurse(bufferLater, bufferNow);
    }, (duration - ctx.FADE_TIME) * 1000);
  }

};

CrossfadePlaylistSample.stop = function() {
  clearTimeout(this.timer);
  this.source.stop();
};

CrossfadePlaylistSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};

/**
 * 给音乐加简单特效
 *
 */
window.FilterSample = {
  FREQ_MUL: 7000,
  QUAL_MUL: 30,
  playing: false
};

FilterSample.play = function() {
  // Create the source.
  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;
  // Create the filter.
  var filter = context.createBiquadFilter();
  filter.type = 0; // LOWPASS
  filter.frequency.value = 5000;
  // Connect source to filter, filter to destination.
  source.connect(filter);
  filter.connect(context.destination);
  // Play!
  source.start();
  source.loop = true;
  // Save source and filterNode for later access.
  this.source = source;
  this.filter = filter;
};

FilterSample.stop = function() {
  this.source.stop();
};

FilterSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};

FilterSample.changeFrequency = function(element) {
  // Clamp the frequency between the minimum value (40 Hz) and half of the
  // sampling rate.
  var minValue = 40;
  var maxValue = context.sampleRate / 2;
  // Logarithm (base 2) to compute how many octaves fall in the range.
  var numberOfOctaves = Math.log(maxValue / minValue) / Math.LN2;
  // Compute a multiplier from 0 to 1 based on an exponential scale.
  var multiplier = Math.pow(2, numberOfOctaves * (element.value - 1.0));
  // Get back to the frequency value between min and max.
  this.filter.frequency.value = maxValue * multiplier;
};

FilterSample.changeQuality = function(element) {
  this.filter.Q.value = element.value * this.QUAL_MUL;
};

FilterSample.toggleFilter = function(element) {
  this.source.disconnect(0);
  this.filter.disconnect(0);
  // Check if we want to enable the filter.
  if (element.checked) {
    // Connect through the filter.
    this.source.connect(this.filter);
    this.filter.connect(context.destination);
  } else {
    // Otherwise, connect directly.
    this.source.connect(context.destination);
  }
};