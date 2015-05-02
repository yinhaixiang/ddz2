var Map = function () {
    this.keyArray = [];
    this.valueArray = [];
};

var proto = Map.prototype;

proto.put = function (key, value) {
    var elementIndex = this.findIt(key);
    if (elementIndex == (-1)) {
        this.keyArray.push(key);
        this.valueArray.push(value);
    } else {
        this.valueArray[elementIndex] = value;
    }
};

proto.findIt = function (key) {
    var result = -1;
    for (var i = 0; i < this.keyArray.length; i++) {
        if (this.keyArray[i].equals) {
            if (this.keyArray[i].equals(key)) {
                result = i;
            }
        } else if (this.keyArray[i] == key) {
            result = i;
            break;
        }
    }
    return result;
};

proto.get = function (key) {
    var result = null;
    var elementIndex = this.findIt(key);

    if (elementIndex != -1) {
        result = this.valueArray[elementIndex];
    }
    return result;
};

proto.containsKey = function (key) {
    return this.findIt(key) != -1;
};

proto.containsValue = function (value) {
    for (var i = 0; i < this.valueArray.length; i++) {
        if (this.valueArray[i].equals) {
            if (this.valueArray[i].equals(value)) {
                return true;
            }
        } else if (this.valueArray[i] == value) {
            return true;
        }
    }

    return false;
};

proto.remove = function (key) {
    var value = null;
    var elementIndex = this.findIt(key);
    if (elementIndex != -1) {
        value = this.get(key);
        this.keyArray.splice(elementIndex, 1);
        this.valueArray.splice(elementIndex, 1);
    }
    return value;
};

proto.clear = function () {
    this.keyArray = [];
    this.valueArray = [];
};

proto.isEmpty = function () {
    return this.keyArray.length == 0;
};

proto.size = function () {
    return this.keyArray.length;
};

proto.keys = function () {
    return this.keyArray;
};

proto.values = function () {
    return this.valueArray;
};

proto.toString = function () {
    var str = '{';
    for (var i = 0; i < this.keyArray.length; i++) {
        str += this.keyArray[i] + ':' + this.valueArray[ i ] + ", ";
    }
    if (str.length > 1) {
        str = str.substring(0, str.length - 2);
    }
    str += '}';
    return str;
};


module.exports = Map;

