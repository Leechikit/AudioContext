/**
 * @name: scriptProcessor
 * @description: 通过javascript直接处理音频
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function scriptProcessor(obj) {
    let myScript = document.querySelector('script');
    let myPre = document.querySelector('pre');
    let playButton = document.querySelector('#scriptProcessor_play');
    let {
        context,
        BUFFERS
    } = obj;



    // wire up play button
    playButton.onclick = function() {
        // Create AudioContext and buffer source
        let source = context.createBufferSource();
        source.buffer = BUFFERS.techno;

        // Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
        let scriptNode = context.createScriptProcessor(4096, 1, 1);

        // load in an audio track via XHR and decodeAudioData

        // Give the node a function to process audio events
        scriptNode.onaudioprocess = function(audioProcessingEvent) {
            // The input buffer is the song we loaded earlier
            let inputBuffer = audioProcessingEvent.inputBuffer;

            // The output buffer contains the samples that will be modified and played
            let outputBuffer = audioProcessingEvent.outputBuffer;

            // Loop through the output channels (in this case there is only one)
            for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
                let inputData = inputBuffer.getChannelData(channel);
                let outputData = outputBuffer.getChannelData(channel);

                // Loop through the 4096 samples
                for (let sample = 0; sample < inputBuffer.length; sample++) {
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