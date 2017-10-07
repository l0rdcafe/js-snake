var model = {};
var view = {};
var tickRate = 500;
var isGameOver = false;
var timer;

model.calcDims = function () {
  return $('#game').width() / 40;
};

model.snake = {
  x: 20,
  y: 19,
  direction: 'r'
};

model.isCollided = function () {
  var outOfxBounds = model.snake.x < 1 || model.snake.x > 40;
  var outOfyBounds = model.snake.y < 1 || model.snake.y > 40;
  if (outOfxBounds || outOfyBounds) {
    return true;
  }
  return false;
};

model.tick = function () {
  var snakeDir = model.snake.direction;
  if (snakeDir === 'r') {
    model.snake.x += 1;
  } else if (snakeDir === 'l') {
    model.snake.x -= 1;
  } else if (snakeDir === 'u') {
    model.snake.y += 1;
  } else if (snakeDir === 'd') {
    model.snake.y -= 1;
  }

  if (model.isCollided()) {
    isGameOver = true;
  }
  view.renderGame();
  view.drawSnake(model.snake.x + '_' + model.snake.y);
};

view.renderGrid = function () {
  var game = $('#game');
  var x;
  var y;
  var cell;

  for (y = 1; y <= 40; y += 1) {
    for (x = 1; x <= 40; x += 1) {
      cell = $('<div class="cell"></div>');
      cell.width(model.calcDims());
      cell.height(cell.width());
      cell.attr('id', x + '_' + y);
      game.append(cell);
    }
  }
};

view.drawSnake = function (pos) {
  if ($('.cell').hasClass('snake-head')) {
    $('.cell').removeClass('snake-head');
  }
  $('#' + pos).addClass('snake-head');
};

view.drawGameOver = function () {
  $('.title').html('Game Over!');
};

view.renderGame = function () {
  if (isGameOver) {
    view.drawGameOver();
    clearInterval(timer);
  } else {
    view.drawSnake('20_19');
  }
};

view.keysListener = function () {
  var changeDir = function (event) {
    var leftDir = event.which === 37 || event.keyCode === 37;
    var downDir = event.which === 38 || event.keyCode === 38;
    var rightDir = event.which === 39 || event.keyCode === 39;
    var upDir = event.which === 40 || event.keyCode === 40;
    if (leftDir) {
      model.snake.direction = 'l';
    } else if (upDir) {
      model.snake.direction = 'u';
    } else if (rightDir) {
      model.snake.direction = 'r';
    } else if (downDir) {
      model.snake.direction = 'd';
    }
  };
  $(document).on('keypress', changeDir);
};

$(document).ready(function () {
  view.renderGrid();
  view.keysListener();
  timer = setInterval(model.tick, tickRate);
});
