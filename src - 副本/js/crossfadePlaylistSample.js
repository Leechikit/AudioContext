/**
 * @name: crossfadePlaylistSample
 * @description: 播放交叉淡入淡出
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function crossfadePlaylistSample(obj) {
	let CrossfadePlaylistSample = {
		FADE_TIME: 1, // Seconds
		playing: false
	};
	let {
		context,
		BUFFERS
	} = obj;

	CrossfadePlaylistSample.play = function() {
		let ctx = this;
		playHelper(BUFFERS.jam, BUFFERS.crowd);

		function createSource(buffer) {
			let source = context.createBufferSource();
			let gainNode = context.createGain();
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
			let playNow = createSource(bufferNow);
			let source = playNow.source;
			ctx.source = source;
			let gainNode = playNow.gainNode;
			let duration = bufferNow.duration;
			let currTime = context.currentTime;
			// Fade the playNow track in.
			gainNode.gain.linearRampToValueAtTime(0, currTime);
			gainNode.gain.linearRampToValueAtTime(1, currTime + ctx.FADE_TIME);
			// Play the playNow track.
			source.start();
			// At the end of the track, fade it out.
			gainNode.gain.linearRampToValueAtTime(1, currTime + duration - ctx.FADE_TIME);
			gainNode.gain.linearRampToValueAtTime(0, currTime + duration);
			// Schedule a recursive track change with the tracks swapped.
			let recurse = arguments.callee;
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

	function eventBind() {
		document.querySelector('#crossfadePlaylistSample_toggle').addEventListener('click', function(event) {
			event.preventDefault();
			CrossfadePlaylistSample.toggle();
		});
	}

	eventBind();

	return CrossfadePlaylistSample;
}

module.exports = crossfadePlaylistSample;