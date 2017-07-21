// Keep track of all loaded buffers.
let BUFFERS = {};
// Page-wide audio context.
let context = null;

// An object to track the buffers to load {name: path}
let BUFFERS_TO_LOAD = {
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
  let names = [];
  let paths = [];
  for (let name in BUFFERS_TO_LOAD) {
    let path = BUFFERS_TO_LOAD[name];
    names.push(name);
    paths.push(path);
  }
  let bufferLoader = new BufferLoader(context, paths, function(bufferList) {
    for (let i = 0; i < bufferList.length; i++) {
      let buffer = bufferList[i];
      let name = names[i];
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