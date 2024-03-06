var knotTypes = {
  "regular": 1,
  "topLeft": 2,
  "topRight": 3,
  "bottomLeft": 4,
  "bottomRight": 5,
  "top": 6,
  "bottom": 7,
  "left": 8,
  "right": 9
};

class KnotCell {
  constructor(kPts) {
    this.kPts = kPts; //p5.Vector[4]
    this.kType = knotTypes.right;
    this.row = 0;
    this.col = 0;
    this.pti = [];
    this.pto = [];
    this.ptb = [];
    this.calcPts();
  }

  calcPts() {
    var diags = [];
    var sides = [];
    for (var i = 0; i < 4; i++) {
      sides.push([this.kPts[i], this.kPts[(i + 1) % 4]]);
      diags.push(getParallelLine(this.kPts[i], this.kPts[((i + 2) % 4)], knotSpacing / 2));
    }
    for (var i = 0; i < 4; i++) {
      stroke(255 * (i + 1) / 4, 0, 0);
      // line(sides[i][0].x, sides[i][0].y, sides[i][1].x, sides[i][1].y);
      stroke(0, 255 * (i + 1) / 4, 0);
      // line(diags[i][0].x, diags[i][0].y, diags[i][1].x, diags[i][1].y);
      stroke(0, 0, 255 * (i + 1) / 4);
      this.pto.push(getIntersection(sides[i], diags[(i) % 4]));
      this.ptb.push(getIntersection(sides[(i + 3) % 4], diags[(i + 2) % 4]));
      // circle(pt.x, pt.y, 10);
      this.pti.push(getIntersection(diags[i], diags[(i + 1) % 4]));
      // circle(pti.x, pti.y, 10);
    }

  }

  drawEdge(iOff) {
    stroke(0);
      strokeWeight(4);
      line(this.pti[(0+iOff)%4].x, this.pti[(0+iOff)%4].y, this.pto[(0+iOff)%4].x, this.pto[(0+iOff)%4].y);
      for (var i = 1; i < 3; i++) {
        line(this.pti[(i+iOff)%4].x, this.pti[(i+iOff)%4].y, this.pto[(i+iOff)%4].x, this.pto[(i+iOff)%4].y);
        line(this.ptb[(i+iOff)%4].x, this.ptb[(i+iOff)%4].y, this.pto[(i+iOff)%4].x, this.pto[(i+iOff)%4].y);
      }
      var cp1 = p5.Vector.sub(this.ptb[(0+iOff)%4], this.pto[(0+iOff)%4]).setMag(60).add(this.pto[(0+iOff)%4]);
      var cp2 = p5.Vector.sub(this.pto[(3+iOff)%4], this.ptb[(3+iOff)%4]).setMag(20).add(this.pto[(3+iOff)%4]);
      bezier(this.pto[(0+iOff)%4].x, this.pto[(0+iOff)%4].y, cp1.x, cp1.y,
             cp2.x, cp2.y, this.ptb[(3+iOff)%4].x, this.ptb[(3+iOff)%4].y);
  }

  draw() {
    var cen = getIntersection([this.kPts[0], this.kPts[2]], [this.kPts[1], this.kPts[3]]);
    if (this.kType == knotTypes.regular) {
      strokeWeight(1);
      stroke(150);
      noFill();
      beginShape();
      for (var pt of this.kPts) {
        vertex(pt.x, pt.y);
      }
      endShape(CLOSE);

      stroke(150, 220, 150);
      for (pt of this.kPts) {
        // circle(pt.x, pt.y, knotSpacing);
      }
      // circle(cen.x, cen.y, knotSpacing);
      for (var i = 0; i < 4; i++) {
        stroke(0);
        strokeWeight(4);
        line(this.pti[i].x, this.pti[i].y, this.pto[i].x, this.pto[i].y);
        line(this.ptb[i].x, this.ptb[i].y, this.pto[i].x, this.pto[i].y);
      }
    } else if(this.kType == knotTypes.top) {
      this.drawEdge(0);
    } else if(this.kType == knotTypes.left) {
      this.drawEdge(1);
    } else if(this.kType == knotTypes.bottom) {
      this.drawEdge(2);
    } else if(this.kType == knotTypes.right) {
      this.drawEdge(3);
    }
  }
}

var pts = [];
var knotSpacing = 20;
var ptsI = [];
var ptsO = [];
var knotCells = [];
var margin = 50;
var num = 6;

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateKnotCells();
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
  } else if(e.key == 'a') {
    num--;
    pts.length = 0;
    knotCells.length = 0;
    generateKnotCells();
  } else if(e.key == 'w') {
    knotSpacing += 5;
    knotCells.length = 0;
    generateKnotCells();
  } else if(e.key == 's') {
    knotSpacing -= 5;
    knotCells.length = 0;
    generateKnotCells();
  }
}
