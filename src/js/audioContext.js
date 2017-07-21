/**
 * @name: audioContext
 * @description: 获取AudioContext对象
 * @author: lizijie
 * @update: 
 */

let audioContext;

try {
	audioContext = new(window.AudioContext || window.webkitAudioContext)();
} catch (e) {
	alert("Web Audio API is not supported in this browser");
}

export default audioContext;