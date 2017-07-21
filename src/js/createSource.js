/**
 * @name: createSource
 * @description: 创建Source对象
 * @author: lizijie
 * @update: 
 */

import audioContext from './audioContext.js';
import bufferList from './bufferList.js';

let buffers = bufferList;

function Source(obj) {
	this.config = obj;
}

/**
 * 开始播放
 *
 * @param: {Number} second 播放位置
 */
Source.prototype.start = function(second = 0) {
	if (!this.bufferSource) {
		this.bufferSource = audioContext.createBufferSource();
		this.gainNode = audioContext.createGain();
		this.filter = audioContext.createBiquadFilter();
		this.filter.type = 'lowpass';
		this.filter.frequency.value = 5000;
		this.bufferSource.buffer = buffers[this.config.soundName];
		this.bufferSource.loop = this.config.loop;
		this.bufferSource.connect(this.gainNode);
		this.gainNode.connect(this.filter);
		this.filter.connect(audioContext.destination);
		this.bufferSource.onended = () => {
			this.bufferSource = null;
		}

		second = second > this.bufferSource.buffer.duration ? 0 : second;
		this.bufferSource.start(0, second);
	}
}

/**
 * 停止播放
 *
 */
Source.prototype.stop = function() {
	this.bufferSource && this.bufferSource.stop();
}

/**
 * 控制音量
 *
 * @param: {Number} value 音量
 */
Source.prototype.controlVolume = function(value) {
	this.bufferSource && (this.gainNode.gain.value = value);
}

/**
 * 控制播放速度
 *
 * @param: {Number} rate 原速度的倍数
 */
Source.prototype.controlRate = function(rate) {
	this.bufferSource && (this.bufferSource.playbackRate.value = rate);
}

/**
 * 控制播放频率
 *
 * @param: {Number} value 频率
 */
Source.prototype.controlFrequency = function(value) {
	this.bufferSource && (this.filter.frequency.value = value);
}

export default Source;