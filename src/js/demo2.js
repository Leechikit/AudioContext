// AudioContext对象
let audioContext = null;
// 音频源
let bufferSource = null;
// 是否播放
let isStart = false;

/**
* 创建AudioContext上下文
*
*/
function createAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        alert("Web Audio API is not supported in this browser");
    }
}

/**
* 解码音频文件
*
*/
function decodeAudioData(url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        audioContext.decodeAudioData(request.response, (buffer) => {
            if (!buffer) {
                alert('error decoding file data: ' + url);
                return;
            } else {
                callback(buffer);
            }
        })
    }
    request.onerror = function () {
        alert('BufferLoader: XHR error');
    }
    request.send();
}

/**
* 创建Source对象
*
*/
function createBufferSource(config) {
    let bufferSource = null;
    bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = config.buffer;
    bufferSource.loop = config.loop || false;
    bufferSource.onended = () => {
        bufferSource = null;
    }
    return bufferSource;
}

/**
* 点击播放按钮
*
*/
function buttonClickEvent(buffer) {
    document.querySelector('#button').addEventListener('click', (event) => {
        // 停止播放
        if (isStart) {
            event.target.innerText = 'START';
            bufferSource && bufferSource.stop();
        // 开始播放
        } else {
            event.target.innerText = 'STOP';
            bufferSource = createBufferSource({
                buffer,
                loop: true
            });
            bufferSource.connect(audioContext.destination);
            bufferSource.start();
        }
        isStart = !isStart;
    });
}

/**
* 初始化
*
*/
function init() {
    createAudioContext();
    decodeAudioData('https://leechikit.github.io/resources/article/AudioContext/song/fingfingxia.mp3', (buffer) => {
        buttonClickEvent(buffer);
    });
}

init();