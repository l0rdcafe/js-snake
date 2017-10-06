var model = {};
var view = {};
var handlers = {};

model.calcDims = function () {
  return $('#game').width() / 40;
};

model.snake = function () {
  var snake = { snake: $('snake-head') };
};

view.renderGame = function () {
  var game = $('#game');
  var x;
  var y;
  var square;

  for (x = 0; x < 40; x += 1) {
    for (y = 0; y < 40; y += 1) {
      square = $('<div class="square"></div>');
      square.width(model.calcDims());
      square.height(square.width());
      game.append(square);
      if (x === 18 && y === 19) {
        square.addClass('snake-head');
      }
    }
  }
};

view.renderGame();
