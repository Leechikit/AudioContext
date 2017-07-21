/**
 * @name: crossfadeSample
 * @description: 混合两个音频
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */

function crossfadeSample(obj) {
	let CrossfadeSample = {};
	let {
        context,
        BUFFERS
    } = obj;

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
			let source = context.createBufferSource();
			let gainNode = context.createGain();
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
		let x = parseInt(element.value) / parseInt(element.max);
		// Use an equal-power crossfading curve:
		let gain1 = 0.5 * (1.0 + Math.cos(x * Math.PI));
		let gain2 = 0.5 * (1.0 + Math.cos((1.0 - x) * Math.PI));
		this.ctl1.gainNode.gain.value = gain1;
		this.ctl2.gainNode.gain.value = gain2;
	};

	CrossfadeSample.toggle = function() {
		this.playing ? this.stop() : this.play();
		this.playing = !this.playing;
	};

	function eventBind(){
		document.querySelector('#crossfadeSample_toggle').addEventListener('click',function(event){
			event.preventDefault();
			CrossfadeSample.toggle();
		});
		document.querySelector('#crossfadeSample_crossfade').addEventListener('change',function(event){
			event.preventDefault();
			CrossfadeSample.crossfade(event.target);
		});
	}
	eventBind();

	return CrossfadeSample;
}

module.exports = crossfadeSample;