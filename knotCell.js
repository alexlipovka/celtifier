var knotTypes = {
	"regular": 0,
	"topLeft": 1,
	"topRight": 2,
	"bottomLeft": 3,
	"bottomRight": 4,
	"top": 5,
	"bottom": 6,
	"left": 7,
	"right": 8,
	"rowLeft": 9,
	"rowRight": 10,
	"colTop": 11,
	"colBottom": 12,
	"island": 13,
	"row": 14,
	"col": 15
};

class KnotCell {
	constructor(kPts) {
		this.kPts = kPts; //p5.Vector[4]
		this.kType = knotTypes.regular;
		this.row = 0;
		this.col = 0;
		this.pti = [];
		this.pto = [];
		this.ptb = [];
		this.calcPts();
		this.links = [false, false, false, false]; //left, bottom, right, top
	}

	checkType() {
		// console.log(this.links);
		// noLoop();
		if (this.links[0] && this.links[1] && this.links[2] && this.links[3]) {
			this.kType = knotTypes.regular;
		} else if (this.links[0] && this.links[1] && this.links[2] && !this.links[3]) {
			this.kType = knotTypes.top;
		} else if (!this.links[0] && this.links[1] && this.links[2] && this.links[3]) {
			this.kType = knotTypes.left;
		} else if (this.links[0] && !this.links[1] && this.links[2] && this.links[3]) {
			this.kType = knotTypes.bottom;
		} else if (this.links[0] && this.links[1] && !this.links[2] && this.links[3]) {
			this.kType = knotTypes.right;
		} else if (!this.links[0] && this.links[1] && this.links[2] && !this.links[3]) {
			this.kType = knotTypes.topLeft;
		} else if (this.links[0] && this.links[1] && !this.links[2] && !this.links[3]) {
			this.kType = knotTypes.topRight;
		} else if (!this.links[0] && !this.links[1] && this.links[2] && this.links[3]) {
			this.kType = knotTypes.bottomLeft;
		} else if (this.links[0] && !this.links[1] && !this.links[2] && this.links[3]) {
			this.kType = knotTypes.bottomRight;
		} else if (!this.links[0] && !this.links[1] && this.links[2] && !this.links[3]) {
			this.kType = knotTypes.rowLeft;
		} else if (this.links[0] && !this.links[1] && !this.links[2] && !this.links[3]) {
			this.kType = knotTypes.rowRight;
		} else if (!this.links[0] && this.links[1] && !this.links[2] && !this.links[3]) {
			this.kType = knotTypes.colTop;
		} else if (!this.links[0] && !this.links[1] && !this.links[2] && this.links[3]) {
			this.kType = knotTypes.colBottom;
		} else if (!this.links[0] && !this.links[1] && !this.links[2] && !this.links[3]) {
			this.kType = knotTypes.island;
		}  else if (this.links[0] && !this.links[1] && this.links[2] && !this.links[3]) {
			this.kType = knotTypes.row;
		} else if (!this.links[0] && this.links[1] && !this.links[2] && this.links[3]) {
			this.kType = knotTypes.col;
		}
		this.calcPts(); 
	}

	resetLinks() {
		for(var l of this.links) {
			l = false;
		}
		this.kType = knotTypes.island;
	}

	ptInKnotCell(pt) {
		//(y - y0) (x1 - x0) - (x - x0) (y1 - y0)
		var outside = 0;
		for(var i = 1; i <= 4; i++) {
			if(((pt.y - this.kPts[i-1].y)*(this.kPts[i%4].x - this.kPts[i-1].x) - 
			(pt.x - this.kPts[i-1].x)*(this.kPts[i%4].y - this.kPts[i-1].y)) < 0) {
				outside++;
			}
		}
		return outside == 4;
	}

	shiftOrder() {
		// var pts = [];
		// for(var i = 0; i < 4; i++) {
		// 	pts.push(this.kPts[(I=1)%4]);
		// }
		this.kPts.splice(4, 0, this.kPts[0]);
		this.kPts.shift();
		this.calcPts();
	}

	calcPts() {
		var diags = [];
		var sides = [];
		this.pto.length = 0;
		this.ptb.length = 0;
		this.pti.length = 0;
		var t = 0.1;
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
			// this.pto.push(getIntersection(sides[i], diags[(i) % 4]));
			this.pto.push(p5.Vector.lerp(sides[i][0], sides[i][1], t));
			this.ptb.push(p5.Vector.lerp(sides[(i + 3) % 4][0], sides[(i + 3) % 4][1], (1-t)));
			// this.ptb.push(getIntersection(sides[(i + 3) % 4], diags[(i + 2) % 4]));
			// circle(pt.x, pt.y, 10);
			// this.pti.push(getIntersection(diags[i], diags[(i + 3) % 4]));
			// circle(pti.x, pti.y, 10);
		}
		for(var i = 0; i < 4; i++) {
			this.pti.push(p5.Vector.lerp(this.pto[i], this.ptb[(i + 2) % 4], (1-t*2)/((1-t)*2)));
		}

	}

	drawCell() {
		strokeWeight(1);
		stroke(150);
		noFill();
		beginShape();
		for (var pt of this.kPts) {
			vertex(pt.x, pt.y);
		}
		endShape(CLOSE);
	}

	drawCellFilled(c) {
		fill(c);
		noStroke();
		beginShape();
		for (var pt of this.kPts) {
			vertex(pt.x, pt.y);
		}
		endShape(CLOSE);

		fill(0);
		textSize(36);
		var cen = getIntersection([this.kPts[0], this.kPts[2]], [this.kPts[1], this.kPts[3]]);
		textAlign(CENTER, CENTER);
		text(Object.keys(knotTypes)[this.kType], cen.x, cen.y);
	}

	drawPtsIndex() {
		push();
		textSize(10);
		fill(0, 0, 255);
		noStroke();
		text(0, this.kPts[0].x + 10, this.kPts[0].y+15);
		text(1, this.kPts[1].x + 10, this.kPts[1].y-15);
		text(2, this.kPts[2].x - 10, this.kPts[2].y-15);
		text(3, this.kPts[3].x - 10, this.kPts[3].y+15);
		text(0, this.pti[0].x, this.pti[0].y);
		text(1, this.pti[1].x, this.pti[1].y);
		text(2, this.pti[2].x, this.pti[2].y);
		text(3, this.pti[3].x, this.pti[3].y);
		noFill();
		pop();
	}

	drawEdge(iOff) {
		stroke(0);
		strokeWeight(4);
		for (var i = 0; i < 2; i++) {
			line(this.pti[(i+1+iOff)%4].x, this.pti[(i+1+iOff)%4].y, this.pto[(i+0+iOff)%4].x, this.pto[(i+0+iOff)%4].y);
		}
		for (var i = 1; i < 3; i++) {
			line(this.ptb[(i+0+iOff)%4].x, this.ptb[(i+0+iOff)%4].y, this.pto[(i+0+iOff)%4].x, this.pto[(i+0+iOff)%4].y);
		}
		line(this.pti[(2+iOff)%4].x, this.pti[(2+iOff)%4].y, this.pto[(2+iOff)%4].x, this.pto[(2+iOff)%4].y);
		this.drawBezier(this.ptb[(3 + iOff) % 4], this.pto[(3 + iOff) % 4], 
			this.ptb[(0 + iOff) % 4], this.pto[(0 + iOff) % 4],
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(3+iOff)%4]])*0.3,
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(3+iOff)%4]])*0.3);
		this.drawBezier(this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4], 
			this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4],
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.5,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.5);
	}

	drawIsland() {
		stroke(20);
		strokeWeight(4);
		noFill();
		var cen = getIntersection([this.kPts[0], this.kPts[2]], [this.kPts[1], this.kPts[3]]);
		circle(cen.x, cen.y, knotSpacing);
		for(var iOff = 0; iOff < 4; iOff++) {
			this.drawBezier(getMiddle(this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]), this.kPts[(0+iOff)%4], 
				this.kPts[(0+iOff)%4], getMiddle(this.kPts[(0+iOff)%4], this.kPts[(1+iOff)%4]), 
				calcLen([this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]])*0.3, calcLen([this.kPts[(1+iOff)%4], this.kPts[(0+iOff)%4]])*0.3);
		}
	}

	drawBezier(pt1, c1, c2, pt2, mag1=60, mag2=60) {
		var cp1 = p5.Vector.sub(c1, pt1).setMag(mag1).add(pt1);
		var cp2 = p5.Vector.sub(c2, pt2).setMag(mag2).add(pt2);
		bezier(pt1.x, pt1.y, cp1.x, cp1.y, cp2.x, cp2.y, pt2.x, pt2.y);
	}

	drawPike(iOff) {
		stroke(20);
		strokeWeight(4);

		this.drawBezier(getMiddle(this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]), this.kPts[(0+iOff)%4], 
			this.ptb[(1 + iOff) % 4], this.pto[(1 + iOff) % 4], calcLen([this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]])*0.5);
		this.drawBezier(getMiddle(this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]), this.kPts[(3+iOff)%4], 
			this.pto	[(2 + iOff) % 4], this.ptb[(2 + iOff) % 4], calcLen([this.kPts[(3+iOff)%4], this.kPts[(0+iOff)%4]])*0.5);
		var mid0 = getMiddle(this.pti[(0 + iOff) % 4], this.pti[(1 + iOff) % 4]);
		var mid1 = getMiddle(this.pti[(1 + iOff) % 4], this.pti[(2 + iOff) % 4]);
		var mid2 = getMiddle(this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]);
		var mid3 = getMiddle(this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4]);
		line(mid1.x, mid1.y, this.pto[(1 + iOff) % 4].x, this.pto[(1 + iOff) % 4].y);
		line(mid0.x, mid0.y, this.pti[(1 + iOff) % 4].x, this.pti[(1 + iOff) % 4].y);
		this.drawBezier(mid1, this.pti[(2 + iOff) % 4],
			this.pti[(2 + iOff) % 4], mid2,
			calcLen([this.pti[(1 + iOff) % 4], this.pti[(2 + iOff) % 4]])*0.25,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.25);
		this.drawBezier(mid2, this.pti[(3 + iOff) % 4],
			this.pti[(3 + iOff) % 4], mid3,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.25,
			calcLen([this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4]])*0.25);
		this.drawBezier(mid3, this.pti[(0 + iOff) % 4],
			this.pti[(0 + iOff) % 4], mid0,
			calcLen([this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4]])*0.25,
			calcLen([this.pti[(0 + iOff) % 4], this.pti[(1 + iOff) % 4]])*0.25);
	}

	drawColRow(iOff) {
		stroke(20);
		strokeWeight(4);

		this.drawBezier(this.ptb[(0 + iOff) % 4], this.pto[(0 + iOff) % 4], this.ptb[(1 + iOff) % 4], this.pto[(1 + iOff) % 4],
		calcLen([this.kPts[(1+iOff)%4], this.kPts[(0+iOff)%4]])*0.3);
		this.drawBezier(this.ptb[(2 + iOff) % 4], this.pto[(2 + iOff) % 4], this.ptb[(3 + iOff) % 4], this.pto[(3 + iOff) % 4],
		calcLen([this.kPts[(3+iOff)%4], this.kPts[(2+iOff)%4]])*0.3);
		var mid0 = getMiddle(this.pti[(0 + iOff) % 4], this.pti[(1 + iOff) % 4]);
		var mid1 = getMiddle(this.pti[(1 + iOff) % 4], this.pti[(2 + iOff) % 4]);
		var mid2 = getMiddle(this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]);
		var mid3 = getMiddle(this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4]);
		line(mid1.x, mid1.y, this.pto[(1 + iOff) % 4].x, this.pto[(1 + iOff) % 4].y);
		line(mid3.x, mid3.y, this.pto[(3 + iOff) % 4].x, this.pto[(3 + iOff) % 4].y);
		line(mid0.x, mid0.y, this.pti[(1 + iOff) % 4].x, this.pti[(1 + iOff) % 4].y);
		line(mid2.x, mid2.y, this.pti[(3 + iOff) % 4].x, this.pti[(3 + iOff) % 4].y);
		this.drawBezier(mid1, this.pti[(2 + iOff) % 4],
			this.pti[(2 + iOff) % 4], mid2,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(1 + iOff) % 4]])*0.25,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.25);
		this.drawBezier(mid3, this.pti[(0 + iOff) % 4],
			this.pti[(0 + iOff) % 4], mid0,
			calcLen([this.pti[(0 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.25,
			calcLen([this.pti[(0 + iOff) % 4], this.pti[(1 + iOff) % 4]])*0.25);
	}

	drawCorner(iOff) {
		stroke(0);
		strokeWeight(4);

		this.drawBezier(this.kPts[(0 + iOff) % 4], this.pto[(0 + iOff) % 4], 
			this.ptb[(1 + iOff) % 4], this.pto[(1 + iOff) % 4],
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(1+iOff)%4]])*0.3,
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(1+iOff)%4]])*0.3);
		this.drawBezier(this.kPts[(0 + iOff) % 4], this.ptb[(0 + iOff) % 4], 
			this.pto[(3 + iOff) % 4], this.ptb[(3 + iOff) % 4],
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(3+iOff)%4]])*0.3,
			calcLen([this.kPts[(0+iOff)%4], this.kPts[(3+iOff)%4]])*0.3);
		line(this.pti[(2 + iOff) % 4].x, this.pti[(2 + iOff) % 4].y, this.pto[(1 + iOff) % 4].x, this.pto[(1 + iOff) % 4].y);
		line(this.pti[(2 + iOff) % 4].x, this.pti[(2 + iOff) % 4].y, this.pto[(2 + iOff) % 4].x, this.pto[(2 + iOff) % 4].y);
		line(this.ptb[(2 + iOff) % 4].x, this.ptb[(2 + iOff) % 4].y, this.pto[(2 + iOff) % 4].x, this.pto[(2 + iOff) % 4].y);
		var mid = getMiddle(this.pti[(3 + iOff) % 4], this.pti[(0 + iOff) % 4]);
		this.drawBezier(this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4], 
			this.pti[(3 + iOff) % 4], mid,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.5,
			calcLen([this.pti[(1 + iOff) % 4], this.pti[(0 + iOff) % 4]])*0.5);
		this.drawBezier(this.pti[(1 + iOff) % 4], this.pti[(0 + iOff) % 4], 
			this.pti[(0 + iOff) % 4], mid,
			calcLen([this.pti[(2 + iOff) % 4], this.pti[(3 + iOff) % 4]])*0.5,
			calcLen([this.pti[(1 + iOff) % 4], this.pti[(0 + iOff) % 4]])*0.5);
	}

	drawRegular() {
			stroke(0);
			strokeWeight(4);
			for (var i = 0; i < 4; i++) {
				line(this.pti[(i+1)%4].x, this.pti[(i+1)%4].y, this.pto[i].x, this.pto[i].y);
				line(this.ptb[i].x, this.ptb[i].y, this.pto[i].x, this.pto[i].y);
			}
	}

	draw() {
		// this.drawCell();
		// this.drawPtsIndex();
		noFill();

		var cen = getIntersection([this.kPts[0], this.kPts[2]], [this.kPts[1], this.kPts[3]]);
		if (this.kType == knotTypes.regular) {
			this.drawRegular();
		} else if (this.kType == knotTypes.top) {
			this.drawEdge(0);
		} else if (this.kType == knotTypes.left) {
			this.drawEdge(1);
		} else if (this.kType == knotTypes.bottom) {
			this.drawEdge(2);
		} else if (this.kType == knotTypes.right) {
			this.drawEdge(3);
		} else if (this.kType == knotTypes.topLeft) {
			this.drawCorner(0);
		} else if (this.kType == knotTypes.topRight) {
			this.drawCorner(3);
		} else if (this.kType == knotTypes.bottomLeft) {
			this.drawCorner(1);
		} else if (this.kType == knotTypes.bottomRight) {
			this.drawCorner(2);
		} else if (this.kType == knotTypes.rowLeft) {
			this.drawPike(1);
		} else if (this.kType == knotTypes.rowRight) {
			this.drawPike(3);
		} else if (this.kType == knotTypes.colTop) {
			this.drawPike(0);
		} else if (this.kType == knotTypes.colBottom) {
			this.drawPike(2);
		} else if (this.kType == knotTypes.island) {
			this.drawIsland();
		} else if (this.kType == knotTypes.col) {
			this.drawColRow(0);
		} else if (this.kType == knotTypes.row) {
			this.drawColRow(1);
		}
	}

	checkCommonBorder(knot) {
		// console.log(knot);
		// noLoop();
		if (sidesAreEqual(this.getLeft(), knot.getRight())) {
			// console.log('left')
			this.links[0] = true;
			// this.checkType();
			// knot.links[2] = true;
			// knot.checkType();
			// return true;
		} else
		if (sidesAreEqual(this.getBottom(), knot.getTop())) {
			// console.log('botom')
			this.links[1] = true;
			// this.checkType();
			// knot.links[3] = true;
			// knot.checkType();
			// return true;
		} else
		if (sidesAreEqual(this.getRight(), knot.getLeft())) {
			// console.log('right')
			this.links[2] = true;
			// this.checkType();
			// knot.links[0] = true;
			// knot.checkType();
			// return true;
		} else
		if (sidesAreEqual(this.getTop(), knot.getBottom())) {
			// console.log('top')
			this.links[3] = true;
			// this.checkType();
			// knot.links[0] = true;
			// knot.checkType();
			// return true;
		}
		// return false;
	}

	getTop() {
		return [this.kPts[3], this.kPts[0]];
	}
	getLeft() {
		return [this.kPts[0], this.kPts[1]];
	}
	getBottom() {
		return [this.kPts[1], this.kPts[2]];
	}
	getRight() {
		return [this.kPts[2], this.kPts[3]];
	}
}