var knotTypes = {
  "regular": 1,
  "topLeft": 2,
  "topRight": 3,
  "bottomLeft": 4,
  "bottomRight": 5
};

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(220);

  translate(width/2, height/2);
  drawCelticKnot(knotTypes.regular);
}

function drawCelticKnot(kType) {
  var kWidth = 400;
  var kHeight = 400;
  var kSpacing = 80;
  if(kType == knotTypes.regular) {
    rect(-kWidth/2, -kHeight/2, kWidth, kHeight);
    circle(-kWidth/2, -kHeight/2, kSpacing);
    circle(kWidth/2, -kHeight/2, kSpacing);
    circle(-kWidth/2, kHeight/2, kSpacing);
    circle(kWidth/2, kHeight/2, kSpacing);
    circle(0, 0, kSpacing);
  }
}
