/**
 * @name: rhythmSample
 * @description: 播放音频
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function rhythmSample(obj) {
    let RhythmSample = {};
    let {
        context,
        BUFFERS
    } = obj;

    RhythmSample.play = function() {
        let kick = BUFFERS.kick;
        let snare = BUFFERS.snare;
        let hihat = BUFFERS.hihat;

        function playSound(buffer, time) {
            let source = context.createBufferSource();
            source.buffer = buffer;
            source.playbackRate.value = 1;
            source.connect(context.destination);
            source.start();
            source.onended = () => {
                console.log('end');
            }
        }
        playSound(BUFFERS.jam);


        // 立刻播放这段节奏
        let startTime = context.currentTime + 0.100;
        let tempo = 80; // BPM (beats per minute)
        let eighthNoteTime = (60 / tempo) / 2;

        // 播放两个主音调:
        // for (let bar = 0; bar < 2; bar++) {
        //     let time = startTime + bar * 8 * eighthNoteTime;
        //     // 播放打击音1和5
        //     playSound(kick, time);
        //     playSound(kick, time + 4 * eighthNoteTime);

        //     // 播放3，7
        //     playSound(snare, time + 2 * eighthNoteTime);
        //     playSound(snare, time + 6 * eighthNoteTime);

        //     // 播放伴奏音.
        //     for (let i = 0; i < 8; ++i) {
        //         playSound(hihat, time + i * eighthNoteTime);
        //     }
        // }
    };

    function eventBind() {
        document.querySelector('#rhythmSample_play').addEventListener('click', function(event) {
            event.preventDefault();
            RhythmSample.play();
        });
    }

    eventBind();

    return RhythmSample
}

module.exports = rhythmSample;