/* eslint-disable no-unused-expressions */

const model = {};
const view = {};
let tickRate;
let isGameOver = false;
let timer;

model.defaults = {
  defaultPos() {
    return [[20, 19], [19, 19], [18, 19]];
  },
  dims: 40,
  defaultTickRate: 500,
  scoreIncrement: 10,
  tickDecrement: 50
};

tickRate = model.defaults.defaultTickRate;

model.snake = {
  cellsCoords: model.defaults.defaultPos(),
  direction: "r",
  score: 0
};

model.randomPos = function() {
  const { dims } = model.defaults;
  return Math.floor(Math.random() * dims + 1);
};

model.food = {
  x: model.randomPos(),
  y: model.randomPos(),
  eaten: false
};

model.newGame = function() {
  isGameOver = false;
  tickRate = model.defaults.defaultTickRate;
  model.snake.cellsCoords = model.defaults.defaultPos();
  model.snake.direction = "r";
  model.snake.score = 0;
  model.food.x = model.randomPos();
  model.food.y = model.randomPos();
  timer = setInterval(model.tick, tickRate);
};

model.ateItself = function() {
  const cellSet = new Set(model.snake.cellsCoords);
  const arrLength = model.snake.cellsCoords.length;
  const setLength = cellSet.size;
  return setLength !== arrLength;
};

model.isCollided = function() {
  const xHead = model.snake.cellsCoords[0][0];
  const yHead = model.snake.cellsCoords[0][1];
  const outOfxBounds = xHead < 1 || xHead > model.defaults.dims;
  const outOfyBounds = yHead < 1 || yHead > model.defaults.dims;
  if (outOfxBounds || outOfyBounds || model.ateItself()) {
    return true;
  }
  return false;
};

model.ateFood = function() {
  const xHead = this.snake.cellsCoords[0][0];
  const yHead = this.snake.cellsCoords[0][1];
  const tickDec = this.defaults.tickDecrement;
  const scoreInc = this.defaults.scoreIncrement;

  if (xHead === this.food.x && yHead === this.food.y) {
    this.food.eaten = true;
    this.snake.score += scoreInc;
    this.food.x = this.randomPos();
    this.food.y = this.randomPos();
    tickRate >= tickDec ? (tickRate -= tickDec) : (tickRate = tickDec);
    return true;
  }
  return false;
};

model.tick = function() {
  const snakeDir = model.snake.direction;
  const xHead = model.snake.cellsCoords[0][0];
  const yHead = model.snake.cellsCoords[0][1];
  if (snakeDir === "r") {
    model.snake.cellsCoords.unshift([xHead + 1, yHead]);
  } else if (snakeDir === "l") {
    model.snake.cellsCoords.unshift([xHead - 1, yHead]);
  } else if (snakeDir === "u") {
    model.snake.cellsCoords.unshift([xHead, yHead + 1]);
  } else if (snakeDir === "d") {
    model.snake.cellsCoords.unshift([xHead, yHead - 1]);
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

view.drawGame = function() {
  this.drawSnakeHead(`${model.snake.cellsCoords[0][0]}_${model.snake.cellsCoords[0][1]}`);
  this.drawSnakeBody(model.snake.cellsCoords);
  this.drawFood();
  this.drawHeader();
  this.drawScore();
  this.removeBtn();
  this.renderGame();
};

view.renderGrid = function() {
  const $game = $("#game");
  let x;
  let y;
  let cell;
  const { dims } = model.defaults;
  const cellLength = $game.width() / dims;
  const cells = $(document.createDocumentFragment());

  for (y = 1; y <= dims; y += 1) {
    for (x = 1; x <= dims; x += 1) {
      cell = $('<div class="cell"></div>');
      cell.width(cellLength);
      cell.height(cellLength);
      cell.attr("id", `${x}_${y}`);
      cells.append(cell);
    }
  }
  $game.append(cells);
};

view.drawSnakeHead = function(pos) {
  if ($(".cell").hasClass("snake-head")) {
    $(".cell").removeClass("snake-head");
  }
  $(`#${pos}`).addClass("snake-head");
};

view.drawSnakeBody = function(cellArr) {
  let i;
  if ($(".cell").hasClass("snake-body")) {
    $(".cell").removeClass("snake-body");
  }
  for (i = 1; i < cellArr.length; i += 1) {
    $(`#${cellArr[i][0]}_${cellArr[i][1]}`).addClass("snake-body");
  }
};

view.drawFood = function() {
  if ($(".cell").hasClass("food")) {
    $(".cell").removeClass("food");
  }
  $(`#${model.food.x}_${model.food.y}`).addClass("food");
};

view.drawHeader = function() {
  if (isGameOver) {
    $(".title").html("Game Over!");
  } else {
    $(".title").html("Hello Snake");
  }
};

view.renderGame = function() {
  if (isGameOver) {
    clearInterval(timer);
    this.drawHeader();
    this.drawBtn();
    this.clickListener();
  }
};

view.drawScore = function() {
  $(".subtitle").html(`Score: ${model.snake.score}`);
};

view.drawBtn = function() {
  $(".section").append($('<button id="btn" class="button xcentered is-primary">New Game</button>'));
};

view.removeBtn = function() {
  $("#btn").remove();
};

view.keysListener = function() {
  const changeDir = function(event) {
    const leftDir = event.which === 37 || event.keyCode === 37;
    const downDir = event.which === 38 || event.keyCode === 38;
    const rightDir = event.which === 39 || event.keyCode === 39;
    const upDir = event.which === 40 || event.keyCode === 40;
    if (leftDir) {
      model.snake.direction = "l";
    } else if (upDir) {
      model.snake.direction = "u";
    } else if (rightDir) {
      model.snake.direction = "r";
    } else if (downDir) {
      model.snake.direction = "d";
    }
  };
  $(document).on("keypress", changeDir);
};

view.clickListener = function() {
  const btnClicked = function() {
    model.newGame();
    view.drawGame();
  };
  $("#btn").on("click", btnClicked);
};

$(document).ready(() => {
  view.renderGrid();
  view.keysListener();
  timer = setInterval(model.tick, tickRate);
});
