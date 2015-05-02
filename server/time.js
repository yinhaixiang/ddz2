var BaseClass = function () {

};

BaseClass.f1 = function () {//定义静态方法
    console.log(' This is a static method ');
}

module.exports = BaseClass;

console.log('abc');