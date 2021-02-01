const can = document.querySelector("#can");
const ctx = can.getContext("2d");
const s = can.width = can.height = 300;
const { random, cos, sin, PI, floor, abs } = Math

//helper function
const rand = (l, h) => floor(l + random() * (h - l));

const randomColor = () => {
	let str = "0123456789ABCDEFabcdef";
	let color = "#";
	for (let i = 1; i <= 6; i++) {
		color += str[rand(0, str.length)];
	}
	return color;
}

//helper Class
class DrawBaseChart {
	constructor(part, w, h, scale, isNega) {
		this.w = w;
		this.h = h;
		this.part = part;
		this.scale = scale;
		this.isNega = isNega;
		this.drawBase();
		this.wSpace;
		this.hTrue;
		this.numParts;
		this.spaceParts;
	}


	drawBase = () => {
		const wlSpace = this.w * 0.2;

		const numParts = floor(this.scale / this.part) + 1;

		if (!this.isNega) {
			const hbSpace = this.h * 0.1;
			const hTrue = this.h - hbSpace;
			const spaceParts = floor(hTrue / numParts);

			//left to right
			this.drawLine(wlSpace - 15, hTrue, this.w, hTrue);
			//top to bottom
			this.drawLine(wlSpace, 0, wlSpace, hTrue + 15);

			for (let i = 0; i < numParts; i++) {
				const y = (hTrue) - (spaceParts * i);
				const x = wlSpace;

				ctx.beginPath();
				ctx.font = "30px Comic Sans MS";
				ctx.textAlign = "right"
				ctx.fillText(`${i * this.part}`, x, y + 10);
				ctx.closePath();

				//evry number
				this.drawLine(x - 5, y, this.w, y, 1);
			}

			this.hTrue = hTrue;
			this.numParts = numParts;
			this.spaceParts = spaceParts;
		} else {
			const hbSpace = this.h * 0.5;
			const hTrue = this.h - hbSpace;
			const spaceParts = floor(hTrue / numParts);

			//left to right
			this.drawLine(wlSpace - 15, hTrue, this.w, hTrue);
			//top to bottom
			this.drawLine(wlSpace, 0, wlSpace, hTrue * 2);

			for (let j = 0; j < 2; j++) {
				for (let i = 0; i < numParts; i++) {
					const y = (j % 2 === 0) ? (hTrue) - (spaceParts * i) : (hTrue) + (spaceParts * i);
					const x = wlSpace;

					ctx.beginPath();
					ctx.font = "15px Comic Sans MS";
					ctx.textAlign = "right"
					ctx.fillText(`${(j % 2 === 0 ? i * this.part : -i * this.part)}`, x, y + 5);
					ctx.closePath();

					//evry number
					this.drawLine(x - 5, y, this.w, y, 1);
				}
			}

			this.hTrue = hTrue;
			this.numParts = numParts;
			this.spaceParts = spaceParts;
		}

		this.wSpace = wlSpace;
	}

	drawLine = (x, y, x2, y2, lw = 5) => {
		ctx.lineWidth = lw;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.stroke();
	}

}

class SetContent {
	constructor(data, numberData) {
		this.data = data;
		this.numData = numberData;
		this.index = 0
		this.setDatalie();
	}

	setDatalie = () => {
		const spaceItems = s / this.numData;

		for (let d in this.data) {
			const { color, v } = this.data[d];
			const x = 0;
			const y = (this.index + 1) * spaceItems;

			ctx.fillStyle = color;
			ctx.font = "14px Comic Sans MS";
			ctx.fillText(`${d}:${v * 100}%`, x, y);
			this.index++;
		}
	}
}

//main classes

//just data
class Circle {
	constructor(data = []) {
		this.data = this.getTrueData(data);
		this.index = 0;
		this.numberAll = data.length;
		this.drawCanvas();
	}

	getTrueData = (data) => {
		let data_ = {};
		let scale = 0;

		data.forEach((d, i) => {
			if (d.value > 0)
				scale += d.value;
			data_[(d.text) || (i + 1)] = { color: d.color || randomColor() }
		});
		data.forEach(({ value, text }, i) => {
			data_[text || (i + 1)].v = Number((value / scale).toFixed(2));
		})

		return data_
	}

	drawCanvas = () => {
		ctx.clearRect(0, 0, s, s);

		let start = 0
		const ccy = (s / 2);
		const ccx = (s / 2) + (s / 10);
		const space = 1;
		const r = 120
		const A = 2 * PI * r;
		const numberOfDots = floor(A / space);
		new SetContent(this.data, this.numberAll);

		for (let i = 0; i < numberOfDots; i += space) {
			let deg = i * (360 / numberOfDots);
			let rad = deg * PI / 180;
			let x = (cos(rad) * r) + (ccx);
			let y = sin(rad) * r + ccy;

			if (deg >= start && deg < Object.values(this.data)[this.index].v * 360 + start)
				ctx.fillStyle = ctx.strokeStyle = Object.values(this.data)[this.index].color;
			else {
				start += Object.values(this.data)[this.index].v * 360;
				this.index++;
				if (this.index >= this.numberAll) this.index = this.numberAll - 1
			}

			ctx.beginPath();
			ctx.moveTo(ccx, ccy);
			ctx.lineTo(x, y);
			ctx.closePath();
			ctx.stroke();
		}
	}
}

//At least data
//(data,scale,space parts)
//if the scale is not exist , it use of default value (500)
class Rects {
	constructor(data = [], scale = 500, numberPart = 50) {
		this.index = 0;
		this.scale = scale;
		this.part = numberPart;
		this.data = this.getData(data);
		this.numData = data.length;
		this.drawCanvas();
	}

	getData = (data) => {
		let data_ = {};
		let max = 0;
		let min = 0;

		data.forEach(({ value, text, color }, i) => {
			if (max < value) max = value;
			if (value < min) min = value;
			data_[text || (i + 1)] = { color: color || randomColor(), v: value };
		});

		this.checkScale(max, min);

		return data_;
	}


	checkScale = (max, min) => {
		const res = Math.max(max, abs(min));
		if (this.scale < res) this.scale = res;
	}

	checkNega = () => {
		for (let d in this.data) {
			const { v } = this.data[d];
			if (v < 0) return true;
		}
		return false;
	}

	drawCanvas = () => {
		ctx.clearRect(0, 0, s, s);

		const drawBase = new DrawBaseChart(this.part, s, s, this.scale, this.checkNega());
		const { hTrue, wSpace, spaceParts } = drawBase;

		const spaceItems = (s - wSpace) / (this.numData + 1) + 5;
		const wItems = spaceItems * .5;

		for (let d in this.data) {
			const { color, v } = this.data[d];
			const x = (((this.index + .6) * spaceItems) + wSpace) - wItems;
			const y = hTrue - (v / this.part) * spaceParts;
			const hRect = hTrue - y;
			ctx.fillStyle = color;
			ctx.fillRect(x, y, wItems, hRect);
			ctx.textAlign = "left"
			ctx.font = `15px Comic Sans MS`;
			ctx.fillText(`${d}`, x, (this.checkNega ? s - 10 : hTrue + ((s - hTrue) / 2) + 5));
			this.index++;
		}
	}


}

//At least data
//(data,scale,space parts)
//if the scale is not exist , it use of default value (500)
class Points extends Rects {
	constructor(data = [], scale = 500, numberPart = 50) {
		super(data, scale, numberPart);
		this.index = 0;
		this.scale = scale;
		this.part = numberPart;
		this.data = this.getData(data);
		this.numData = data.length;
		this.drawCanvas();
	}

	drawCanvas = () => {
		ctx.clearRect(0, 0, s, s);


		ctx.fillStyle = "#000000";
		const drawBase = new DrawBaseChart(this.part, s, s, this.scale, this.checkNega());
		const { hTrue, wSpace, spaceParts, drawLine } = drawBase;

		const spaceItems = (s - wSpace) / (this.numData + 1) + 5;
		const wItems = spaceItems * .5;
		const rItems = (this.checkNega()) ? 5 : 10;

		let dots = [];
		for (let d in this.data) {
			const { color, v } = this.data[d];
			const x = (((this.index + .6) * spaceItems) + wSpace) - wItems;
			const y = hTrue - (v / this.part) * spaceParts;
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.arc(x + wItems, y, rItems, 0, 2 * PI);
			ctx.closePath();
			ctx.fill();
			ctx.textAlign = "left"
			ctx.font = `15px Comic Sans MS`;
			ctx.fillText(`${d}`, x, (this.checkNega ? s - 10 : hTrue + ((s - hTrue) / 2) + 5));
			this.index++;
			dots.push({ x: x + wItems, y });
		}

		for (let i = 0; i < dots.length; i++) {
			ctx.globalCompositeOperation = 'destination-over';
			if (dots[i + 1] && dots[i + 1])
				drawLine(dots[i].x, dots[i].y, dots[i + 1].x, dots[i + 1].y, 3)
		}

	}
}