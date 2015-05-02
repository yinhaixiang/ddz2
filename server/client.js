//定义客户端操作对象
var Client = function (server, socket) {
    //绑定服务器
    this.server = server;
    //绑定的socket
    this.socket = socket;
    //用户信息
    this.user = null;
    //绑定事件
    this.bindEvent();
};

//定义客户端各操作函数
Client.prototype = {
    toString: function () {
        return "[uname:" + this.user.uname + ",sid:" + this.socket.id + "]";
    },
    //绑定事件
    bindEvent: function () {
        if (this.socket) {
            var self = this;
            //注册断开连接事件
            this.socket.on("disconnect", function () {
                self.disconnect();
            });
            //注册登陆事件
            this.socket.on("login", function (user, fn) {
                self.login(user, fn);
            });
            //注册准备事件
            this.socket.on("ready", function () {
                self.ready();
            });
            //注册抢地主事件
            this.socket.on("grab", function (point) {
                self.grab(point);
            });

            //注册出牌事件
            this.socket.on("chupai", function (cards) {
                self.chupai(cards);
            });

            //注册不出事件
            this.socket.on("buchu", function () {
                self.buchu();
            });

            //注册提示事件
            this.socket.on("hint", function (hintTime) {
                self.hint(hintTime);
            });

        }
    },

    //处理断开连接
    disconnect: function () {
        if(!this.user) {
            return;
        }
        if(this.server.isUserExists(this.user)) {
            console.log("用户离开：" + this.user.uname);
            this.server.removeUser(this.user);
            //通知客户端;
            this.server.updateUserInfo();
        }
    },


    //处理用户登录
    login: function (user, fn) {
        this.user = user;
        if (this.server.users.length >= 3) {
            fn(0);
            return;
        }
        var isExists = this.server.isUserExists(user);
        if (!isExists) {
            this.server.users.push(user);
            fn(1);
            this.server.updateUserInfo();
        } else {
            fn(2);
        }
    },

    ready: function () {
        this.user.isReady = true;
        this.server.updateUserInfo();
        var count = 0;
        for (var i = 0; i < this.server.users.length; i++) {
            if (this.server.users[i].isReady) {
                count++;
            }
        }
        //如果3人都准备，游戏开始
        if (count == 3) {
            this.server.gameStart();
        }
    },
    
    grab: function (point) {
        this.server.grab(point);
    },

    chupai: function(cards) {
        if(this.server.dealerIdx == this.server.biggerIdx && cards.length == 0) {
            this.socket.emit('chupaiWrong', {});
            return;
        }

        var nowCards = this.server.transCards(cards);
        var isBigger = this.server.isBigger(nowCards);
        if(isBigger) {
            this.server.chupai(nowCards);
        } else {
            this.socket.emit('chupaiWrong', {});
        }
    },

    buchu: function() {
        if(this.server.dealerIdx == this.server.biggerIdx) {
            this.socket.emit('chupaiWrong', {});
            return;
        }
        this.server.buchu();
    },

    hint: function (hintTime) {
        this.server.hint(hintTime);
    }
}

//输出模块
module.exports = Client;