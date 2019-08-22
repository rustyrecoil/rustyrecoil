const sprayPattern = [{x: 0, y: 0}, {x: -14, y: -25}, {x: -4, y: -24}, {x: -29, y: -17}, {x: -20, y: -25},
		{x: 8, y: -13}, {x: 5, y: -14}, {x: 14, y: -3}, {x: 21, y: -13}, {x: 24, y: -11},
		{x: 14, y: -6}, {x: 21, y: 2}, {x: 7, y: -23}, {x: 16, y: -6}, {x: 3, y: -16},
		{x: -2, y: -25}, {x: -28, y: -16}, {x: -11, y: -12}, {x: -20, y: -28}, {x: -26, y: -2},
		{x: -23, y: -12}, {x: -20, y: -6}, {x: -17, y: -2}, {x: -12, y: -10}, {x: -10, y: -10},
		{x: 5, y: -23}, {x: 22, y: 3}, {x: 17, y: -29}, {x: 40, y: -16}, {x: 20, y: -17}];

const closeRangeHitbox = {body: {topX: 581, topY: 363, bottomX: 618, bottomY: 489}, head: {topX: 585, topY: 344, bottomX: 606, bottomY: 366}};
const mediumRangeHitbox = {body: {topX: 609, topY: 385, bottomX: 622, bottomY: 412}, head: {topX: 612, topY: 379, bottomX: 618, bottomY: 386}};
const longRangeHitbox = {body: {topX: 588, topY: 429, bottomX: 592, bottomY: 443}, head: {topX: 589, topY: 427, bottomX: 591, bottomY: 430}};

var hitbox = closeRangeHitbox;

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var futureSpray = document.getElementById("futureSpray");
var showHitboxes = document.getElementById("showHitboxes");

var highSpeed = document.getElementById("highSpeed");
var defaultSpeed = document.getElementById("defaultSpeed");
var halfSpeed = document.getElementById("halfSpeed");
var quarterSpeed = document.getElementById("quarterSpeed");

var closeRange = document.getElementById("closeRange");
var mediumRange = document.getElementById("mediumRange");
var longRange = document.getElementById("longRange");

var hitsDisplay = document.getElementById("hits");
var hitsPCTDisplay = document.getElementById("hitsPCT");
var hitsPCTsDisplay = document.getElementById("hitsPCTs");
var headshotsDisplay = document.getElementById("headshots");
var headshotsPCTDisplay = document.getElementById("headshotsPCT");
var headshotsPCTsDisplay = document.getElementById("headshotsPCTs");
var bodyshotsDisplay = document.getElementById("bodyshots");
var bodyshotsPCTDisplay = document.getElementById("bodyshotsPCT");
var bodyshotsPCTsDisplay = document.getElementById("bodyshotsPCTs");

var mouseX = 600;
var mouseY = 400;

var hitmarkers = [];
var globalShotInterval = 0;
var sessionshots = 0;
var isShooting = false;
var headshots = 0;
var bodyshots = 0;
var sessionheadshots = 0;
var sessionbodyshots = 0;
var shotInterval;
var speedMultiplier = 1;
var hitRadius = 5;

function getHitType(x, y) {
	if(x >= hitbox.head.topX && x <= hitbox.head.bottomX && y >= hitbox.head.topY && y <= hitbox.head.bottomY) {
		headshots++;
		sessionheadshots++;
		return 'head';
	} else if(x >= hitbox.body.topX && x <= hitbox.body.bottomX && y >= hitbox.body.topY && y <= hitbox.body.bottomY) {
		bodyshots++;
		sessionbodyshots++;
		return 'body';
	} else {
		return null;
	}
}

function shoot() {
	hitmarkers[globalShotInterval] = {x: mouseX, y: mouseY, type: getHitType(mouseX, mouseY)};

	var nextBullet = sprayPattern[globalShotInterval + 1];
	if(nextBullet != null) {
		mouseX -= nextBullet.x;
		mouseY += nextBullet.y;
	}
	globalShotInterval++;
	sessionshots++;
	
	drawCanvas();
	if(globalShotInterval == 30) {
		stopShooting();
	}
	updateStats();
}

var startShooting = function() {
	globalShotInterval = 0;
	isShooting = true;
	hitmarkers = [];
	headshots = 0;
	bodyshots = 0;
	shoot();
	shotInterval = setInterval(function(){
		shoot();
	}, 130 * speedMultiplier);
}

function stopShooting() {
	isShooting = false;
	if(shotInterval) {
		clearInterval(shotInterval);
	}
}

function updateSpeed() {
	if(highSpeed.checked) {
		speedMultiplier = 0.66;
	} else if(halfSpeed.checked) {
		speedMultiplier = 2;
	} else if(quarterSpeed.checked) {
		speedMultiplier = 4;
	} else {
		speedMultiplier = 1;
	}
}

var speedButtons = document.getElementsByName("speedRadios");

for(var i = 0; speedButtons[i]; i++) {
	speedButtons[i].onclick = updateSpeed;
}

var closeImg = new Image();
closeImg.src = "close.png";
var mediumImg = new Image();
mediumImg.src = "medium.png";
var longImg = new Image();
longImg.src = "long.png";

var bgImg = closeImg;

var rangeButtons = document.getElementsByName("rangeRadios");

function updateRange() {
	if(longRange.checked) {
		bgImg = longImg;
		hitbox = longRangeHitbox;
		hitRadius = 3;
	} else if(mediumRange.checked) {
		bgImg = mediumImg;
		hitbox = mediumRangeHitbox;
		hitRadius = 4;
	} else {
		bgImg = closeImg;
		hitbox = closeRangeHitbox;
		hitRadius = 5;
	}
}

for(var i = 0; rangeButtons[i]; i++) {
	rangeButtons[i].onclick = updateRange;
}

var gunImg = new Image();
gunImg.src = "gun.png";

function drawCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg,0,0);
  ctx.fillStyle = "#f00";
  ctx.beginPath();
  ctx.fill();
  if(showHitboxes.checked) {
	  var headWidth = hitbox.head.bottomX - hitbox.head.topX;
	  var headHeight = hitbox.head.bottomY - hitbox.head.topY;
	  ctx.rect(hitbox.head.topX,hitbox.head.topY,headWidth,headHeight);
	  ctx.stroke();
	  
	  var bodyWidth = hitbox.body.bottomX - hitbox.body.topX;
	  var bodyHeight = hitbox.body.bottomY - hitbox.body.topY;
	  ctx.rect(hitbox.body.topX,hitbox.body.topY,bodyWidth,bodyHeight);
	  ctx.stroke();
  }
  for(var i in hitmarkers) {
	if(hitmarkers[i].type) {
		ctx.fillStyle = "#f00";
	} else {
		ctx.fillStyle = "#000";
	}
	ctx.beginPath();
	ctx.fillRect(hitmarkers[i].x, hitmarkers[i].y, hitRadius, hitRadius);
	ctx.stroke();
  }
  if(futureSpray.checked) {
	  var futureX = mouseX;
	  var futureY = mouseY;
	  for(var i = globalShotInterval+1; i < 30; i++) {
		ctx.fillStyle = "#3366ff";
		ctx.beginPath();
		futureX -= sprayPattern[i].x;
		futureY += sprayPattern[i].y;
		ctx.fillRect(futureX,futureY,hitRadius,hitRadius);
		ctx.stroke();
	  }
  }
  ctx.drawImage(gunImg,mouseX -514 ,mouseY - 60);
}
drawCanvas();

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

canvas.onclick = function() {
	if(!isLocked()) {
		canvas.requestPointerLock();
	}
};

canvas.onmousedown = function() {
	if(!isShooting) {
		startShooting();
	}
}

canvas.onmouseup = function() {
	if(isShooting) {
		stopShooting();
	}
}

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (isLocked()) {
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

function isLocked() {
	if (document.pointerLockElement === canvas || document.mozPointerLockElement === canvas) {
		return true;
	}
	return false;
}

var animation;
function updatePosition(e) {
  mouseX += e.movementX;
  mouseY += e.movementY;
  if (mouseX > canvas.width) {
    mouseX = 0;
  }
  if (mouseY > canvas.height) {
    mouseY = 0;
  }  
  if (mouseX < 0) {
    mouseX = canvas.width;
  }
  if (mouseY < 0) {
    mouseY = canvas.height;
  }
  
  if (!animation) {
    animation = requestAnimationFrame(function() {
      animation = null;
      drawCanvas();
    });
  }
}

function updateStats() {
	var hits = headshots + bodyshots;
	var sessionhits = sessionbodyshots + sessionheadshots;
	hitsDisplay.innerHTML = ""+hits+"/"+globalShotInterval;
	hitsPCTDisplay.innerHTML = ""+((hits/(globalShotInterval)*100)).toFixed(1)+"%";
	hitsPCTsDisplay.innerHTML = ""+((sessionhits/(sessionshots)*100)).toFixed(1)+"%";
	headshotsDisplay.innerHTML = ""+headshots+"/"+globalShotInterval;
	headshotsPCTDisplay.innerHTML = ""+((headshots/(globalShotInterval)*100)).toFixed(1)+"%";
	headshotsPCTsDisplay.innerHTML = ""+((sessionheadshots/(sessionshots)*100)).toFixed(1)+"%";
	bodyshotsDisplay.innerHTML = ""+bodyshots+"/"+globalShotInterval;
	bodyshotsPCTDisplay.innerHTML = ""+((bodyshots/(globalShotInterval)*100)).toFixed(1)+"%";
	bodyshotsPCTsDisplay.innerHTML = ""+((sessionbodyshots/(sessionshots)*100)).toFixed(1)+"%";
}

window.onload = function() {
	drawCanvas();
}