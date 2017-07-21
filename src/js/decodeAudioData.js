/**
 * @name: decodeAudioData
 * @description: 异步解码音频文件
 * @author: lizijie
 * @update: 
 */

function decodeAudioData(audioContext, url) {
	return new Promise((resolve) => {
		let request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = () => {
			audioContext.decodeAudioData(request.response, (buffer) => {
				if (!buffer) {
					alert('error decoding file data: ' + url);
					return;
				} else {
					resolve(buffer);
				}
			})
		}
		request.onerror = function() {
			alert('BufferLoader: XHR error');
		}
		request.send();
	})
}

export default decodeAudioData;