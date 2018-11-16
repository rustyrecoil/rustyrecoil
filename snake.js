const sprayPattern = [{x: 0, y: 0}, {x: -14, y: -25}, {x: -4, y: -24}, {x: -29, y: -17}, {x: -20, y: -25},
		{x: 8, y: -13}, {x: 5, y: -14}, {x: 14, y: -3}, {x: 21, y: -13}, {x: 24, y: -11},
		{x: 14, y: -6}, {x: 21, y: 2}, {x: 7, y: -23}, {x: 16, y: -6}, {x: 3, y: -16},
		{x: -2, y: -25}, {x: -28, y: -16}, {x: -11, y: -12}, {x: -20, y: -28}, {x: -26, y: -2},
		{x: -23, y: -12}, {x: -20, y: -6}, {x: -17, y: -2}, {x: -12, y: -10}, {x: -10, y: -10},
		{x: 5, y: -23}, {x: 22, y: 3}, {x: 17, y: -29}, {x: 40, y: -16}, {x: 20, y: -17}];

var markers = [];
var mousemarkers = [];
		
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var mouseX = 0;
var mouseY = 0;

const startingX = canvas.width / 2;
const startingY = 100;

var hitRadius = 2;
var futureSpray = document.getElementById("futureSpray");
var isPlaying = false;
var speedMultiplier = 1;
var globalTickInterval = 0;
var globalShotCount = 0;

var puck = {x: startingX, y: startingY, radius:8};

function startPlaying() {
	isPlaying = true;
	globalTickInterval = 0;
	globalShotCount = 0;
	puck.x = 0;
	puck.y = 0;
	markers = [];
	mousemarkers = [];
	
	tickInterval = setInterval(function(){
		tick();
	}, 130/10 * speedMultiplier);
}

function getIntermediateTick() {
	return globalTickInterval % 10;
}

function stopPlaying() {
	isPlaying = false;
	clearInterval(tickInterval);
}

function isInsidePuck() {//change to distance from puck
	if(mouseX >= puck.x && mouseX <= puck.x + puck.radius && mouseY >= puck.y && mouseY <= puck.y + puck.radius) {
		return true;
	}
	return false;
}

function tick() {
	console.log("tick: "+globalTickInterval);
	if(globalShotCount == 29) {
		stopPlaying();
		return;
	}
	var nextX = startingX;
	var nextY = startingY;
	if(globalTickInterval > 0) {
		nextX = markers[globalTickInterval-1].x;
		nextY = markers[globalTickInterval-1].y;
	}
	var nextShotCoords = sprayPattern[globalShotCount+1];
	nextX += nextShotCoords.x / 10;
	nextY -= nextShotCoords.y / 10;
	markers[globalTickInterval] = {x: nextX, y: nextY, hit: isInsidePuck()};
	mousemarkers[globalTickInterval] = {x: mouseX, y: mouseY};
	puck.x = nextX;
	puck.y = nextY;
	console.log("next x:"+nextX);
	globalTickInterval++;
	if(globalTickInterval % 10 == 0) {
		globalShotCount++;
		console.log("globalShotCount: "+globalShotCount);
	}
	drawCanvas();
}

function drawCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.fill();

  for(var j = 0; j < globalTickInterval; j++) {
	ctx.fillStyle = "#202020";
	ctx.beginPath();
	ctx.fillRect(mousemarkers[j].x,mousemarkers[j].y,hitRadius,hitRadius);
	ctx.stroke();
  }
  
  var futureX = startingX;
  var futureY = startingY;
  for(var i = 0; i < 30; i++) {
	ctx.fillStyle = "#3366ff";
	ctx.beginPath();
	futureX += sprayPattern[i].x;
	futureY -= sprayPattern[i].y;
	ctx.fillRect(futureX,futureY,hitRadius,hitRadius);
	ctx.stroke();
  }
  
  for(var j = 0; j < globalTickInterval; j++) {
	  if(!markers[j].hit) {
		ctx.fillStyle = "#f00";
	  } else {
		ctx.fillStyle = "#0f0";
	  }
	ctx.beginPath();
	ctx.fillRect(markers[j].x,markers[j].y,hitRadius,hitRadius);
	ctx.stroke();
  }
  

  ctx.fillStyle = "#3366ff";
  ctx.beginPath();
  ctx.fillRect(puck.x,puck.y,puck.radius,puck.radius);//change to circle
  ctx.stroke();
}

drawCanvas();

canvas.onmousedown = function() {
	if(!isPlaying) {
		startPlaying();
	}
}

canvas.onmouseup = function() {
	if(isPlaying) {
		stopPlaying();
	}
}

canvas.onmousemove = function(e) {
	var cr = canvas.getBoundingClientRect();
	mouseX = e.clientX - cr.left;
	mouseY = e.clientY - cr.top;
}

window.onload = function() {
	drawCanvas();
}