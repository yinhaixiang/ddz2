var Card = function(rank, suit) {
    this.rank = parseInt(rank);
    this.suit = suit;
    this.selected = false;
    this.sheet = this.suit + this.rank;
    if(this.suit == 'DW' || this.suit == 'XW') {
        this.value = this.rank;
    } else {
        this.value = this.rank * 20 + (this.suit.charCodeAt(0) - 65);
    }
}

Card.prototype.toString = function () {
    return this.suit + this.rank;
};

Card.prototype.equals = function (card) {
    return this.value == card.value;
};

module.exports = Card;