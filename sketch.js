var knotTypes = {
  "regular": 1,
  "topLeft": 2,
  "topRight": 3,
  "bottomLeft": 4,
  "bottomRight": 5
};

var pts = [];
var knotSpacing = 40;

function setup() {
  createCanvas(windowWidth, windowHeight);
  var margin = 100;
  var num = 3;
  var gridW = (width - 2* margin)/(num);
  var gridH = (height - 2* margin)/(num);
  for(var i = 1; i <= num; i++) {
    for(var j = 1; j <= num; j++) {
      pts.push(createVector((j-1)*gridW + margin, (i-1)*gridH+margin));
      pts.push(createVector((j-1)*gridW+margin, (i)*gridH+margin));
      pts.push(createVector((j)*gridW+margin, (i)*gridH+margin));
      pts.push(createVector((j)*gridW+margin, (i-1)*gridH+margin));
    }
  }
}

function draw() {
  background(220);

  // translate(width/2, height/2);
  // drawCelticKnot(knotTypes.regular, pts);

  for(var i = 3; i < pts.length; i+=4) {
    drawCelticKnot(knotTypes.regular, pts.slice(i-3, i+1), knotSpacing);
  }

  var m = createVector(mouseX, mouseY)
  
  for(pt of pts) {
    strokeWeight(4);
    point(pt.x, pt.y);
    noStroke();
    fill(0);
    text(m.copy().sub(pt).magSq(), pt.x+10, pt.y+10);
  }
}

function getParallelLine(a, b, off) {
  var p = p5.Vector.sub(a, b);
  p.setMag(off);
  p.rotate(-Math.PI/2);
  var l = p5.Vector.sub(a, b);
  l.setMag(off);
  l.add(l.copy());
  l.add(a);
  var end = p5.Vector.sub(b, a);
  end.setMag(off);
  end.add(end.copy());
  end.add(b);
  return [p5.Vector.add(l,p), p5.Vector.add(end,p)];
}

//a → [p5.Vector, p5.Vector]
//b → [p5.Vector, p5.Vector]
function getIntersection(a, b) {
  // console.log(a, b);
  //https://www.codeproject.com/Articles/5252711/Magic-Formula-of-the-Intersection-Point-of-Two-Lin
  var z1 = a[1].copy().sub(a[0]).cross(b[0].copy().sub(a[0])).z;
  var z2 = a[1].copy().sub(a[0]).cross(b[1].copy().sub(a[0])).z;
  var x = b[0].x - (b[1].x - b[0].x)*z1/(z2-z1);
  var y = b[0].y - (b[1].y - b[0].y)*z1/(z2-z1);
  var res = createVector(x, y);
  // console.log(res);
  // noLoop();
  // var x = ;
  // var y = (a[0].y + a[1].y + b[0].y + b[1].y) / 4;
  return res;
}

function drawCelticKnot(kType, kPts, kSpacing) {
  var cen = getIntersection([kPts[0], kPts[2]], [kPts[1], kPts[3]]);

  if(kType == knotTypes.regular) {
    strokeWeight(1);
    stroke(150);
    noFill();
    beginShape();
    for(pt of kPts) {
      vertex(pt.x, pt.y);
    }
    endShape(CLOSE);
    stroke(0, 200, 0);
    for(pt of kPts) {
      circle(pt.x, pt.y, kSpacing);
    }
    circle(cen.x, cen.y, kSpacing);
    var l1;
    var diags = [];
    var sides = [];
    for(var i = 0; i < 4; i++) {
      sides.push([kPts[i], kPts[(i+1)%4]]);
      diags.push(getParallelLine(kPts[i], kPts[((i+2)%4)], kSpacing/2));
    }
    var pto = [];
    var pti = [];
    for(var i = 0; i < 4; i++) {
      stroke(255 * (i+1)/4, 0, 0);
      // line(sides[i][0].x, sides[i][0].y, sides[i][1].x, sides[i][1].y);
      stroke(0, 255 * (i+1)/4, 0);
      // line(diags[i][0].x, diags[i][0].y, diags[i][1].x, diags[i][1].y);
      stroke(0, 0, 255 * (i+1)/4);
      pto.push(getIntersection(sides[i], diags[(i)%4]));
      // circle(pt.x, pt.y, 10);
      pti.push(getIntersection(diags[i], diags[(i+1)%4]));
      // circle(pti.x, pti.y, 10);
    }
    for(var i = 0; i < 4; i++) {
      stroke(0);
      strokeWeight(4);
      line(pti[i].x, pti[i].y, pto[i].x, pto[i].y);
    }
  }
}

function mouseClicked() {
  var m = createVector(mouseX, mouseY)
  var snapDist = (knotSpacing/2) * (knotSpacing/2);
  for(pt of pts) {
    if(m.copy().sub(pt).magSq() <= snapDist) {
      pts.push(pt.copy());
      return;
    }
  }
  pts.push(m);
}

function keyPressed(e) {
  if(e.key == ' ') {
    pts.length = 0;
  }
}
