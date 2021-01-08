let {cos, sin, PI} = Math;
let can = document.createElement("canvas");
let ctx = can.getContext("2d");
const s = can.width = can.height = 400;
const cs = ~~(s / 2);
document.body.appendChild(can);
let dot = [];
const maxRadiusCircles = 10;
const numR = cs / maxRadiusCircles;
let addDeg = 0;

function drawDots() {
	ctx.clearRect(0, 0, s, s);
	for (let i = 0; i < numR; i++) {
		const maxRadiusCircle = maxRadiusCircles - ((maxRadiusCircles / numR) * i + 2);
		let R = cs - ((i + 1) * (maxRadiusCircles * 2) - maxRadiusCircles) + ((i - 1) * (maxRadiusCircles - maxRadiusCircle));
		let A = 2 * PI * R;
		let num = ~~(A / (2 * maxRadiusCircle)) + 1;

		for (let j = 0, n = 4, part = ~~(num / n); j < n; j++) {
			for (let k = 0; k < part; k++) {
				let deg = ((j * part) + k) * (360 / num) - (i * maxRadiusCircles) - addDeg;
				let rad = deg * PI / 180;
				let x = cos(rad) * R + cs;
				let y = sin(rad) * R + cs;
				let r = maxRadiusCircle - (maxRadiusCircle / part * k)

				ctx.fillStyle = "#cccccc";
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2 * PI);
				ctx.closePath();
				ctx.fill();
			}
		}
	}
}


function animationDot() {
	addDeg += 1;
	if (addDeg >= 360) addDeg = 0
	drawDots();
}

setInterval(animationDot, 20);


