import Source from './js/createSource.js';

setTimeout(() => {
    var sound1 = new Source({
        soundName: "drunk",
        loop: true
    });
    var sound2 = new Source({
        soundName: "眉飞色舞",
        loop: true
    });
    var sound3 = new Source({
        soundName: "可不可以不勇敢",
        loop: true
    });

    sound1.start();
    sound2.start();
    sound3.start();
}, 5000)