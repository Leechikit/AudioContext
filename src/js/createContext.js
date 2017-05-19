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
  var bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (var i = 0; i < bufferList.length; i++) {
      var buffer = bufferList[i];
      var name = names[i];
      BUFFERS[name] = buffer;
    }
  });
  bufferLoader.load();
}

function init(){
  try {
    context = new (window.AudioContext || window.webkitAudioContext)();
  }
  catch(e) {
    alert("Web Audio API is not supported in this browser");
  }
  loadBuffers();
}

init();

exports.BUFFERS = BUFFERS;
exports.context = context;