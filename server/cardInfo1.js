var Map = require('./map');

var CardInfo1 = function(cards) {
    this.cards = cards;
    this.one_index = [];		// 记录单张的牌
    this.two_index = [];		// 记录对子的牌
    this.three_index = [];	// 记录3张
    this.oneCount = 0;
    this.twoCount = 0;
    this.threeCount = 0;

}

CardInfo1.prototype = {
    getCardInfo1: function () {
        var map = new Map();
        for(var i=0; i<this.cards.length; i++) {
            var card = this.cards[i];
            if(map.get(card.rank) == null) {
                map.put(card.rank, 1);
            } else {
                map.put(card.rank, map.get(card.rank)+1);
            }
        }

        var keys = map.keys();
        for(var j=0; j<keys.length; j++) {
            var key = keys[j];
            var value = map.get(key);
            if(value == 3) {
                this.three_index.push(key);
            }
        }

        this.threeCount = this.three_index.length;
        this.three_index = this.maxSequence(this.three_index);
        this.oneCount = (this.threeCount - this.three_index.length) * 3;

        for(var k=0; k<keys.length; k++) {
            var key = keys[k];
            var value = map.get(key);
            if(value == 1) {
                this.one_index.push(key);
            } else if(value == 2) {
                this.two_index.push(key);
            }
        }

        this.oneCount += this.one_index.length;
        this.twoCount = this.two_index.length;
        this.threeCount = this.three_index.length;
        return this;

    },

    maxSequence: function (array) {
        var parseResults = [];
        parseResults.push([]);
        for(var i=0; i<array.length; i++) {
            if(i < array.length-1 && array[i] + 1 == array[i+1]) {
                parseResults[parseResults.length-1].push(array[i]);
                continue;
            }
            if(i > 0 && array[i] - 1 == array[i-1]) {
                parseResults[parseResults.length-1].push(array[i]);
                parseResults.push([]);
            }
        }
        this.sortByAsc(parseResults);
        return parseResults[parseResults.length-1];
    },

    sortByAsc: function (parseResults) {
        parseResults.sort(function(a, b) {
            return a.length - b.length;
        });
    }
}


exports.getCardInfo1 = function(cards) {
    var info = new CardInfo1(cards);
    return info.getCardInfo1();
};
