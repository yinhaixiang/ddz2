var CardInfo1 = require('./cardInfo1');
var CardInfo2 = require('./cardInfo2');
var CardType = require('./cardType');

var GameRule = {
    hint: function (cards, preCards, time) {
        var zhaDanList = [];
        var length = 0;
        var prevCardType = this.getTypeAndRank(preCards);
        if(prevCardType[0] == CardType.WangZha) {
            return null;
        }

        if(prevCardType[0] == CardType.ShunZi) {
            length = preCards.length;
        } else if(prevCardType[0] == CardType.LianDui) {
            length = preCards.length / 2;
        } else if(prevCardType[0] == CardType.FeiJi) {
            length = preCards.length / 3;
        } else if(prevCardType[0] == CardType.FeiJiDaiDan) {
            length = preCards.length / 4;
        } else if(prevCardType[0] == CardType.FeiJiDaiShuang) {
            length = preCards.length / 5;
        }

        var info = CardInfo2.getCardInfo2(cards, prevCardType[1], length);

        if(info.zhaDanList.length > 0) {
            zhaDanList = info.zhaDanList;
        }
        if(info.wangZha.length > 0) {;
            zhaDanList.push(info.wangZha);
        }


        if(prevCardType[0] == CardType.ZhaDan) {
            var result = [];
            for(var idx in zhaDanList) {
                var cards = zhaDanList[idx];
                var tar = this.getTypeAndRank(cards);
                if(tar[1] > prevCardType[1] || tar[0] == CardType.WangZha) {
                    result.push(cards);
                }
            }
            if(result.length > 0) {
                time = time % result.length;
                return result[time];
            }
            return null;
        }

        if(prevCardType[0] == CardType.Dan) {
            return this.getHintCards(info.danList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.DuiZi) {
            return this.getHintCards(info.duiZiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.SanBuDai) {
            return this.getHintCards(info.sanBuDaiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.ShunZi) {
            return this.getHintCards(info.shunZiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.LianDui) {
            return this.getHintCards(info.lianDuiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.SanDaiYi) {
            return this.getHintCards(info.sanDaiYiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.SanDaiEr) {
            return this.getHintCards(info.sanDaiErList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.FeiJi) {
            return this.getHintCards(info.feiJiList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.FeiJiDaiDan) {
            return this.getHintCards(info.feiJiDaiDanList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.FeiJiDaiShuang) {
            return this.getHintCards(info.feiJiDaiShuangList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.SiDaiDan) {
            return this.getHintCards(info.siDaiDanList, zhaDanList, time);
        }
        if(prevCardType[0] == CardType.SiDaiShuang) {
            return this.getHintCards(info.siDaiShuangList, zhaDanList, time);
        }
        return null;
    },

    getHintCards: function (cards, zhaDanList, time) {
        var result = [];
        if(cards.length > 0) {
            result = result.concat(cards);
        }
        if(zhaDanList != null) {
            result = result.concat(zhaDanList);
        }
        if(result.length != 0) {
            time = time % result.length;
            return result[time];
        }
        return null;
    },

    isBigThanPrev: function (cards, preCards) {
        if(cards == null || cards.length == 0) {
            return false;
        }
        var myCardType = this.getTypeAndRank(cards);
        if(myCardType[0] == -1) {
            return false;
        }
        if(preCards == null || preCards.length == 0) {
            return true;
        }

        var preCardType = this.getTypeAndRank(preCards);

        //不符合任何牌型
        if(myCardType[0] == -1) {
            return false;
        }

        // 集中判断是否王炸，免得多次判断王炸
        if (preCardType[0] == CardType.WangZha) {
            return false;
        } else if (myCardType[0] == CardType.WangZha) {
            return true;
        }

        // 集中判断对方不是炸弹，我出炸弹的情况
        if (preCardType[0] != CardType.ZhaDan && myCardType[0] == CardType.ZhaDan) {
            return true;
        }

        //在不是炸弹的情况下，牌数不相等
        if(cards.length != preCards.length) {
            return false;
        }

        if(myCardType[0]!= preCardType[0]) {
            return false;
        }
        return (myCardType[1] > preCardType[1]);
    },

    getTypeAndRank: function(cards) {
        var typeAndValue = [];
        var value = null;

        value = this.isDan(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.Dan;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isDuiZi(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.DuiZi;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isSanBuDai(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.SanBuDai;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isZhaDan(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.ZhaDan;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isWangZha(cards);
        if(value) {
            typeAndValue[0] = CardType.WangZha;
            return typeAndValue;
        }

        value = this.isSanDaiYi(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.SanDaiYi;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isSanDaiEr(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.SanDaiEr;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isSiDaiDan(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.SiDaiDan;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isSiDaiShuang(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.SiDaiShuang;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isShunZi(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.ShunZi;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isLianDui(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.LianDui;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isFeiJi(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.FeiJi;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isFeiJiDaiDan(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.FeiJiDaiDan;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        value = this.isFeiJiDaiShuang(cards);
        if(value != -1) {
            typeAndValue[0] = CardType.FeiJiDaiShuang;
            typeAndValue[1] = value;
            return typeAndValue;
        }

        typeAndValue[0] = -1;
        return typeAndValue;
    },

    isDan: function (cards) {
        if (cards.length == 1) {
            return cards[0].rank;
        }
        return -1;
    },

    isDuiZi: function (cards) {
        if (cards.length == 2) {
            var g1 = cards[0].rank;
            var g2 = cards[1].rank;
            if (g1 == g2) {
                return g1;
            }
        }
        return -1;
    },

    isSanBuDai: function (cards) {
        if (cards.length == 3) {
            var g1 = cards[0].rank;
            var g2 = cards[1].rank;
            var g3 = cards[2].rank;

            if (g1 == g2 && g1 == g3) {
                return g1;
            }
        }
        return -1;
    },

    isSanDaiYi: function (cards) {
        if (cards.length == 4) {
            var g1 = cards[0].rank;
            var g2 = cards[1].rank;
            var g3 = cards[2].rank;
            var g4 = cards[3].rank;

            // 暂时认为炸弹不为3带1
            if (g1==g2 && g1==g3 && g1==g4) {
                return -1;
            }
            // 3带1，被带的牌在牌头
            if (g1!=g2 && g2==g3 && g2==g4) {
                return g4;
            }
            // 3带1，被带的牌在牌尾
            if (g1==g2 && g2==g3 && g3!=g4) {
                return g1;
            }
        }
        return -1;
    },

    isSanDaiEr: function (cards) {
        if (cards.length == 5) {
            var g1 = cards[0].rank;
            var g2 = cards[1].rank;
            var g3 = cards[2].rank;
            var g4 = cards[3].rank;
            var g5 = cards[4].rank;

            if(g1==g2 && g1==g3 && g3!=g4 && g4==g5) {
                return g1;
            }
            if(g1==g2 && g2!=g3 && g3==g4 && g3==g5) {
                return g5;
            }
        }
        return -1;
    },

    isZhaDan: function (cards) {
        if (cards.length == 4) {
            var g1 = cards[0].rank;
            var g2 = cards[1].rank;
            var g3 = cards[2].rank;
            var g4 = cards[3].rank;

            if (g1==g2 && g2==g3 && g3==g4) {
                return g1;
            }
        }
        return -1;
    },

    isShunZi: function (cards) {
        if (cards.length > 4) {
            for (var i = 0; i < cards.length - 1; i++) {
                var g1 = cards[i].rank;
                var g2 = cards[i + 1].rank;
                if (g2 != g1 + 1) {
                    return -1;
                }
            }
            return cards[0].rank;
        }
        return -1;
    },

    isWangZha: function (cards) {
        if (cards.length != 2) {
            return false;
        }
        var g0 = cards[0].rank;
        var g1 = cards[1].rank;
        if ((g0 == 800 && g1 == 1000) || (g0 == 1000 && g1 == 800)) {
            return true;
        }
        return false;
    },

    isLianDui: function (cards) {
        var size = cards.length;
        if (size < 6 || size % 2 != 0) {
            return -1;
        }
        for (var i = 0; i < size; i = i + 2) {
            if (cards[i].rank != cards[i + 1].rank) {
                return -1;
            }

            if (i < size - 2) {
                if (cards[i].rank - cards[i+2].rank != -1) {
                    return -1;
                }
            }
        }
        return cards[0].rank;
    },

    isFeiJi: function (cards) {
        if(cards.length < 6 || cards.length % 3 != 0) {
            return -1;
        }
        var info = CardInfo1.getCardInfo1(cards);
        if(info.threeCount * 3 == cards.length) {
            return info.three_index[0];
        }
        return -1;
    },

    isFeiJiDaiDan: function (cards) {
        if(cards.length < 8) {
            return -1;
        }
        var info = CardInfo1.getCardInfo1(cards);
        if(info.threeCount == (info.oneCount + info.twoCount * 2)) {
            return info.three_index[0];
        }
        return -1;
    },

    isFeiJiDaiShuang: function (cards) {
        if(cards.length < 10) {
            return -1;
        }
        var info = CardInfo1.getCardInfo1(cards);
        if(info.twoCount * 2 + info.threeCount * 3 == cards.length) {
            return info.three_index[0];
        }
        return -1;
    },

    isSiDaiDan: function (cards) {
        if (cards.length == 6) {
            for (var i = 0; i < 3; i++) {
                var g1 = cards[i].rank;
                var g2 = cards[i+1].rank;
                var g3 = cards[i+2].rank;
                var g4 = cards[i+3].rank;
                if (g1 == g2 && g1 == g3 && g1 == g4) {
                    return g3;
                }
            }
        }
        return -1;
    },

    isSiDaiShuang: function (cards) {
        if (cards.length == 8) {
            var g0 = cards[0].rank;
            var g1 = cards[1].rank;
            var g2 = cards[2].rank;
            var g3 = cards[3].rank;
            var g4 = cards[4].rank;
            var g5 = cards[5].rank;
            var g6 = cards[6].rank;
            var g7 = cards[7].rank;

            if (g0 == g1 && g1 != g2 && g2 == g3 && g3 != g4 && g4 == g5
                && g5 == g6 && g6 == g7) {
                return g7;
            }
            if (g0 == g1 && g1 != g2 && g2 == g3 && g3 == g4 && g4 == g5
                && g5 != g6 && g6 == g7) {
                return g2;
            }
            if (g0 == g1 && g1 == g2 && g2 == g3 && g3 != g4 && g4 == g5
                && g5 != g6 && g6 == g7) {
                return g0;
            }
        }
        return -1;
    }

};

module.exports = GameRule;