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

function sidesAreEqual(a, b) {
	// console.log("sides", a, b);
	// console.log(a[0].equals(b[0]));
	// console.log(a[1].equals(b[1]));
	// console.log(a[1].equals(b[0]));
	// console.log(a[0].equals(b[1]));
	if((a[0].equals(b[0]) && a[1].equals(b[1])) ||
			a[1].equals(b[0]) && a[0].equals(b[1])) {
				return true;
			}
	return false;
}

function getMiddle(pt1, pt2) {
  return createVector((pt1.x + pt2.x)/2, (pt1.y + pt2.y)/2);
}

function calcLen(side) {
  return p5.Vector.sub(side[0], side[1]).mag();
}