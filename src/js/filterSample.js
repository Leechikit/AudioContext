/**
 * @name: filterSample
 * @description: 给音乐加简单特效
 * @author: lizijie(lizijie@yy.com)
 * @update: 
 */
function filterSample(obj) {
	var FilterSample = {
		FREQ_MUL: 7000,
		QUAL_MUL: 30,
		playing: false
	};
	var {
		context,
		BUFFERS
	} = obj;

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
		this.filter.gain.value = element.value * this.QUAL_MUL;
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

	function eventBind(){
		document.querySelector('#filterSample_toggle').addEventListener('click',function(event){
			event.preventDefault();
			FilterSample.toggle();
		});
		document.querySelector('#filterSample_toggleFilter').addEventListener('change',function(event){
			event.preventDefault();
			FilterSample.toggleFilter(event.target);
		});
		document.querySelector('#filterSample_changeFrequenct').addEventListener('change',function(event){
			event.preventDefault();
			FilterSample.changeFrequency(event.target);
		});
		document.querySelector('#filterSample_changeQuality').addEventListener('change',function(event){
			event.preventDefault();
			FilterSample.changeQuality(event.target);
		});
	}

	eventBind();

	return FilterSample;
}

module.exports = filterSample;