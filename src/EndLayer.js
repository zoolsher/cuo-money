var EndLayer = function (score) {
  var limit = 6000;
  Tiny.Container.call(this);
  var width = window.innerWidth;
  var height = window.innerHeight;
  var text = new Tiny.BitmapText('you scored ' + score + ' points!', {
    font: '32px font',
    tint: 0xffffff
  });
  text.x = width / 2 - text.width / 2;
  text.y = height / 2 - text.height / 2;
  if (score >= limit) {
    var contactMe = new Tiny.Text('截图发给客秋同学\n可以领取五毛红包', {
      color: 0xffffff
    });
  }else{
    var contactMe = new Tiny.Text('再来一次吧\n达到'+limit+'分有大礼', {
      color: 0xffffff,
      align:'center'
    });
    contactMe.setEventEnabled(true);
    contactMe.on('pointerdown',function(){
      Tiny.app.replaceScene(new StartLayer());
    });
  }
  contactMe.x = width / 2 - contactMe.width / 2;
  contactMe.y = text.y + text.height * 2;
  this.addChild(text);
  this.addChild(contactMe);
};

EndLayer.prototype = Object.create(Tiny.Container.prototype);
EndLayer.prototype.constructor = EndLayer;
