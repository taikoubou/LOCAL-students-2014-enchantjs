enchant();

window.onload = function() {
    var game = new Core(320,320);
    var items = [];
    items[0] = "こんなモン";
    items[1] = "宇宙ゴミ";
    items[2] = "扇風機";
    items[3] = "小並感";
    items[4] = "あれ";
    items[5] = "ぷよぽっぷ";
    var item_score = [5,80,1,40,20,100];
    game.fps = 60;
    game.preload('chara1.png','map0.gif','mbox.png','result.png');
    game.keybind(90,'a');

    var haveItem = function(){
        var n=0;
        var itemName="";
    }

    var HeroItem = new haveItem();
    var bear = new Sprite(32,32);

    var addItem = function(item,str){
        if(item.itemName != "")item.itemName = str;
        item.n++;
    }

    var sumScore = function(){
        var score = 0;
        var len = HeroItem.length;

        for(var i=0;i<len;i++){
            for(var j=0;j<6;j++){
                if(HeroItem[i].itemName == items[j]){
                    score += item_score[j] * HeroItem[i].n;
                }
            }
        }
        return score;
    }

    var ResultScene = function(score){
        var scene = new Scene();
        var label = new Label();
        var bg = new Sprite(320,320);

        bg.image = game.assets['result.png'];
        bg.x = 0;
        bg.y = 0;
        bg.opcity = 0.7;

        label.color = 'black';
        label.x = 160;
        label.y = 240;
        label.font = '32px "Arial"';
        label.text = score.toString();

        scene.addEventListener('enterframe',function(){
            var len = HeroItem.length;

            if(game.input.a){
                for(var i=0;i<len;i++){
                    HeroItem.pop();
                }
                bear.x = 16;
                bear.y = 16;
                game.popScene();
            }
        });

        scene.addChild(bg);
        scene.addChild(label);

        return scene;
    }

    var MessageScene = function(randN){
        var scene = new Scene();
        var buttonflag = false;
        var label = new Label();

        var sw = new MenuWindow(scene,10,230);

        scene.addEventListener('enterframe',function(){
            if(game.input.a && buttonflag){
                game.popScene();
            }
            else if(!game.input.a && !buttonflag){
                buttonflag = true;
            }
        });

        label = MakeMessage(items[randN] + " を手に入れた");
        scene.addChild(label);
        return scene;
    }

    var MenuScene = function(itemList){
        var scene = new Scene();
        var label = new Label();
        var buttonflag = false;
        var len = itemList.length;

        label = new Array();

        var sw = new MenuWindow(scene,10,230);

        scene.addEventListener('enterframe',function(){
            if(game.input.a && buttonflag){
                game.popScene();
            }
            else if(!game.input.a && !buttonflag){
                buttonflag = true;
            }
        });

        for(var i=0;i<len;i++){
            label[i] = new Label();
            label[i] = (function(n,lb,item){
                var dy = [240,240,260,260,280,280];
                var dx = [20,170,20,170,20,170];
                lb.y = dy[n];
                lb.x = dx[n];
                lb.font = '16px "Arial"';
                lb.text = item.itemName + " " + item.n.toString();
                lb.color = 'white';
                return lb;
            })(i,label[i],itemList[i]);
            scene.addChild(label[i]);
        }

        return scene;
    }

    var MakeMessage = function(str){
        var tmplabel = new Label();

        tmplabel.color = 'white';
        tmplabel.x = 20;
        tmplabel.y = 240;
        tmplabel.font = '16px "Arial"';
        tmplabel.text = str;

        return tmplabel;
    }

    var MenuWindow = enchant.Class.create(enchant.Sprite,{
        initialize: function(scene,x,y){
                        enchant.Sprite.call(this,300,80);
                        this.image = game.assets['mbox.png'];
                        this.x = x;
                        this.y = y;
                        this.opacity = 0.5;
                        scene.addChild(this);
                    }
    });

    var isEncounter = function(){
        var rnd = getRand(1000);

        if(rnd > 995){
            return true;
        }
        else {
            return false;
        }
    }

    var getRand = function(n){
        var rnd = Math.floor(Math.random() * n);
        return rnd;
    }

    game.onload = function(){
        var messageFlag = false;
        var buttonFlag = false;
        var randN = 0;
        var map1 = new Map(16,16);
        HeroItem = new Array();

        bear.scale(0.5,0.5);

        bear.image = game.assets['chara1.png'];
        map1.image = game.assets['map0.gif'];

        map1Load(map1);

        bear.x=16;
        bear.y=16;
        bear.frame = [0,0,0,0,0,0,1,1,1,1,1,1];

        bear.addEventListener('enterframe',function(){
            var itemEncflag = false;
            if(this.x >= 214 && this.x <= 222 && this.y >= 86 && this.y <= 94){
                game.pushScene(ResultScene(sumScore()));
            }
            if(game.input.left && !map1.hitTest(this.x-2,this.y)){
                this.x-=2;
                itemEncflag = isEncounter();
            }
            else if(game.input.right && !map1.hitTest(this.x+32,this.y)){
                this.x+=2;
                itemEncflag = isEncounter();
            }
            else if(game.input.up && !map1.hitTest(this.x,this.y-2)){
                this.y-=2;
                itemEncflag = isEncounter();
            }
            else if(game.input.down && !map1.hitTest(this.x,this.y+32)){
                this.y+=2;
                itemEncflag = isEncounter();
            }
            else if(game.input.a && !buttonFlag){
                buttonFlag = true;
                if(!messageFlag){
                    game.pushScene(MenuScene(HeroItem));
                    messageFlag = false;
                }
                else {
                    messageFlag = false;
                }
            }
            else if(!game.input.a && buttonFlag){
                buttonFlag = false;
            }
            if(itemEncflag){
                itemEncflag = false;
                randN = getRand(6);
                var len = HeroItem.length;
                var flag = false;
                for(var i=0;i<6;i++){
                    for(var j=0;j<len;j++){
                        if(HeroItem[j].itemName == items[randN]){
                            addItem(HeroItem[j],items[randN]);
                            flag = true;
                        }
                        if(flag)break;
                    }
                    if(flag)break;
                }
                if(!flag){
                    var hoge = new haveItem();
                    HeroItem[len] = new haveItem();
                    HeroItem[len].n = 0;
                    addItem(HeroItem[len],items[randN]);
                }
                else flag =false;
                game.pushScene(MessageScene(randN));
            }
        });

        game.rootScene.addChild(map1);
        game.rootScene.addChild(bear);
    };
    game.start();
};

var map1Load = function(map){
    map.loadData([
        [23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,23],
        [23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23]
    ],[
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,13,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
        [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
    ]);
    map.collisionData = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
}

