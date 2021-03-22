const {cos, sin, PI, random, sqrt , abs} = Math;
let rand = (l, h) => ~~(l + random() * (h - l));

let img = document.querySelector('#panda');
let imgRect = img.getBoundingClientRect();
let can = document.querySelector('#can');
let ctx = can.getContext("2d");
let w = can.width = imgRect.width;
let h = can.height = imgRect.height;
const sizeDot = [.5, 2];
const speedDot = [-2, 2];
const radiusDot = [10,30]
let gap = 5;
let dot = [];

let data = getData(img).data;
img.remove();
let canRect = can.getBoundingClientRect();

function getData(img) {
	let {width, height} = img;

	let can = document.createElement('canvas');
	can.width = width;
	can.height = height;
	let ctx = can.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

	return ctx.getImageData(0, 0, width, height);
}


for (let y = 0; y < h; y += gap) {
	for (let x = 0; x < w; x += gap) {
		let i = (y * w + x) * 4;
		let avg = data.slice(i, i + 4).reduce((a, b) => a + b) / 3;
		if (avg > 30) dot.push({x, y, s: rand(...sizeDot), anime: false, speedX: rand(...speedDot), speedY: rand(...speedDot) , xx : 0 , yy : 0 , r : rand(...radiusDot)})
	}
}

function drawImg(dot) {
	ctx.clearRect(0, 0, w, h);
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#09090c";
	ctx.fillRect(0, 0, w, h);

	ctx.globalAlpha = 0.6;
	ctx.fillStyle = "white";
	for (let d of dot) {
		ctx.beginPath();
		ctx.arc(d.x + d.xx, d.y + d.yy, d.s, 0, 2 * PI);
		ctx.closePath();
		ctx.fill();
	}
}


can.onmousemove = (e) => {
	let x = ~~(e.pageX || e.clientX) - canRect.left;
	let y = ~~(e.pageY || e.clientY) - canRect.top;

	for (let d of dot) {
		if (!d.anime) {
			let dx = x - d.x;
			let dy = y - d.y;
			let dist = sqrt(dx ** 2 + dy ** 2);
			if (dist < 15) {
				d.anime = true;
			}
		}
	}
}

function show() {
	for (let d of dot) {
		if (d.anime) {
			d.xx += d.speedX;
			d.yy += d.speedY;

			if (abs(d.xx) >= d.r) d.speedX = -d.speedX;
			if (abs(d.yy) >= d.r) d.speedY = -d.speedY;

			if (d.xx + d.x === d.x && d.yy + d.y === d.y) {
				d.anime = false;
				d.speedX = rand(...speedDot);
				d.speedY = rand(...speedDot);
			}
		}
	}
	drawImg(dot);

	requestAnimationFrame(() => show())
}
show();
