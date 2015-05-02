var CardInfo2 = function() {
    this.danList = [];	// 单牌
    this.duiZiList = [];	// 对子
    this.sanBuDaiList = []; // 3不带
    this.sanDaiYiList = []; // 3带1
    this.sanDaiErList = []; // 3带2
    this.shunZiList = []; // 顺子
    this.lianDuiList = []; // 连对
    this.feiJiList = []; // 飞机
    this.feiJiDaiDanList = []; // 飞机带单
    this.feiJiDaiShuangList = [];	//飞机带双
    this.siDaiDanList = []; // 4带单
    this.siDaiShuangList = []; // 4带对子
    this.zhaDanList = []; // 炸弹
    this.wangZha = []; // 王炸
}

CardInfo2.prototype = {
    getDan: function (cards, rank) {
        for(var idx in cards) {
            var card = cards[idx];
            if(card.rank == rank) {
                return card;
            }
        }
        return null;
    },

    getDuiZi: function (cards, rank) {
        for(var i=0; i<cards.length-1; i++) {
            var c1 = cards[i];
            var c2 = cards[i+1];
            if(c1.rank == c2.rank && c1.rank == rank) {
                var result = [];
                result.push(c1);
                result.push(c2);
                return result;
            }
        }
        return null;
    },

    getSanBuDai: function (cards, rank) {
        for(var i=0; i<cards.length-2; i++) {
            var c1 = cards[i];
            var c2 = cards[i+1];
            var c3 = cards[i+2];
            if(c1.rank == c2.rank && c1.rank == c3.rank && c1.rank == rank) {
                var result = [];
                result.push(c1);
                result.push(c2);
                result.push(c3);
                return result;
            }
        }
        return null;
    },

    getZhaDan: function (cards, rank) {
        for(var i=0; i<cards.length-3; i++) {
            var c1 = cards[i];
            var c2 = cards[i+1];
            var c3 = cards[i+2];
            var c4 = cards[i+3];
            if(c1.rank == c2.rank && c1.rank == c3.rank && c1.rank == c3.rank && c1.rank == c4.rank && c1.rank == rank) {
                var result = [];
                result.push(c1);
                result.push(c2);
                result.push(c3);
                result.push(c4);
                return result;
            }
        }
        return null;
    },

    getWangZha: function (cards) {
        for(var i=0; i<cards.length-1; i++) {
            var c1 = cards[i];
            var c2 = cards[i+1];
            if(c1.rank == 800 && c2.rank == 1000) {
                var result = [];
                result.push(c1);
                result.push(c2);
                return result;
            }
        }
        return null;
    },

    getShunZi: function (cards, beginRank, length) {
        var result = [];
        for(var i=0; i<length; i++) {
            var subList = this.getDan(cards, beginRank+i);
            if(subList == null) {
                result = null;
                break;
            } else {
                result.push(subList);
            }
        }
        return result;
    },

    getLianDui: function (cards, beginRank, length) {
        var result = [];
        for(var i=0; i<length; i++) {
            var subList = this.getDuiZi(cards, beginRank+i);
            if(subList == null) {
                result = null;
                break;
            } else {
                result.push(subList[0]);
                result.push(subList[1]);
            }
        }
        return result;
    },

    getSanDaiYi: function (cards, rank) {
        var list = this.getSanBuDai(cards, rank);
        if(list != null) {
            for(var i=0; i<cards.length; i++) {
                var card = cards[i];
                if(card.rank != rank) {
                    list.push(card);
                    return list;
                }
            }
        }
        return null;
    },

    getSanDaiEr: function (cards, rank) {
        var list = this.getSanBuDai(cards, rank);
        if(list != null) {
            for(var i=0; i<cards.length; i++) {
                var card = cards[i];
                if(card.rank != rank) {
                    var subList = this.getDuiZi(cards, card.rank);
                    if(subList != null) {
                        list.push(subList[0]);
                        list.push(subList[1]);
                        return list;
                    }
                }
            }
        }
        return null;
    },

    getFeiJi: function (cards, beginRank, length) {
        var result = [];
        for(var i=0; i<length; i++) {
            var subList = this.getSanBuDai(cards, beginRank+i);
            if(subList == null) {
                result = null;
                break;
            } else {
                result.push(subList[0]);
                result.push(subList[1]);
                result.push(subList[2]);
            }
        }
        return result;
    },

    getFeiJiDaiDan: function (cards, beginRank, length) {
        var result = this.getFeiJi(cards, beginRank, length);
        if(result == null) {
            return null;
        }
        var count = 0;
        for(var i=0; i<cards.length; i++) {
            var card = cards[i];
            if(result.indexOf(card) == -1) {
                result.push(card);
                count++;
                if(count == length) {
                    return result;
                }
            }
        }
        return null;
    },

    getFeiJiDaiShuang: function (cards, beginRank, length) {
        var result = this.getFeiJi(cards, beginRank, length);
        if(result == null) {
            return null;
        }
        var count = 0;
        for(var i=0; i<cards.length; i++) {
            var card = cards[i];
            if(result.indexOf(card) == -1) {
                var subList = this.getDuiZi(cards, card.rank);
                if(subList == null) {
                    return null;
                }
                if(result.indexOf(subList[0]) == -1 && result.indexOf(subList[1]) == -1) {
                    result.push(subList[0]);
                    result.push(subList[1]);
                    count++;
                }
                if(count == length) {
                    return result;
                }
            }
        }
        return null;
    },

    getSiDaiDan: function (cards, rank) {
        var list = this.getZhaDan(cards, rank);
        if(list == null) {
            return null;
        }
        var count = 0;
        if(list != null) {
            for(var i=0; i<cards.length; i++) {
                var card = cards[i];
                if(card.rank != rank) {
                    list.push(card);
                    count++;
                    if(count == 2) {
                        return list;
                    }
                }
            }
        }
        return null;
    },

    getSiDaiShuang: function (cards, rank) {
        var list = this.getZhaDan(cards, rank);
        if(list == null) {
            return null;
        }
        var count = 0;
        if(list != null) {
            for(var i=0; i<cards.length; i++) {
                var card = cards[i];
                if(list.indexOf(card) == -1) {
                    var subList = this.getDuiZi(cards, card.rank);
                    if(subList == null) {
                        return null;
                    }
                    if(list.indexOf(subList[0]) == -1 && list.indexOf(subList[1]) == -1) {
                        list.push(subList[0]);
                        list.push(subList[1]);
                        count++;
                    }
                    if(count == 2) {
                        return list;
                    }
                }
            }
        }
        return null;
    },

    getCardInfo2: function(cards, rank, length) {
        if(this.getWangZha(cards) != null) {
            this.wangZha = this.getWangZha(cards);
        }

        for(var j=3; j< 18; j++) {
            if(j==15 || j==16) {
                continue;
            }
            if(this.getZhaDan(cards, j) != null) {
                this.zhaDanList.push(this.getZhaDan(cards, j));
            }
        }

        for(var i=rank+1; i<18; i++) {
            if(i==15 || i==16) {
                continue;
            }
            var dan = this.getDan(cards, i);
            if(dan != null) {
                var tmp = [];
                tmp.push(dan);
                this.danList.push(tmp);
            }
            var duiZi = this.getDuiZi(cards, i);
            if(duiZi != null) {
                this.duiZiList.push(duiZi);
            }
            var sanBuDai = this.getSanBuDai(cards, i);
            if(sanBuDai != null) {
                this.sanBuDaiList.push(sanBuDai);
            }
            var shunZi = this.getShunZi(cards, i, length)
            if(shunZi != null) {
                this.shunZiList.push(shunZi);
            }
            var lianDui = this.getLianDui(cards, i, length);
            if(lianDui != null) {
                this.lianDuiList.push(lianDui);
            }
            var sanDaiYi = this.getSanDaiYi(cards, i);
            if(sanDaiYi != null) {
                this.sanDaiYiList.push(sanDaiYi);
            }
            var sanDaiEr = this.getSanDaiEr(cards, i);
            if(sanDaiEr != null) {
                this.sanDaiErList.push(sanDaiEr);
            }
            var feiJi = this.getFeiJi(cards, i, length)
            if(feiJi != null) {
                this.feiJiList.push(feiJi);
            }
            var feiJiDaiDan = this.getFeiJiDaiDan(cards, i, length);
            if(feiJiDaiDan != null) {
                this.feiJiDaiDanList.push(feiJiDaiDan);
            }
            var feiJiDaiShuang = this.getFeiJiDaiShuang(cards, i, length);
            if(feiJiDaiShuang != null) {
                this.feiJiDaiShuangList.push(feiJiDaiShuang);
            }
            var siDaiDan = this.getSiDaiDan(cards, i);
            if(siDaiDan != null) {
                this.siDaiDanList.push(siDaiDan);
            }
            var siDaiShuang = this.getSiDaiShuang(cards, i);
            if(siDaiShuang != null) {
                this.siDaiShuangList.push(siDaiShuang);
            }
        }
        return this;
    }
}

exports.getCardInfo2 = function (cards, rank, length) {
    var info = new CardInfo2();
    return info.getCardInfo2(cards, rank, length);
};











