Quintus.ddzSprites = function(Q) {
    Q.Sprite.extend("Poker", {
        init: function (props) {
            this._super(props);
        },

        touch: function (evt) {
            for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
                if(this.equals(Q['p' + Q.myIdx + 'Cards'][i])) {
                    Q.startIdx = i;
                    break;
                }
            }

        },

        touchEnd: function (evt) {
            for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
                if(this.equals(Q['p' + Q.myIdx + 'Cards'][i])) {
                    Q.endIdx = i;
                    break;
                }
            }
            Q.setCardsY();
        },
        
        setY: function () {
            if (this.p.selected) {
                this.p.y = Q.MYCARDS_Y_SEL;
            } else {
                this.p.y = Q.MYCARDS_Y;
            }
        },

        toString: function () {
            return this.p.sheet;
        },

        equals: function (card) {
            return this.p.sheet == card.p.sheet;
        }
    });

};