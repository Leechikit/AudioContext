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