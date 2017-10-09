var model = {};
var view = {};
var tickRate;
var isGameOver = false;
var timer;

model.defaults = {
  defaultPos: function () { return [[20, 19], [19, 19], [18, 19]]; },
  dims: 40,
  defaultTickRate: 500,
  scoreIncrement: 10,
  tickDecrement: 50
};

tickRate = model.defaults.defaultTickRate;

model.calcDims = function () {
  var dims = model.defaults.dims;
  return $('#game').width() / dims;
};

model.snake = {
  cellsCoords: model.defaults.defaultPos(),
  direction: 'r',
  score: 0
};

model.randomPos = function () {
  var dims = model.defaults.dims;
  return Math.floor((Math.random() * dims) + 1);
};

model.food = {
  x: model.randomPos(),
  y: model.randomPos(),
  eaten: false
};

model.newGame = function () {
  isGameOver = false;
  tickRate = model.defaults.defaultTickRate;
  model.snake.cellsCoords = model.defaults.defaultPos();
  model.snake.direction = 'r';
  model.snake.score = 0;
  model.food.x = model.randomPos();
  model.food.y = model.randomPos();
  timer = setInterval(model.tick, tickRate);
};

model.ateItself = function () {
  var cellDict = {};
  var dictLength;
  var arrLength = model.snake.cellsCoords.length;
  model.snake.cellsCoords.forEach(function (c) {
    cellDict[c] = 1;
  });
  dictLength = Object.keys(cellDict).length;
  return dictLength !== arrLength;
};

model.isCollided = function () {
  var xHead = model.snake.cellsCoords[0][0];
  var yHead = model.snake.cellsCoords[0][1];
  var outOfxBounds = xHead < 1 || xHead > model.defaults.dims;
  var outOfyBounds = yHead < 1 || yHead > model.defaults.dims;
  if (outOfxBounds || outOfyBounds || model.ateItself()) {
    return true;
  }
  return false;
};

model.ateFood = function () {
  var xHead = model.snake.cellsCoords[0][0];
  var yHead = model.snake.cellsCoords[0][1];
  var tickDec = model.defaults.tickDecrement;
  var scoreInc = model.defaults.scoreIncrement;

  if (xHead === model.food.x && yHead === model.food.y) {
    model.food.eaten = true;
    model.snake.score += scoreInc;
    model.food.x = model.randomPos();
    model.food.y = model.randomPos();
    tickRate >= tickDec ? tickRate -= tickDec : tickRate = tickDec;
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

  if (model.ateFood()) {
    model.food.eaten = false;
    clearInterval(timer);
    timer = setInterval(model.tick, tickRate);
  } else {
    model.snake.cellsCoords.pop();
  }

  if (model.isCollided()) {
    isGameOver = true;
  }

  view.drawGame();
};

view.drawGame = function () {
  view.drawSnakeHead(model.snake.cellsCoords[0][0] + '_' + model.snake.cellsCoords[0][1]);
  view.drawSnakeBody(model.snake.cellsCoords);
  view.drawFood();
  view.drawHeader();
  view.drawScore();
  view.removeBtn();
  view.renderGame();
};

view.renderGrid = function () {
  var game = $('#game');
  var x;
  var y;
  var cell;
  var dims = model.defaults.dims;
  var cells = [];

  for (y = 1; y <= dims; y += 1) {
    for (x = 1; x <= dims; x += 1) {
      cell = $('<div class="cell"></div>');
      cell.width(model.calcDims());
      cell.height(cell.width());
      cell.attr('id', x + '_' + y);
      cells.push(cell);
    }
  }
  cells.forEach(function (c) {
    game.append(c);
  });
};

view.drawSnakeHead = function (pos) {
  if ($('.cell').hasClass('snake-head')) {
    $('.cell').removeClass('snake-head');
  }
  $('#' + pos).addClass('snake-head');
};

view.drawSnakeBody = function (cellArr) {
  var i;
  if ($('.cell').hasClass('snake-body')) {
    $('.cell').removeClass('snake-body');
  }
  for (i = 1; i < cellArr.length; i += 1) {
    $('#' + cellArr[i][0] + '_' + cellArr[i][1]).addClass('snake-body');
  }
};

view.drawFood = function () {
  if ($('.cell').hasClass('food')) {
    $('.cell').removeClass('food');
  }
  $('#' + model.food.x + '_' + model.food.y).addClass('food');
};

view.drawHeader = function () {
  if (isGameOver) {
    $('.title').html('Game Over!');
  } else {
    $('.title').html('Hello Snake');
  }
};

view.renderGame = function () {
  if (isGameOver) {
    clearInterval(timer);
    view.drawHeader();
    view.drawBtn();
    view.clickListener();
  }
};

view.drawScore = function () {
  $('.subtitle').html('Score: ' + model.snake.score);
};

view.drawBtn = function () {
  $('.section').append($('<button id="btn" class="button xcentered is-primary">New Game</button>'));
};

view.removeBtn = function () {
  $('#btn').remove();
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

view.clickListener = function () {
  var btnClicked = function () {
    model.newGame();
    view.drawGame();
  };
  $('#btn').on('click', btnClicked);
};

$(document).ready(function () {
  view.renderGrid();
  view.keysListener();
  timer = setInterval(model.tick, tickRate);
});
