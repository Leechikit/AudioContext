// 音頻地址
const SONG1 = 'https://leechikit.github.io/resources/article/AudioContext/song/fingfingxia1.mp3';
// 音頻地址
const SONG2 = 'https://leechikit.github.io/resources/article/AudioContext/song/fingfingxia2.mp3';


function Audio(obj) {
    // AudioContext对象
    this.audioContext = null;
    // 音频源
    this.bufferSource = null;
    // 音量模块
    this.gainNode = null;
    // 是否播放
    this.isStart = false;
    // 音频地址
    this.songUrl = obj.songUrl;
    // 播放按钮元素
    this.buttonEl = document.querySelector(obj.buttonSelector);
    // 音量控件元素
    this.volumnEl = document.querySelector(obj.volumnSelector);
    // 初始化
    this.init();
}

Audio.prototype = {
    constructor: Audio,
    /**
    * 创建AudioContext上下文
    *
    */
    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            alert("Web Audio API is not supported in this browser");
        }
    },

    /**
    * 解码音频文件
    *
    */
    decodeAudioData(url, callback) {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            this.audioContext.decodeAudioData(request.response, (buffer) => {
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
    },

    /**
    * 创建AudioBufferSourceNode
    *
    */
    createBufferSource(config) {
        this.bufferSource = this.audioContext.createBufferSource();
        this.bufferSource.buffer = config.buffer;
        this.bufferSource.loop = config.loop || false;
        this.bufferSource.onended = () => {
            this.bufferSource = null;
        }
    },

    /**
    * 创建GainNode对象
    *
    */
    createGainNode() {
        this.gainNode = this.audioContext.createGain();
    },

    /**
    * 点击播放按钮
    *
    */
    buttonClickEvent(buffer) {
        this.buttonEl.addEventListener('click', (event) => {
            // 停止播放
            if (this.isStart) {
                event.target.innerText = 'START';
                this.bufferSource && this.bufferSource.stop();
                // 开始播放
            } else {
                event.target.innerText = 'STOP';
                this.createBufferSource({
                    buffer,
                    loop: true
                });
                this.createGainNode();
                this.bufferSource.connect(this.gainNode);
                this.gainNode.connect(this.audioContext.destination);
                this.bufferSource.start();
            }
            this.isStart = !this.isStart;
        });
    },

    /**
    * 改变音量事件
    *
    */
    changeVolumnEvent() {
        this.volumnEl.addEventListener('change', (event) => {
            this.gainNode && (this.gainNode.gain.value = event.target.value / 50);
        });
    },

    /**
    * 初始化
    *
    */
    init(obj) {
        this.createAudioContext();
        this.decodeAudioData(this.songUrl, (buffer) => {
            this.buttonEl.setAttribute('data-loaded', true);
            this.buttonClickEvent(buffer);
            this.changeVolumnEvent();
        });
    }
}

new Audio({
    buttonSelector: '#button1',
    volumnSelector: '#volumn1',
    songUrl:SONG1
});

new Audio({
    buttonSelector: '#button2',
    volumnSelector: '#volumn2',
    songUrl:SONG2
});