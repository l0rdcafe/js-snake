var model = {};
var view = {};
var tickRate = 500;
var isGameOver = false;
var timer;

model.calcDims = function () {
  return $('#game').width() / 40;
};

model.snake = {
  cellsCoords: [[20, 19], [19, 19], [18, 19]],
  direction: 'r'
};

model.isCollided = function () {
  var xHead = model.snake.cellsCoords[0][0];
  var yHead = model.snake.cellsCoords[0][1];
  var outOfxBounds = xHead < 1 || xHead > 40;
  var outOfyBounds = yHead < 1 || yHead > 40;
  if (outOfxBounds || outOfyBounds) {
    return true;
  }
  return false;
};

model.tick = function () {
  var snakeDir = model.snake.direction;
  var xHead = model.snake.cellsCoords[0][0];
  var yHead = model.snake.cellsCoords[0][1];
  if (snakeDir === 'r') {
    model.snake.cellsCoords.unshift([(xHead + 1), yHead]);
  } else if (snakeDir === 'l') {
    model.snake.cellsCoords.unshift([(xHead - 1), yHead]);
  } else if (snakeDir === 'u') {
    model.snake.cellsCoords.unshift([xHead, (yHead + 1)]);
  } else if (snakeDir === 'd') {
    model.snake.cellsCoords.unshift([xHead, (yHead - 1)]);
  }
  model.snake.cellsCoords.pop();

  if (model.isCollided()) {
    isGameOver = true;
  }
  view.drawSnakeHead(model.snake.cellsCoords[0][0] + '_' + model.snake.cellsCoords[0][1]);
  view.drawSnakeBody(model.snake.cellsCoords[1][0] + '_' + model.snake.cellsCoords[1][1], model.snake.cellsCoords[2][0] + '_' + model.snake.cellsCoords[2][1]);
  view.renderGame();
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

view.drawSnakeHead = function (pos) {
  if ($('.cell').hasClass('snake-head')) {
    $('.cell').removeClass('snake-head');
  }
  $('#' + pos).addClass('snake-head');
};

view.drawSnakeBody = function (pos1, pos2) {
  if ($('.cell').hasClass('snake-body')) {
    $('.cell').removeClass('snake-body');
  }
  $('#' + pos1).addClass('snake-body');
  $('#' + pos2).addClass('snake-body');
};

view.drawGameOver = function () {
  $('.title').html('Game Over!');
};

view.renderGame = function () {
  if (isGameOver) {
    view.drawGameOver();
    clearInterval(timer);
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
