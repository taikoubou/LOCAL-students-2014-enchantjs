// 1:UP
// 2:LEFT
// 3:RIGHT
// 4:DOWN

enchant();

window.onload = function() {
    var game = new Core(320,320);
    game.fps = 60;
    game.preload('chara1.png','map0.png');
    game.onload = function(){
        var bear = new Sprite(32,32);

        bear.image = game.assets['chara1.png'];

        bear.x=0;
        bear.y=0;
        bear.frame = [0,0,0,0,0,0,1,1,1,1,1,1];

        bear.addEventListener('enterframe',function(){
            if(game.input.left)this.x-=2;
            if(game.input.right)this.x+=2;
            if(game.input.up)this.y-=2;
            if(game.input.down)this.y+=2;
        });

        game.rootScene.addChild(bear);
    };
    game.start();
};
