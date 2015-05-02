Quintus.ddzUI = function (Q) {

    //头像，昵称等位置
    Q.TX_X = 200;
    Q.TX_X_SPACING = 150;
    Q.TX_Y = 100;
    Q.NC_Y = 170;
    Q.ZB_Y = 210;

    Q.DIPAI_X = 330;
    Q.DIPAI_X_SPACING = 83;
    Q.DIPAI_Y = 60;
    Q.MYDIZHUIMG_X = 460;
    Q.MYDIZHUIMG_Y = 555;
    Q.RIGHTDIZHUIMG_X = 890;
    Q.RIGHTDIZHUIMG_Y = 250;
    Q.LEFTDIZHUIMG_X = 80;
    Q.LEFTDIZHUIMG_Y = 250;


//-----------------本方布局-----------------
    //本方牌堆位置
    Q.MYCARDS_X = 500;
    Q.MYCARDS_Y = 480;
    Q.MYCARDS_Y_SEL = Q.MYCARDS_Y - 20;
    Q.MYCARDS_X_SPACING = 20;

    //本方昵称位置
    Q.MYNAME_X = Q.MYCARDS_X;
    Q.MYNAME_Y = Q.MYCARDS_Y + 80;

    //本方文字位置
    Q.MYTEXT_X = Q.MYCARDS_X;
    Q.MYTEXT_Y = Q.MYCARDS_Y - 100;

    //本方出牌区域
    Q.MYPLAYCARDS_X = Q.MYCARDS_X;
    Q.MYPLAYCARDS_X_SPACING = 20;
    Q.MYPLAYCARDS_Y = 360;

    //本方按钮位置
    Q.BTN1_X = 390;
    Q.BTN2_X = 470;
    Q.BTN3_X = 550;
    Q.BTN4_X = 630;
    Q.BTN_Y = Q.MYCARDS_Y - 100;



//-----------------下家布局-----------------
    //下家牌堆位置
    Q.RIGHTCARDS_X = 820;
    Q.RIGHTCARDS_Y = 80;
    Q.RIGHTCARDS_Y_SPACING = 15;

    //下家昵称位置
    Q.RIGHTNAME_X = Q.RIGHTCARDS_X + 70;
    Q.RIGHTNAME_Y = 200;

    //下家文字位置
    Q.RIGHTTEXT_X = Q.RIGHTCARDS_X - 70;
    Q.RIGHTTEXT_Y = Q.RIGHTNAME_Y;

    //下家出牌区域
    Q.RIGHTPLAYCARDS_X = 730;
    Q.RIGHTPLAYCARDS_X_SPACING = 20;
    Q.RIGHTPLAYCARDS_Y = 180;



//-----------------上家布局-----------------
    //上家牌堆位置
    Q.LEFTCARDS_X = 150;
    Q.LEFTCARDS_Y = Q.RIGHTCARDS_Y;
    Q.LEFTCARDS_Y_SPACING = Q.RIGHTCARDS_Y_SPACING;

    //上家昵称位置
    Q.LEFTNAME_X = Q.LEFTCARDS_X - 70;
    Q.LEFTNAME_Y = Q.RIGHTNAME_Y;

    //上家文字位置
    Q.LEFTTEXT_X = Q.LEFTCARDS_X + 70;
    Q.LEFTTEXT_Y = Q.LEFTNAME_Y;

    //上家出牌区域
    Q.LEFTPLAYCARDS_X = 220;
    Q.LEFTPLAYCARDS_X_SPACING = 20;
    Q.LEFTPLAYCARDS_Y = Q.RIGHTPLAYCARDS_Y;





    Q.UI.Button.extend('BaseBtn', {
        init: function (props) {
            props.fill = '#CCC';
            props.highlight = '#999';
            if(props.hidden == undefined) {
                props.hidden = true;
            }
            this._super(props);
        }
    });

    Q.BaseBtn.extend('ReadyBtn', {
        init: function (props) {
            props.label = '准备';
            props.hidden = false;
            this._super(props);
            this.on('click');
        },

        click: function () {
            Q.ready();
        }
    });

    Q.BaseBtn.extend('OnePointBtn', {
        init: function () {
            this._super({label: '1分', x: Q.BTN1_X, y: Q.BTN_Y});
        },

        click: function () {
            console.log('1分');
            Q.grab(1);
        }
    });

    Q.BaseBtn.extend('TwoPointBtn', {
        init: function () {
            this._super({label: '2分', x: Q.BTN2_X, y: Q.BTN_Y});
        },

        click: function () {
            Q.grab(2);
        }
    });

    Q.BaseBtn.extend('ThreePointBtn', {
        init: function () {
            this._super({label: '3分', x: Q.BTN3_X, y: Q.BTN_Y});
        },

        click: function () {
            Q.grab(3);
        }
    });

    Q.BaseBtn.extend('BuJiaoBtn', {
        init: function () {
            this._super({label: '不叫', x: Q.BTN4_X, y: Q.BTN_Y});
        },

        click: function () {
            Q.grab(-1);
        }
    });

    Q.BaseBtn.extend('BuChuBtn', {
        init: function () {
            this._super({label: '不出', x: Q.BTN1_X, y: Q.BTN_Y});
        },

        click: function () {
            for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
                var card = Q['p' + Q.myIdx + 'Cards'][i];
                card.p.selected = false;
                card.setY(card.p.selected);
            }
            Q.buchu();
        }
    });

    Q.BaseBtn.extend('ChongXuanBtn', {
        init: function () {
            this._super({label: '重选', x: Q.BTN2_X, y: Q.BTN_Y});
        },

        click: function () {
            for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
                var card = Q['p' + Q.myIdx + 'Cards'][i];
                card.p.selected = false;
                card.setY(card.p.selected);
            }
        }
    });

    Q.BaseBtn.extend('TiShiBtn', {
        init: function () {
            this._super({label: '提示', x: Q.BTN3_X, y: Q.BTN_Y});
        },

        click: function () {
            Q.hint();
        }
    });

    Q.BaseBtn.extend('ChuPaiBtn', {
        init: function () {
            this._super({label: '出牌', x: Q.BTN4_X, y: Q.BTN_Y});
        },

        click: function () {
            var selCards = [];
            for(var i=0; i< Q['p' + Q.myIdx + 'Cards'].length; i++) {
                var card = Q['p' + Q.myIdx + 'Cards'][i];
                if(card.p.selected) {
                    selCards.push(card);
                }
            }

            Q.chupai(selCards);

        }
    });


    Q.UI.Text.extend('BaseText', {
        init: function(props) {
            this._super({
                color: 'yellow'
            }, props);
        }
    });

    Q.BaseText.extend('ReadyText', {
        init: function(props) {
            props.label = '准备';
            this._super(props);
        }
    });

    Q.BaseText.extend('PointText', {
        init: function(props) {
            if(props.point == '-1') {
                props.label = '不要';
            } else if(props.point == '1') {
                props.label = '1分';
            } else if(props.point == '2') {
                props.label = '2分';
            } else if(props.point == '3') {
                props.label = '3分';
            }
            this._super(props);
        }
    });

    Q.BaseText.extend('BuChuText', {
        init: function(props) {
            props.label = '不出';
            this._super(props);
        }
    });

    Q.BaseText.extend('InfoText', {
        init: function(props) {
            this._super(props);
        }
    });




};