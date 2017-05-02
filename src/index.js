const {
    BUFFERS,
    context
} = require('./js/createContext');
const rhythmSample = require('./js/rhythmSample');
const volumeSample = require('./js/volumeSample');
const crossfadeSample = require('./js/crossfadeSample');
const crossfadePlaylistSample = require('./js/crossfadePlaylistSample');
const filterSample = require('./js/filterSample');
const scriptProcessor = require('./js/scriptProcessor');

// 播放音频
rhythmSample({
    BUFFERS,
    context
});

// 开始暂停，设置音频音量
volumeSample({
    BUFFERS,
    context
});

// 混合两个音频
crossfadeSample({
    BUFFERS,
    context
});

// 播放交叉淡入淡出
crossfadePlaylistSample({
    BUFFERS,
    context
});

// 给音乐加简单特效
filterSample({
    BUFFERS,
    context
});

// 通过javascript直接处理音频
scriptProcessor({
    BUFFERS,
    context
});