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
		} else {
			this.kType = knotTypes.regular;
		}
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

	drawCell() {
		// strokeWeight(1);
		// stroke(150);
		// noFill();
		// beginShape();
		// for (var pt of this.kPts) {
		// 	vertex(pt.x, pt.y);
		// }
		// endShape(CLOSE);
	}

	drawEdge(iOff) {
		this.drawCell();

		stroke(0);
		strokeWeight(4);
		line(this.pti[(0 + iOff) % 4].x, this.pti[(0 + iOff) % 4].y, this.pto[(0 + iOff) % 4].x, this.pto[(0 + iOff) % 4].y);
		for (var i = 1; i < 3; i++) {
			line(this.pti[(i + iOff) % 4].x, this.pti[(i + iOff) % 4].y, this.pto[(i + iOff) % 4].x, this.pto[(i + iOff) % 4].y);
			line(this.ptb[(i + iOff) % 4].x, this.ptb[(i + iOff) % 4].y, this.pto[(i + iOff) % 4].x, this.pto[(i + iOff) % 4].y);
		}
		var cp1 = p5.Vector.sub(this.ptb[(0 + iOff) % 4], this.pto[(0 + iOff) % 4]).setMag(60).add(this.pto[(0 + iOff) % 4]);
		var cp2 = p5.Vector.sub(this.pto[(3 + iOff) % 4], this.ptb[(3 + iOff) % 4]).setMag(20).add(this.pto[(3 + iOff) % 4]);
		bezier(this.pto[(0 + iOff) % 4].x, this.pto[(0 + iOff) % 4].y, cp1.x, cp1.y,
			cp2.x, cp2.y, this.ptb[(3 + iOff) % 4].x, this.ptb[(3 + iOff) % 4].y);
	}

	drawCorner(iOff) {
		this.drawCell();
		stroke(0);
		strokeWeight(4);

		var cp1 = p5.Vector.sub(this.ptb[(0 + iOff) % 4], this.pto[(0 + iOff) % 4]).setMag(60).add(this.pto[(0 + iOff) % 4]);
		var cp2 = p5.Vector.sub(this.pto[(3 + iOff) % 4], this.ptb[(3 + iOff) % 4]).setMag(20).add(this.pto[(3 + iOff) % 4]);
		bezier(this.kPts[(0 + iOff) % 4].x, this.kPts[(0 + iOff) % 4].y, cp1.x, cp1.y,
			cp2.x, cp2.y, this.ptb[(3 + iOff) % 4].x, this.ptb[(3 + iOff) % 4].y);
		iOff += 1;
		cp1 = p5.Vector.sub(this.ptb[(0 + iOff) % 4], this.pto[(0 + iOff) % 4]).setMag(60).add(this.pto[(0 + iOff) % 4]);
		cp2 = p5.Vector.sub(this.pto[(3 + iOff) % 4], this.ptb[(3 + iOff) % 4]).setMag(20).add(this.pto[(3 + iOff) % 4]);
		bezier(this.pto[(0 + iOff) % 4].x, this.pto[(0 + iOff) % 4].y, cp1.x, cp1.y,
			cp2.x, cp2.y, this.kPts[(3 + iOff) % 4].x, this.kPts[(3 + iOff) % 4].y);

		// iOff += 0;
		line(this.pti[(0 + iOff) % 4].x, this.pti[(0 + iOff) % 4].y, this.pto[(0 + iOff) % 4].x, this.pto[(0 + iOff) % 4].y);
		for (var i = 1; i < 2; i++) {
			line(this.pti[(i + iOff) % 4].x, this.pti[(i + iOff) % 4].y, this.pto[(i + iOff) % 4].x, this.pto[(i + iOff) % 4].y);
			line(this.ptb[(i + iOff) % 4].x, this.ptb[(i + iOff) % 4].y, this.pto[(i + iOff) % 4].x, this.pto[(i + iOff) % 4].y);
		}
	}

	draw() {
		var cen = getIntersection([this.kPts[0], this.kPts[2]], [this.kPts[1], this.kPts[3]]);
		if (this.kType == knotTypes.regular) {
			this.drawCell();
			stroke(0);
			strokeWeight(4);
			for (var i = 0; i < 4; i++) {
				line(this.pti[i].x, this.pti[i].y, this.pto[i].x, this.pto[i].y);
				line(this.ptb[i].x, this.ptb[i].y, this.pto[i].x, this.pto[i].y);
			}
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
		}
	}

	hasCommonBorder(knot) {
		// console.log(knot);
		// noLoop();
		if (sidesAreEqual(this.getLeft(), knot.getRight())) {
			// console.log('left')
			this.links[0] = true;
			this.checkType();
			knot.links[2] = true;
			knot.checkType();
			return true;
		}
		if (sidesAreEqual(this.getBottom(), knot.getTop())) {
			// console.log('botom')
			this.links[1] = true;
			this.checkType();
			knot.links[3] = true;
			knot.checkType();
			return true;
		}
		if (sidesAreEqual(this.getRight(), knot.getLeft())) {
			// console.log('right')
			this.links[2] = true;
			this.checkType();
			knot.links[0] = true;
			knot.checkType();
			return true;
		}
		if (sidesAreEqual(this.getTop(), knot.getBottom())) {
			// console.log('top')
			this.links[3] = true;
			this.checkType();
			knot.links[0] = true;
			knot.checkType();
			return true;
		}
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