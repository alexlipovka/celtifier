// TODO:
// - add variants to knots (round corner, sharp pike, etc.)
// - add knot editor
// - add break lines
// - turn straight lines into curves

var pts = [];
var knotSpacing = 0.2;
var ptsI = [];
var ptsO = [];
var knotCells = [];
var margin = 20;
var numC = 5;
var numR = 5;
var currPatern = 0;
var lines = [];
var breakLines = [];

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
      var angL = (j - 1) * da;
      var angR = (j) * da;
      angL += Math.PI/2 + da/2;
      angR += Math.PI/2 + da/2;
      pts.push(createVector(Math.round(Math.cos(angL) * ((i-1) * ringStep + margin) + width/2), 
        Math.round(Math.sin(angL) * ((i-1) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos(angL) * ((i) * ringStep + margin) + width/2), 
        Math.round(Math.sin(angL) * ((i) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos(angR) * ((i) * ringStep + margin) + width/2), 
        Math.round(Math.sin(angR) * ((i) * ringStep + margin) + height/2)));
      pts.push(createVector(Math.round(Math.cos(angR) * ((i-1) * ringStep  + margin) + width/2), 
        Math.round(Math.sin(angR) * ((i-1) * ringStep + margin) + height/2)));
      // console.log(pts);
      // if (pts.length % 4 == 0) {
        knotCells.push(new KnotCell(pts.slice(-4)));
      // }
    }
 }


}

function generateKnotCells() {
  breakLines.length = 0;
  switch (currPatern) {
    case 0:
      generateMatrixPattern(numC, numR);
      break;
    case 1:
      generateRingPatern(numC, numR);
      break;

  }
}

function checkKnotLinks() {
  deriveLinesFromPts();
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
    for(var b of breakLines) {
      k.checkBreakLine(b);
    }
    k.checkType();
  }
}

function deriveLinesFromPts() {
  lines.length = 0;
  for(var i = 1; i < pts.length; i++) {
    if((i)%4 == 0) {
      continue;
    }
    lines.push([pts[i-1], pts[i]]);
  }
}

function ptOverLine(l, pt) {
  var d1 = pt.dist(l[0]);
  var d2 = pt.dist(l[1]);
  var dl = l[0].dist(l[1]);
  if((d1+d2) < (dl+10)) {
    return true;
  }
  return false;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(800, 800);
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

  for(var b of breakLines) {
    line(b[0].x, b[0].y, b[1].x, b[1].y);
  }

  for(var l of lines) {
    if(ptOverLine(l, m)) {
      line(l[0].x, l[0].y, l[1].x, l[1].y);
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
    numC++;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'a') {
    numC--;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'c') {
    numR++;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'z') {
    numR--;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'w') {
    knotSpacing += 0.05;
    checkKnotLinks();
  } else if(e.key == 's') {
    knotSpacing -= 0.05;
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
  } else if(e.key =='e') {
    checkKnotLinks();
  } else if(e.key =='p') {
    currPatern = ++currPatern % 2;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
    checkKnotLinks();
  } else if(e.key == 'b') {
    var m = createVector(mouseX, mouseY);
    for(var i = 0; i < breakLines.length; i++) {
      if(ptOverLine(breakLines[i], m)) {
        breakLines.splice(i,1);
        checkKnotLinks();
        return;
      }
    }
    for(var l of lines) {
      if(ptOverLine(l, m)) {
        breakLines.push(l);
        checkKnotLinks();
        return;
      }
    }
  }
}

function mouseMoved() {
  // var m = createVector(mouseX, mouseY);  
}

function mouseOverKnot() {
  var m = createVector(mouseX, mouseY)

  for(var k of knotCells) {
    if(k.ptInKnotCell(m)) {
      return k;
    }
  }
  return undefined;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}