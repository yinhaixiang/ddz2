var Client = require('./client');
var Card = require('./card');
var GameRule = require('./gameRule');
var app = require('./../app');

var port = 3000;

app.set('port', port);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

var Server = function () {
    this.io = null;	//绑定的io对象
    this.users = [];	//记录所有的用户
    this.allCards = [];
    this.p0Cards = [];
    this.p1Cards = [];
    this.p2Cards = [];
    this.cards = [];

    this.grabTime = 0;
    this.maxPoint = 0;
    this.multiple = 1;
    this.dealerIdx = 0;
    this.dizhuIdx = -1;
    this.biggerIdx = 0;
    this.preCards = [];
}


Server.prototype = {
    //初始化监听
    listen: function (port) {
        this.io = require("socket.io").listen(server);
        //设置日志级别
//        this.io.set('log level', 1);
        this.connect();
    },

    //客户端于此连接，客户端数组增加一个客户端
    connect: function (socket) {
        var self = this;
        this.io.sockets.on('connection', function (socket) {
            new Client(self, socket);
        });
    },

    //移出一个socket客户端
    removeUser: function (user) {
        var idx = -1;
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].uname == user.uname) {
                idx = i;
                break;
            }
        }
        if (idx != -1) {
            this.users.splice(idx, 1);
        }

    },
    //判断用户是否存在
    isUserExists: function (user) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].uname == user.uname) {
                return true;
            }
        }
        return false;
    },
    //获取所有用户姓名
    getAllUser: function () {
        return this.users;
    },

    //通知客户端更新客户信息
    updateUserInfo: function () {
        //如果没有一个客户端
        var users = this.getAllUser();
        if (users.length != 0) {
            this.broadcastEvent("updateUserInfo", users);
        }
    },

    //游戏开始
    gameStart: function () {
        this.grabTime = 0;
        this.maxPoint = 0;
        this.multiple = 1;
        this.dealerIdx = 0;
        this.dizhuIdx = -1;
        this.biggerIdx = 0;
        this.preCards = [];
        this.initCards();

//        this.users.sort(this._shuffle);
        var info = {};
        info.users = this.users;
        info.cards = this.cards;
        info.dealerIdx = this.dealerIdx;
        this.broadcastEvent('gameStart', info);
    },

    //抢地主方法
    grab: function (point) {
        if(point > this.maxPoint) {
            this.maxPoint = point;
            this.dizhuIdx = this.dealerIdx;
        }

        this.dealerIdx++;
        this.grabTime++;
        this.dealerIdx = this.dealerIdx % 3;

        if(this.grabTime == 3 && this.maxPoint == 0) {
            this.dealerIdx = this.dizhuIdx;
            this.gameStart();
            return;
        }
        if(this.maxPoint == 3 || this.maxPoint > 0 && this.grabTime == 3) {
            this.dealerIdx = this.dizhuIdx;
            this.roundStart();
            return;
        }


        var info = {};
        info.dealerIdx = this.dealerIdx;
        info.prePoint = point;
        info.maxPoint = this.maxPoint;
        this.broadcastEvent('grab', info);

    },

    roundStart: function () {
        for(var idx in this.allCards) {
            this.cards[this.dizhuIdx].push(this.allCards[idx]);
        }

        this.cards[3] = this.allCards;

        var info = {};
        info.cards = this.cards;
        info.dizhuIdx = this.dizhuIdx;
        info.maxPoint = this.maxPoint;
        info.dealerIdx = this.dealerIdx;

        this.broadcastEvent('roundStart', info);
    },

    gameOver: function (info) {
        info.winner = this.biggerIdx;

        for(var i=0; i<this.users.length; i++) {
            var user = this.users[i];
            user.isReady = false;
            if(info.dizhuIdx == info.winner && i == info.dizhuIdx) {
                user.score = (this.maxPoint * this.multiple) * 2;
            } else if(info.dizhuIdx == info.winner && i != info.dizhuIdx) {
                user.score = -(this.maxPoint * this.multiple);
            } else if(info.dizhuIdx != info.winner && i != info.dizhuIdx) {
                user.score = this.maxPoint * this.multiple;
            } else if(info.dizhuIdx != info.winner && i == info.dizhuIdx) {
                user.score = -(this.maxPoint * this.multiple) * 2;
            }
            user.totalScore += user.score;
        }
        info.users = this.users;
        this.broadcastEvent('gameOver', info);
    },

    hint: function (hintTime) {
        var handCards = this.cards[this.dealerIdx];
        var hintCards = GameRule.hint(handCards, this.preCards, hintTime);
        if(hintCards != null) {
            for(var i=0; i< handCards.length; i++) {
                for(var j=0; j< hintCards.length; j++) {
                    if(handCards[i].equals(hintCards[j])) {
                        handCards[i].selected = true;
                        break;
                    } else {
                        handCards[i].selected = false;
                    }
                }
            }
        }
        var info = {};
        info.cards = this.cards;
        this.broadcastEvent('hint', info);
    },

    chupai: function (nowCards) {
        var handCards = this.cards[this.dealerIdx];
        this.remove(handCards, nowCards);
        this.preCards = nowCards;
        this.biggerIdx = this.dealerIdx;
        this.dealerIdx++;
        this.dealerIdx = this.dealerIdx % 3;

        var info = {};
        var tar = GameRule.getTypeAndRank(nowCards);
        if(tar[0] == 8 || tar[0] == 9) {
            this.multiple *= 2;
            info.multiple = this.multiple;
            console.log('multiple: ' + info.multiple);
        }
        info.cards = this.cards;
        info.playCards = nowCards;
        info.dealerIdx = this.dealerIdx;
        info.dizhuIdx = this.dizhuIdx;
        this.broadcastEvent('toPlay', info);
        if(handCards.length == 0) {
            this.gameOver(info);
        }
    },

    buchu: function() {
        this.dealerIdx++;
        this.dealerIdx = this.dealerIdx % 3;
        var info = {};
        info.cards = this.cards;
        info.playCards = [];
        info.dealerIdx = this.dealerIdx;
        this.broadcastEvent('toPlay', info);
    },

    remove: function (a, b) {
        for(var i=0; i< b.length; i++) {
            for(var j=0; j< a.length; j++) {
                if(b[i].equals(a[j])) {
                    a.splice(j, 1);
                }
            }
        }
    },

    isBigger: function(nowCards) {
        if(this.dealerIdx == this.biggerIdx) {
            return GameRule.isBigThanPrev(nowCards, null);
        }
        return GameRule.isBigThanPrev(nowCards, this.preCards);
    },

    transCards: function (cards) {
        var newCards = [];
        for(var idx in cards) {
            var oldCard = cards[idx];
            var rank = oldCard.replace(/\D+/, '');
            var suit = oldCard.replace(/\d+/, '');
            var newCard = new Card(rank, suit);
            newCards.push(newCard);
        }
        return newCards;
    },

    initCards: function () {
        this.allCards.length = 0;
        this.p0Cards.length = 0;
        this.p1Cards.length = 0;
        this.p2Cards.length = 0;
        this.cards.length = 0;

        for(var i=3; i<18; i++) {
            if(i == 15 || i == 16) continue;
            for(var j=0; j<4; j++) {
                var rank = i;
                var suit = null;
                switch (j) {
                    case 0:
                        suit = 'A';
                        break;
                    case 1:
                        suit = 'B';
                        break;
                    case 2:
                        suit = 'C';
                        break;
                    case 3:
                        suit = 'D';
                        break;
                }

                this.allCards.push(new Card(rank, suit));
            }
        }
        this.allCards.push(new Card(800, 'XW'));
        this.allCards.push(new Card(1000, 'DW'));

        this.allCards.sort(this._shuffle);

        while (this.allCards.length > 3) {
            this.p1Cards.push(this.allCards.pop());
            this.p2Cards.push(this.allCards.pop());
            this.p0Cards.push(this.allCards.pop());
        }


        this.cards[0] = this.p0Cards;
        this.cards[1] = this.p1Cards;
        this.cards[2] = this.p2Cards;

        this.p0Cards.sort(this._sortBy);
        this.p1Cards.sort(this._sortBy);
        this.p2Cards.sort(this._sortBy);
    },

    _shuffle: function () {
        return 0.5 - Math.random();
    },

    _sortBy: function(a, b) {
        return a.value - b.value;
    },

    //广播事件
    broadcastEvent: function (eventName, data) {
        console.log("***: " + eventName);
        this.io.sockets.emit(eventName, data);
    }
}



new Server().listen(3000);
console.log("server is running...");