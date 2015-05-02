Quintus.ddzScenes = function(Q) {
    //游戏主场景
    Q.scene('game', new Q.Scene(function (stage) {
        Q.stg = stage;
    }, {sort: true}));

    Q.clearStg = function() {
        for (var j = 0; j < Q.stg.items.length; j++) {
            var item = Q.stg.items[j];
            item.destroy();
        }
    }

    Q.clearGrabText = function () {
        for(var idx in Q.playArea) {
            var txt = Q.playArea[idx];
            txt.destroy();
        }
        Q.playArea.length = 0;
    }

    Q.clearCards = function() {
        for(var i=0; i< Q.p0Cards.length; i++) {
            var card = Q.p0Cards[i];
            card.destroy();
        }

        for(var i=0; i< Q.p1Cards.length; i++) {
            var card = Q.p1Cards[i];
            card.destroy();
        }

        for(var i=0; i< Q.p2Cards.length; i++) {
            var card = Q.p2Cards[i];
            card.destroy();
        }

        for(var i=0; i< Q.allCards.length; i++) {
            var card = Q.allCards[i];
            card.destroy();
        }

        Q.p0Cards.length = 0;
        Q.p1Cards.length = 0;
        Q.p2Cards.length = 0;
        Q.allCards.length = 0;
    }

    Q.clearBoard = function() {
        if(Q.boardInfo.length == 0) {
            return;
        }
        for(var i=0; i<Q.boardInfo.length; i++) {
            var info = Q.boardInfo[i];
            info.destroy();
        }
        Q.boardInfo.length = 0;
    }

    Q.showScoreBoard = function () {
        Q.clearBoard();
        var board = Q.stg.insert(new Q.Sprite({asset: 'board.jpg', x: 660, y:50}));
        for(var i=0; i< Q.users.length; i++) {
            var user = Q.users[i];
            var unameInfo = Q.stg.insert(new Q.InfoText({label: user.uname, x: 600, y:40 + i*18, z:1, scale: 0.6}));
            var scoreInfo =Q.stg.insert(new Q.InfoText({label: user.score+'', x: 670, y:40 + i*18, z:1, scale: 0.6}));
            var totalScoreInfo = Q.stg.insert(new Q.InfoText({label: user.totalScore+'', x: 720, y:40 + i*18, z:1, scale: 0.6}));
            Q.boardInfo.push(unameInfo);
            Q.boardInfo.push(scoreInfo);
            Q.boardInfo.push(totalScoreInfo);
        }
    }

    Q.showGameInfo = function () {
        var label = '底分：' + Q.maxPoint + '    ' + '倍数：' + Q.multiple;
        if(Q.gameInfoText) {
            Q.gameInfoText.p.label = label;
        } else {
            Q.gameInfoText = Q.stg.insert(new Q.InfoText({label: label, x: 200, y: 520, scale: 0.6}));
        }
        var dizhuImg = Q.stg.insert(new Q.Sprite({asset: 'dizhu.png'}));
        if(Q.dizhuIdx == Q.myIdx) {
            dizhuImg.p.x = Q.MYDIZHUIMG_X;
            dizhuImg.p.y = Q.MYDIZHUIMG_Y;
        } else if(Q.dizhuIdx == Q.rightIdx) {
            dizhuImg.p.x = Q.RIGHTDIZHUIMG_X;
            dizhuImg.p.y = Q.RIGHTDIZHUIMG_Y;
        } else if(Q.dizhuIdx == Q.leftIdx) {
            dizhuImg.p.x = Q.LEFTDIZHUIMG_X;
            dizhuImg.p.y = Q.LEFTDIZHUIMG_Y;
        }
    }


    Q.renderCards = function (cards, isBack) {
        Q.clearCards();
        Q.p0Cards = Q.transCards(cards[0]);
        Q.p1Cards = Q.transCards(cards[1]);
        Q.p2Cards = Q.transCards(cards[2]);
        Q.allCards = Q.transCards(cards[3]);
        Q.putCards(isBack);
    }

    Q.clearPlayInfo = function (dealerIdx) {
        if(Q.playInfo[dealerIdx]) {
            for(var i=0; i<Q.playInfo[dealerIdx].length; i++) {
                Q.playInfo[dealerIdx][i].destroy();
            }
        }
    },

    Q.renderPlayCards = function (playCards, preDealIdx) {
        Q.clearPlayInfo(preDealIdx);

        if(playCards.length != 0) {
            var arr = []
            for(var i=0; i< playCards.length; i++) {
                var card = playCards[i];
                var c = Q.stg.insert(card);
                arr.push(c);
            }
            Q.playInfo[preDealIdx] = arr;
        }


        if(preDealIdx == Q.myIdx) {
            if(playCards.length == 0) {
                Q.playInfo[preDealIdx] = [Q.stg.insert(new Q.BuChuText({x: Q.MYTEXT_X, y: Q.MYTEXT_Y}))];
            } else {
                for(var i=0; i< Q.playInfo[preDealIdx].length; i++) {
                    var card = Q.playInfo[preDealIdx][i];
                    card.p.x = Q.MYPLAYCARDS_X - Q.MYPLAYCARDS_X_SPACING * (i-Q.playInfo[preDealIdx].length/2);
                    card.p.y = Q.MYPLAYCARDS_Y;
                    card.p.z = 100 - i;
                    card.off('touch');
                }
            }


        } else if(preDealIdx == Q.rightIdx) {
            if(playCards.length == 0) {
                Q.playInfo[preDealIdx] = [Q.stg.insert(new Q.BuChuText({x: Q.RIGHTTEXT_X, y: Q.RIGHTTEXT_Y}))];
            } else {
                for(var i=0; i< Q.playInfo[preDealIdx].length; i++) {
                    var card = Q.playInfo[preDealIdx][i];
                    card.p.x = Q.RIGHTPLAYCARDS_X - Q.RIGHTPLAYCARDS_X_SPACING * i;
                    card.p.y = Q.RIGHTPLAYCARDS_Y;
                    card.p.z = 100 - i;
                }
            }


        } else if(preDealIdx == Q.leftIdx) {
            if(playCards.length == 0) {
                Q.playInfo[preDealIdx] = [Q.stg.insert(new Q.BuChuText({x: Q.LEFTTEXT_X, y: Q.LEFTTEXT_Y}))];
            } else {
                for(var i=0; i< Q.playInfo[preDealIdx].length; i++) {
                    var card = Q.playInfo[preDealIdx][i];
                    card.p.x = Q.LEFTPLAYCARDS_X + Q.LEFTPLAYCARDS_X_SPACING * (Q.playInfo[preDealIdx].length - i);
                    card.p.y = Q.LEFTPLAYCARDS_Y;
                    card.p.z = 100 - i;
                }
            }

        }
    }

    Q.setCardsY = function () {
        if(Q.startIdx > Q.endIdx) {
            var tempIdx = Q.startIdx;
            Q.startIdx = Q.endIdx;
            Q.endIdx = tempIdx;
        }
        console.log(Q.startIdx + ' / ' + Q.endIdx);
        for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
            if(i >= Q.startIdx && i <= Q.endIdx) {
                Q['p' + Q.myIdx + 'Cards'][i].p.selected = !Q['p' + Q.myIdx + 'Cards'][i].p.selected;
                Q['p' + Q.myIdx + 'Cards'][i].setY();
            }
        }
    }

    Q.putCards = function(isBack) {
        for(var i=0; i< Q.p0Cards.length; i++) {
            var card = Q.p0Cards[i];
            Q.stg.insert(card);
        }

        for(var i=0; i< Q.p1Cards.length; i++) {
            var card = Q.p1Cards[i];
            Q.stg.insert(card);
        }

        for(var i=0; i< Q.p2Cards.length; i++) {
            var card = Q.p2Cards[i];
            Q.stg.insert(card);
        }

        for(var i=0; i< Q.allCards.length; i++) {
            var card = Q.allCards[i];
            Q.stg.insert(card);
        }

        Q.drawCards(isBack);
    };

    Q.drawCards = function (isBack) {
        Q.p0Cards.sort(Q.sortBy);
        Q.p1Cards.sort(Q.sortBy);
        Q.p2Cards.sort(Q.sortBy);

        for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
            var card = Q['p' + Q.myIdx + 'Cards'][i];
            card.p.x = Q.MYCARDS_X - Q.MYCARDS_X_SPACING * (i-Q['p' + Q.myIdx + 'Cards'].length/2);
            card.setY();
//            card.p.y = Q.MYCARDS_Y;
            card.p.z = 100 - i;

            card.on('touch', 'touch');
            card.on('touchEnd', 'touchEnd');
        }

        for(var i=0; i< Q['p' + Q.rightIdx + 'Cards'].length; i++) {
            var card = Q['p' + Q.rightIdx + 'Cards'][i];
            if(isBack) {
                card.p.sheet = 'BACK';
            }
            card.p.x = Q.RIGHTCARDS_X;
            card.p.y = Q.RIGHTCARDS_Y + i * Q.RIGHTCARDS_Y_SPACING;
            card.p.z = i;
        }

        for(var i=0; i< Q['p' + Q.leftIdx + 'Cards'].length; i++) {
            var card = Q['p' + Q.leftIdx + 'Cards'][i];
            if(isBack) {
                card.p.sheet = 'BACK';
            }
            card.p.x = Q.LEFTCARDS_X;
            card.p.y = Q.LEFTCARDS_Y + i * Q.LEFTCARDS_Y_SPACING;
            card.p.z = i;
        }

        for(var i=0; i< Q.allCards.length; i++) {
            var card = Q.allCards[i];
            card.p.x = Q.DIPAI_X + i * Q.DIPAI_X_SPACING;
            card.p.y = Q.DIPAI_Y;
            card.p.z = i;
        }
    }

    Q.initBtns = function() {
        if(Q.onePointBtn) {
            Q.onePointBtn.destroy();
            Q.twoPointBtn.destroy();
            Q.threePointBtn.destroy();
            Q.buJiaoBtn.destroy();
            Q.buChuBtn.destroy();
            Q.chongXuanBtn.destroy();
            Q.tiShiBtn.destroy();
            Q.chuPaiBtn.destroy();
        }

        Q.onePointBtn = Q.stg.insert(new Q.OnePointBtn());
        Q.twoPointBtn = Q.stg.insert(new Q.TwoPointBtn());
        Q.threePointBtn = Q.stg.insert(new Q.ThreePointBtn());
        Q.buJiaoBtn = Q.stg.insert(new Q.BuJiaoBtn());
        Q.buChuBtn = Q.stg.insert(new Q.BuChuBtn());
        Q.chongXuanBtn = Q.stg.insert(new Q.ChongXuanBtn());
        Q.tiShiBtn = Q.stg.insert(new Q.TiShiBtn());
        Q.chuPaiBtn = Q.stg.insert(new Q.ChuPaiBtn());

        Q.onePointBtn.p.z = 1;
        Q.twoPointBtn.p.z = 1;
        Q.threePointBtn.p.z = 1;
        Q.buJiaoBtn.p.z = 1;

    }

    Q.initNames = function() {
        var myName = Q.users[Q.myIdx].uname;
        var rightName = Q.users[Q.rightIdx].uname;
        var leftName = Q.users[Q.leftIdx].uname;

        var myNameText = Q.stg.insert(new Q.InfoText({label: myName}));
        myNameText.p.x = Q.MYNAME_X;
        myNameText.p.y = Q.MYNAME_Y;

        var rightNameText = Q.stg.insert(new Q.InfoText({label: rightName}));
        rightNameText.p.x = Q.RIGHTNAME_X;
        rightNameText.p.y = Q.RIGHTNAME_Y;

        var leftNameText = Q.stg.insert(new Q.InfoText({label: leftName}));
        leftNameText.p.x = Q.LEFTNAME_X;
        leftNameText.p.y = Q.LEFTNAME_Y;


    }

    Q.showPlayBtn = function (dealerIdx) {
        Q.clearPlayInfo(dealerIdx);
        if(dealerIdx == Q.myIdx) {
            Q.buChuBtn.p.hidden = false;
            Q.chongXuanBtn.p.hidden = false;
            Q.tiShiBtn.p.hidden = false;
            Q.chuPaiBtn.p.hidden = false;
            Q.buChuBtn.on('click');
            Q.chongXuanBtn.on('click');
            Q.tiShiBtn.on('click');
            Q.chuPaiBtn.on('click');
        } else {
            Q.buChuBtn.p.hidden = true;
            Q.chongXuanBtn.p.hidden = true;
            Q.tiShiBtn.p.hidden = true;
            Q.chuPaiBtn.p.hidden = true;
            Q.buChuBtn.off('click');
            Q.chongXuanBtn.off('click');
            Q.tiShiBtn.off('click');
            Q.chuPaiBtn.off('click');
        }

    }

    Q.showGrabBtn = function (maxPoint) {
        if(maxPoint === false) {
            Q.onePointBtn.p.hidden = true;
            Q.twoPointBtn.p.hidden = true;
            Q.threePointBtn.p.hidden = true;
            Q.buJiaoBtn.p.hidden = true;
            Q.onePointBtn.off('click');
            Q.twoPointBtn.off('click');
            Q.threePointBtn.off('click');
            Q.buJiaoBtn.off('click');
        } else {
            switch (maxPoint) {
                case 0:
                    Q.onePointBtn.p.hidden = false;
                    Q.twoPointBtn.p.hidden = false;
                    Q.threePointBtn.p.hidden = false;
                    Q.buJiaoBtn.p.hidden = false;
                    Q.onePointBtn.on('click');
                    Q.twoPointBtn.on('click');
                    Q.threePointBtn.on('click');
                    Q.buJiaoBtn.on('click');
                    break;
                case 1:
                    Q.onePointBtn.p.hidden = true;
                    Q.twoPointBtn.p.hidden = false;
                    Q.threePointBtn.p.hidden = false;
                    Q.buJiaoBtn.p.hidden = false;
                    Q.onePointBtn.off('click');
                    Q.twoPointBtn.on('click');
                    Q.threePointBtn.on('click');
                    Q.buJiaoBtn.on('click');
                    break;
                case 2:
                    Q.onePointBtn.p.hidden = true;
                    Q.twoPointBtn.p.hidden = true;
                    Q.threePointBtn.p.hidden = false;
                    Q.buJiaoBtn.p.hidden = false;
                    Q.onePointBtn.off('click');
                    Q.twoPointBtn.off('click');
                    Q.threePointBtn.on('click');
                    Q.buJiaoBtn.on('click');
                    break;
            }
        }

    }

};