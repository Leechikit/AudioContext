/**
 * @name: scriptProcessor
 * @description: 通过javascript直接处理音频
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function scriptProcessor(obj) {
    var myScript = document.querySelector('script');
    var myPre = document.querySelector('pre');
    var playButton = document.querySelector('#scriptProcessor_play');
    var {
        context,
        BUFFERS
    } = obj;



    // wire up play button
    playButton.onclick = function() {
        // Create AudioContext and buffer source
        var source = context.createBufferSource();
        source.buffer = BUFFERS.techno;

        // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
        var scriptNode = context.createScriptProcessor(4096, 1, 1);

        // load in an audio track via XHR and decodeAudioData

        // Give the node a function to process audio events
        scriptNode.onaudioprocess = function(audioProcessingEvent) {
            // The input buffer is the song we loaded earlier
            var inputBuffer = audioProcessingEvent.inputBuffer;

            // The output buffer contains the samples that will be modified and played
            var outputBuffer = audioProcessingEvent.outputBuffer;

            // Loop through the output channels (in this case there is only one)
            for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                var inputData = inputBuffer.getChannelData(channel);
                var outputData = outputBuffer.getChannelData(channel);

                // Loop through the 4096 samples
                for (var sample = 0; sample < inputBuffer.length; sample++) {
                    // make output equal to the same as the input
                    outputData[sample] = inputData[sample];

                    // add noise to each output sample
                    outputData[sample] += ((Math.random() * 2) - 1) * 0.2;
                }
            }
        }
        source.connect(scriptNode);
        scriptNode.connect(context.destination);
        source.start();
    }

    // // When the buffer source stops playing, disconnect everything
    // source.onended = function() {
    //     source.disconnect(scriptNode);
    //     scriptNode.disconnect(audioCtx.destination);
    // }
}

module.exports = scriptProcessor;