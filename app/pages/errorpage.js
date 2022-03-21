//这边基本上引入需要使用的资源less，api，需要使用的模块等等。
class errorpage extends Interstellar.pagesBase {
    complete() {
        this.app.header.showcrube();
        this.resize()
        this.styleModel(1)
        this.type = 'doctor';
        ES.selctorDoc('.headerCont').remove()
    }
    resize() {
        let ch = ES.selctorDoc(window).box().clientHeight
        ES.selctorDoc('.errorpage').css({ 'height': '300px' });
        ES.selctorDoc('.errorpage').css({ 'margin-top': (ch-360)/2 });
    }
}
module.exports = errorpage;