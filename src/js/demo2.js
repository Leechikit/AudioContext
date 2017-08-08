// 音頻地址
const SONG1 = 'https://leechikit.github.io/resources/article/AudioContext/song/fingfingxia1.mp3';
// AudioContext对象
let audioContext = null;
// 音频源
let bufferSource = null;
// 音量模块
let gainNode = null;
// 是否播放
let isStart = false;
// 播放按钮元素
let buttonEl = document.querySelector('#button1');
// 音量控件元素
let volumnEl = document.querySelector('#volumn1');

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
    request.onerror = ()=> {
        alert('BufferLoader: XHR error');
    }
    request.send();
}

/**
* 创建AudioBufferSourceNode
*
*/
function createBufferSource(config) {
    bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = config.buffer;
    bufferSource.loop = config.loop || false;
    bufferSource.onended = () => {
        bufferSource = null;
    }
}

/**
* 创建GainNode对象
*
*/
function createGainNode() {
    gainNode = audioContext.createGain();
}

/**
* 点击播放按钮
*
*/
function buttonClickEvent(buffer) {
    buttonEl.addEventListener('click', (event) => {
        // 停止播放
        if (isStart) {
            event.target.innerText = 'START';
            bufferSource && bufferSource.stop();
            // 开始播放
        } else {
            event.target.innerText = 'STOP';
            createBufferSource({
                buffer,
                loop: true
            });
            createGainNode();
            bufferSource.connect(gainNode);
            gainNode.connect(audioContext.destination);
            bufferSource.start();
        }
        isStart = !isStart;
    });
}

/**
* 改变音量事件
*
*/
function changeVolumnEvent() {
    volumnEl.addEventListener('change', (event) => {
        gainNode && (gainNode.gain.value = event.target.value / 50);
    });
}

/**
* 初始化
*
*/
function init() {
    createAudioContext();
    decodeAudioData(SONG1, (buffer) => {
        buttonEl.setAttribute('data-loaded', true);
        buttonClickEvent(buffer);
        changeVolumnEvent();
    });
}

init();