var StartLayer = function () {
  Tiny.Container.call(this);
  var self = this;
  var totalTime = 10;
  self.score = 0;
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;

  function money() {
    var sp = Tiny.Sprite.fromImage(RESOURCES['money']);
    sp.setScale(0.3);
    return sp;
  }

  var moneyBaseGroup = new Tiny.Container;
  var moneyTmp;
  for (var i = 0; i < 10; i++) {
    moneyTmp = money();
    moneyTmp.x = i * 2;
    moneyTmp.y = i * 2;
    moneyBaseGroup.addChild(moneyTmp);
  }
  moneyBaseGroup.x = WIDTH / 2 - moneyBaseGroup.width / 2 - 5;
  moneyBaseGroup.y = 0 - moneyBaseGroup.height / 2;

  var scoreBoard = new Tiny.BitmapText(self.score,{
    font:"32px font",
    tint:0xffffff
  });
  

  var timeBoard = new Tiny.BitmapText("time:"+totalTime,{
    font:"32px font",
    tint:0xffffff
  });
  function updateTime(){
    timeBoard.text = "time:"+totalTime;
    timeBoard.x = WIDTH-timeBoard.width;
    timeBoard.y = 0;
  }
  updateTime();
  self.addChild(timeBoard);


  var currentMovingMoney = null;
  var lastX = null;
  var lastY = null;

  var eventHandlerContainer = new Tiny.Sprite();
  eventHandlerContainer.width = WIDTH;
  eventHandlerContainer.height = HEIGHT;
  eventHandlerContainer.setEventEnabled(true);
  eventHandlerContainer.on('pointerdown', function () {
    if (currentMovingMoney == null) {
      console.log('new');
      currentMovingMoney = money();
      currentMovingMoney.x = moneyBaseGroup.x;
      currentMovingMoney.y = moneyBaseGroup.y;
      self.addChild(currentMovingMoney);
      self.setChildIndex(currentMovingMoney, 0);
    }else{
      currentMovingMoney.x = moneyBaseGroup.x;
      currentMovingMoney.y = moneyBaseGroup.y;
    }
  });
  eventHandlerContainer.on('pointermove', function (t) {
    var x = t.data.global.x
    var y = t.data.global.y;
    if (lastX !== null) {
      var dx = x - lastX;
      var dy = y - lastY;
      currentMovingMoney.x += dx;
      currentMovingMoney.y += dy;
    }
    lastX = x;
    lastY = y;
  });
  eventHandlerContainer.on('pointerupoutside',function(){
    out();
  })
  eventHandlerContainer.on('pointerup', function () {
    out();
  })
  eventHandlerContainer.on('pointerout', function () {
    console.log(arguments);
    out();
  })

  function out(){
    lastX = null;
    lastY = null;
    if (currentMovingMoney.y > HEIGHT * 0.01) {
      moveOut(currentMovingMoney);
      currentMovingMoney = null;
    }else{
      currentMovingMoney.x = moneyBaseGroup.x;
      currentMovingMoney.y = moneyBaseGroup.y;
    }
  }

  var moveQueue = [];
  var ticker = new Tiny.ticker.Ticker();
  ticker.autostart = true;
  ticker.add(function () {
    if (moveQueue.length === 0) {
      return;
    } else {
      for (var i = 0; i < moveQueue.length; i++) {
        var item = moveQueue[i];
        var index = i;
        item.y += 10;
        if (item.y > HEIGHT) {
          moveQueue.splice(index, 1)
        }
      }
    }
  });
  ticker.start();

  function moveOut(obj) {
    self.score+=100;
    scoreBoard.text = self.score;
    moveQueue.push(obj);
  }


  var timer = setInterval(function(){
    totalTime--;
    updateTime();
    if(totalTime===0){
      clearInterval(timer);
      Tiny.app.replaceScene(new EndLayer(self.score),'SlideInR', 800);
    }
  },1000);

  this.addChild(moneyBaseGroup);
  this.addChild(eventHandlerContainer);
  self.addChild(scoreBoard);
};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;
