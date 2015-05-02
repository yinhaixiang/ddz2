window.addEventListener('load', function() {

    var Q = Quintus()
        .include('Sprites, Scenes, Input, UI, Touch')
        .include('ddzScenes, ddzSprites, ddzUI, ddzGame, ddzClient');
    Q.setup('gameDiv', {maximize: true}).touch(Q.SPRITE_ALL);

    Q.load('poker2.png, poker2.json, tx1.jpg, tx2.jpg, tx3.jpg, dizhu.png, board.jpg', function () {
        Q.compileSheets('poker2.png', 'poker2.json');
        Q.stageScene('game');
    });



}, true);

