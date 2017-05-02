/**
 * @name: crossfadePlaylistSample
 * @description: 播放交叉淡入淡出
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function crossfadePlaylistSample(obj) {
	var CrossfadePlaylistSample = {
		FADE_TIME: 1, // Seconds
		playing: false
	};
	var {
		context,
		BUFFERS
	} = obj;

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
			gainNode.gain.linearRampToValueAtTime(1, currTime + duration - ctx.FADE_TIME);
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