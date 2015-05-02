Quintus.ddzClient = function (Q) {

    Q.isFirst = true;
    Q.socket = null;
    Q.user = {uname: null, isReady: false, score: 0, totalScore: 0};
    Q.allCards = [];
    Q.p0Cards = [];
    Q.p1Cards = [];
    Q.p2Cards = [];
    Q.myIdx = -1;
    Q.rightIdx = -1;
    Q.leftIdx = -1;
    Q.users = [];
    Q.playArea = [];
    Q.dizhuIdx = -1;
    Q.maxPoint = -1;
    Q.multiple = 1;
    Q.playInfo = {};
    Q.hintTime = 0;
    Q.boardInfo = [];
    Q.startIdx = null;
    Q.endIdx = null;

    //连接服务器
    Q.connect = function () {
        if (Q.socket == null) {
            Q.socket = io.connect("ws://192.168.0.103:3000");
            Q.socket.on("connect", function () {
                Q.bindEvent();
            });
            Q.socket.on("error", function (data) {
                Q.socket = null;
            });
        } else {
            Q.socket.socket.reconnect();
        }
    };

    //登录
    Q.login = function () {
        var uname = $('#uname').val().trim();
        if (uname == '') {
            alert('昵称不能为空！');
            return;
        }
        Q.connect();
        Q.user.uname = uname;
        Q.socket.emit('login', Q.user, function (result) {
            if (result == 0) {
                alert("人数已满!");
            } else if (result == 1) {
                $('#loginDiv').hide();
                $('#gameDiv').show();
            } else if (result == 2) {
                alert("该昵称已经有人使用!");
            }
        });
    };

    //准备
    Q.ready = function () {
        Q.socket.emit('ready', {});
    };

    //绑定客户端socket事件
    Q.bindEvent = function () {
        //处理游戏用户更新事件
        Q.socket.on("updateUserInfo", function (users) {
            Q.updateUserInfo(users);
        });

        Q.socket.on("gameStart", function (info) {
            Q.gameStart(info);
        });

        Q.socket.on("grab", function (info) {
            Q.showGrabArea(info);
        });

        Q.socket.on("roundStart", function (info) {
            Q.roundStart(info);
        });

        Q.socket.on('chupaiWrong', function () {
            console.log('牌型错误！');
        });


        Q.socket.on('toPlay', function (info) {
            Q.toPlay(info);
        });

        Q.socket.on('hint', function (info) {
            Q.showHintCards(info);
        });

        Q.socket.on('gameOver', function (info) {
            Q.gameOver(info);
        });

    };


    Q.gameStart = function (info) {
        Q.isFirst = false;
        Q.clearStg();
        Q.users = info.users;
        Q.showScoreBoard();

        for (var i = 0; i < Q.users.length; i++) {
            if (Q.users[i].uname == Q.user.uname) {
                Q.myIdx = i;
                Q.rightIdx = (i + 4) % 3;
                Q.leftIdx = (i + 2) % 3;
                break;
            }
        }

        Q.initBtns();
        Q.initNames();
        Q.renderCards(info.cards, true);
        Q.showGrabArea();
    }

    Q.roundStart = function (info) {
        Q.maxPoint = info.maxPoint;
        Q.dizhuIdx = info.dizhuIdx;
        Q.clearGrabText();
        Q.showGrabBtn(false);
        Q.renderCards(info.cards, true);
        Q.showGameInfo();

        Q.buChuBtn.p.z = 2;
        Q.chongXuanBtn.p.z = 2;
        Q.tiShiBtn.p.z = 2;
        Q.chuPaiBtn.p.z = 2;

        Q.showPlayBtn(info.dealerIdx);

    }

    Q.toPlay = function (info) {
        if(info.multiple) {
            Q.multiple = info.multiple;
            Q.showGameInfo();
        }
        Q.renderCards(info.cards, true);
        var playCards = Q.transCards(info.playCards);
        var preDealIdx = (info.dealerIdx + 2) % 3;
        Q.renderPlayCards(playCards, preDealIdx);
        Q.showPlayBtn(info.dealerIdx);

    }

    Q.showHintCards = function (info) {
        Q.renderCards(info.cards, true);

    }

    Q.hint = function () {
        Q.socket.emit('hint', Q.hintTime++);
    }

    Q.buchu = function () {
        Q.socket.emit('buchu', {});
    }

    Q.chupai = function (cards) {
        Q.hintTime = 0;
        Q.socket.emit('chupai', Q.transCards2(cards));
    }

    Q.grab = function (point) {
        Q.socket.emit('grab', point);
    }

    Q.showGrabArea = function (info) {
        if (info) {
            var preDealIdx = (info.dealerIdx + 2) % 3;
            if (preDealIdx == Q.myIdx) {
                var txt = Q.stg.insert(new Q.PointText({point: info.prePoint, x: Q.MYTEXT_X, y: Q.MYTEXT_Y}));
            } else if (preDealIdx == Q.rightIdx) {
                var txt = Q.stg.insert(new Q.PointText({point: info.prePoint, x: Q.RIGHTTEXT_X, y: Q.RIGHTTEXT_Y}));
            } else if (preDealIdx == Q.leftIdx) {
                var txt = Q.stg.insert(new Q.PointText({point: info.prePoint, x: Q.LEFTTEXT_X, y: Q.LEFTTEXT_Y}));
            }
            Q.playArea.push(txt);
        }
        if (!info) {
            info = {};
            info.dealerIdx = 0;
            info.maxPoint = 0;
        }
        if (Q.user.uname == Q.users[info.dealerIdx].uname) {
            Q.showGrabBtn(info.maxPoint);
        } else {
            Q.showGrabBtn(false);
        }
    }

    //转换卡牌类数组（从后台到前台）
    Q.transCards = function (cards) {
        if (!cards) {
            return [];
        }
        var cardSpriteList = [];
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var cardSprite = new Q.Poker({sheet: card.sheet, value: card.value, selected: card.selected});
            cardSpriteList.push(cardSprite);
        }
        return cardSpriteList;
    }

    //转换卡牌类数组（从前台到后台）
    Q.transCards2 = function (cards) {
        if (!cards) {
            return [];
        }

        var arr = []
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            arr.push(card.p.sheet);
        }
        return arr;
    }

    Q.sortBy = function (a, b) {
        return a.p.value - b.p.value;
    }

    //更新用户信息
    Q.updateUserInfo = function (users) {
        Q.clearStg();
        if(Q.isFirst) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                Q.stg.insert(new Q.Sprite({asset: 'tx' + (i + 1) + '.jpg', x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.TX_Y, scale: 0.5}));
                Q.stg.insert(new Q.UI.Text({label: user.uname, color: 'yellow', x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.NC_Y}));
                if (user.isReady) {
                    var temp = Q.stg.insert(new Q.ReadyText({x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.ZB_Y}));
                } else {
                    if (user.uname == Q.user.uname) {
                        Q.stg.insert(new Q.ReadyBtn({uname: user.uname, x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.ZB_Y}));
                    }
                }
            }
        } else {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                Q.stg.insert(new Q.Sprite({asset: 'tx' + (i + 1) + '.jpg', x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.TX_Y, scale: 0.5}));
                Q.stg.insert(new Q.UI.Text({label: user.uname, color: 'yellow', x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.NC_Y}));
                if (user.isReady) {
                    var temp = Q.stg.insert(new Q.ReadyText({x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.ZB_Y}));
                } else {
                    if (user.uname == Q.user.uname) {
                        Q.stg.insert(new Q.ReadyBtn({uname: user.uname, x: Q.TX_X + i * Q.TX_X_SPACING, y: Q.ZB_Y}));
                    }
                }
            }
        }

    };


    //结束游戏
    Q.gameOver = function (info) {
        Q.users = info.users;
        Q.showScoreBoard();
        Q.renderCards(info.cards, false);
        Q.showPlayBtn(-1);

        for(var i=0; i<info.users.length; i++) {
            var user = info.users[i];
            var label = user.uname + ': ' + user.score;
            Q.stg.insert(new Q.InfoText({label: label, x: 460, y: 130 + i * 30, z: 100}));
        }

        Q.stg.insert(new Q.ReadyBtn({x: Q.MYCARDS_X, y: Q.MYCARDS_Y, z: 200}));
    }


    $("#loginBtn").click(function () {
        Q.login();
    });


};