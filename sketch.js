

var pts = [];
var knotSpacing = 20;
var ptsI = [];
var ptsO = [];
var knotCells = [];
var margin = 50;
var num = 7;

function generateKnotCells() {
  var gridW = (width - 2 * margin) / (num);
  var gridH = (height - 2* margin)/(num);
  for (var i = 1; i <= num; i++) {
    for (var j = 1; j <= num; j++) {
      pts.push(createVector((j - 1) * gridW + margin, (i - 1) * gridH + margin));
      pts.push(createVector((j - 1) * gridW + margin, (i) * gridH + margin));
      pts.push(createVector((j) * gridW + margin, (i) * gridH + margin));
      pts.push(createVector((j) * gridW + margin, (i - 1) * gridH + margin));
      if (pts.length % 4 == 0) {
        knotCells.push(new KnotCell(pts.slice(-4)));
      }
    }
  }
}

function checkKnotLinks() {
  for(var i = 0; i < knotCells.length; i++) {
    for(var j = i+1; j < knotCells.length; j++) {
      knotCells[i].hasCommonBorder(knotCells[j]);
    }
  }
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(800, 800);
  generateKnotCells();
  checkKnotLinks();
}

function draw() {
  background(220);

  for (k of knotCells) {
    k.draw();
  }

  var m = createVector(mouseX, mouseY)

  strokeWeight(4);
  stroke(255, 0, 0);
  for (pt of pts) {
    point(pt.x, pt.y);
  }

  noFill();
  stroke(120);
  strokeWeight(1);
  var m = createVector(mouseX, mouseY);
  var snapDist = 30*30;
  circle(m.x, m.y, 30);
  stroke(255, 0, 0);
  for (pt of pts) {
    if (m.copy().sub(pt).magSq() <= snapDist) {
      circle(pt.x, pt.y, 10);
    }
  }
}

function drawCelticKnot(kType, kPts, kSpacing) {

}

function mouseClicked() {
  var m = createVector(mouseX, mouseY)
  var snapDist = (knotSpacing / 2) * (knotSpacing / 2);
  for (pt of pts) {
    if (m.copy().sub(pt).magSq() <= snapDist) {
      pts.push(pt.copy());
      if (pts.length % 4 == 0) {
        knotCells.push(new KnotCell(pts.slice(-4)));
      }
      return;
    }
  }
  pts.push(m);
  if (pts.length % 4 == 0) {
    knotCells.push(new KnotCell(pts.slice(-4)));
  }
}

function keyPressed(e) {
  if (e.key == ' ') {
    pts.length = 0;
    knotCells.length = 0;
  } else if(e.key == 'd') {
    num++;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'a') {
    num--;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'w') {
    knotSpacing += 5;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 's') {
    knotSpacing -= 5;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  }
}
