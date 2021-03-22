let rand = (l, h) => ~~(l + Math.random() * (h - l));


let can = document.createElement("canvas");
let img = document.querySelector("img");
let ctx = can.getContext("2d");
let w = can.width = Math.min(window.innerWidth, img.width);
let h = can.height = Math.min(window.innerHeight, img.height);
ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
document.body.insertBefore(can, img);
img.remove();
const less = 100;

function getData(can, func) {
	let canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	let ctx = canvas.getContext("2d");
	ctx.drawImage(can, 0, 0, can.width, can.height, 0, 0, w, h);

	let data = ctx.getImageData(0, 0, w, h);
	let d = data.data;
	for (let i = 0; i < d.length; i += 4) {
		if (func)
			func(d, i);
		else {
			d[i] -= less;
			d[i + 1] -= less;
			d[i + 2] -= less;
		}
	}

	data.data = d;

	ctx.putImageData(data, 0, 0);

	return canvas;
}


let red = getData(can, (d, i) => {
	d[i] -= less;
	d[i + 1] = d[i + 2] = 0;
})

let green = getData(can, (d, i) => {
	d[i + 1] -= less;
	d[i] = d[i + 2] = 0;
})

let blue = getData(can, (d, i) => {
	d[i + 2] -= less;
	d[i] = d[i + 1] = 0;
})

function dropImgX() {
	let canvas = getData(img);
	for (let y = 0; y < h; y += rand(20, 190)) {
		let he = rand(20, 50);
		let dix = rand(20, 50);
		ctx.drawImage(canvas, 0, y, w, he, 0, y, w + dix, he);
	}
}

function dropImgY() {
	let canvas = getData(img);
	for (let x = 0; x < w; x += rand(20, 190)) {
		let we = rand(20, 50);
		let diy = rand(20, 50);
		ctx.drawImage(canvas, x, 0, we, h, x, 0, we, h + diy);
	}
}

function colorImg() {
	let canvas = getData(img);
	ctx.drawImage(canvas, 0, 0);

	let dis = rand(20, 50);
	ctx.globalCompositeOperation = "screen";
	ctx.drawImage(red, 0, 0, w, h, -dis, 0, w + dis, h);
	ctx.drawImage(green, 0, 0, w, h, 0, 0, w + dis, h);
	ctx.drawImage(blue, 0, 0, w, h, 0, 0, w + dis, h);
	ctx.globalCompositeOperation = "source-over";
}

function show() {

	if (rand(0, 10) > 6) {
		dropImgX();
		if (rand(0,10) > 4){
			colorImg();
			if (rand(0,10) >= 5)
				dropImgY()
		}
	}else
		ctx.drawImage(getData(img), 0, 0);
}



setInterval(() => show() , 200);