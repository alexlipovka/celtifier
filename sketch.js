

var pts = [];
var knotSpacing = 20;
var ptsI = [];
var ptsO = [];
var knotCells = [];
var margin = 20;
var numC = 4;
var numR = 4;

function generateMatrixPattern(numRows, numCols) {
  var gridW = (width - 2 * margin) / (numCols);
  var gridH = (height - 2* margin)/(numRows);
  for (var i = 1; i <= numRows; i++) {
    for (var j = 1; j <= numCols; j++) {
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

function generateRingPatern(numSectors, numRings) {
  var da = (Math.PI * 2) / numSectors;
  var ringStep = (height/2 - margin*2)/ numRings;
  
  for(var i = 1; i <= numRings; i++) {
    for(var j = 1; j <= numSectors; j++) {
      pts.push(createVector(Math.round(Math.cos((j - 1) * da) * ((i-1) * ringStep + margin) + width/2), 
        Math.round(Math.sin((j - 1) * da) * ((i-1) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos((j - 1) * da) * ((i) * ringStep + margin) + width/2), 
        Math.round(Math.sin((j - 1) * da) * ((i) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos((j) * da) * ((i) * ringStep + margin) + width/2), 
        Math.round(Math.sin((j) * da) * ((i) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos((j) * da) * ((i-1) * ringStep  + margin) + width/2), 
        Math.round(Math.sin((j) * da) * ((i-1) * ringStep + margin) + height/2)));
      // console.log(pts);
      // if (pts.length % 4 == 0) {
        knotCells.push(new KnotCell(pts.slice(-4)));
      // }
    }
  }
  var stPts = pts.slice(0, numRings*4);
  var endPts = pts.slice(-numRings*4);
  console.log(createVector(endPts[0].x, endPts[0].y));
  // console.log(endPts);
  // for(var i = 0; i <= numRings; i++) {
    // pts.push(createVector(stPts[0].x, stPts[0].y));
    // pts.push(createVector(stPts[1].x, stPts[1].y));
    // pts.push(createVector(endPts[0].x, endPts[0].y));
    // pts.push(createVector(endPts[1].x, endPts[1].y));

    // knotCells.push(new KnotCell(pts.slice(-4)));

  // }

}

function generateKnotCells() {
  generateMatrixPattern(numC, numR);
  // generateRingPatern(numC, numR);
  // knotCells.pop();
}

function checkKnotLinks() {
  for(var k of knotCells) {
    k.resetLinks();
  }
  for(var i = 0; i < knotCells.length; i++) {
    for(var j = 0; j < knotCells.length; j++) {
      if(i != j) {
        knotCells[i].checkCommonBorder(knotCells[j]);
      }
    }
  }
  for(var k of knotCells) {
    k.checkType();
  }
  // noLoop();
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(800, 800);
  generateKnotCells();
  checkKnotLinks();
}

function draw() {
  background(220);

  
  var m = createVector(mouseX, mouseY)
  
  
  mouseOverKnot()?.drawCellFilled(210);
  
  for (k of knotCells) {
    k.draw();
  }
  strokeWeight(4);
  textSize(10);
  for (var i = 0; i < pts.length; i++) {
    stroke(255, 0, 0);
    point(pts[i].x, pts[i].y);
    noStroke();
    text(i, pts[i].x, pts[i].y);
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
  textSize(20);
  fill(0);
  text(pts.length, m.x, m.y);
}

function drawCelticKnot(kType, kPts, kSpacing) {

}

function mouseClicked() {
  var m = createVector(mouseX, mouseY)
  var snapDist = 30*30;
  for (pt of pts) {
    if (m.copy().sub(pt).magSq() <= snapDist) {
      pts.push(pt.copy());
      if (pts.length % 4 == 0) {
        knotCells.push(new KnotCell(pts.slice(-4)));
        checkKnotLinks();
      }
      return;
    }
  }
  pts.push(m);
  if (pts.length % 4 == 0) {
    knotCells.push(new KnotCell(pts.slice(-4)));
    checkKnotLinks();
  }
  checkKnotLinks();

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
    // knotCells.length = 0;
    // generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 's') {
    knotSpacing -= 5;
    // knotCells.length = 0;
    // generateKnotCells();
    if(knotSpacing <= 0) {
      knotSpacing = 0;
    }
    checkKnotLinks();
  } else if(e.key =='r') {
    mouseOverKnot()?.shiftOrder();
    checkKnotLinks();

  } else if(e.key =='q') {
    for(var k of knotCells) {
      k.resetLinks();
    }
    // checkKnotLinks();
  } else if(e.key =='e') {
    checkKnotLinks();
  }
}

function mouseMoved() {
  // var m = createVector(mouseX, mouseY);  
}

function mouseOverKnot() {
  var m = createVector(mouseX, mouseY)

  for(var k of knotCells) {
    if(k.ptInKnotCell(m)) {
      // k.drawCellFilled(150);
      // noLoop();
      return k;
    }
  }
  return undefined;
}